import ballerina/http;
import ballerina/log;
import ballerina/time;

import green_proxy.types;
import green_proxy.services;
import green_proxy.cache;
import green_proxy.utils;
import green_proxy.kafka;

service / on new http:Listener(8080) {

    // Wildcard route
    resource function 'default [string... path](http:Request req) returns http:Response|http:InternalServerError {
        int startTime = time:utcNow()[0];
        
        do {
            // Get optimal region for the user
            types:OptimalRegionResult result = check services:getOptimalRegionsForUser(req);
            string recommendedRegion = result.recommendedRegion;
            
            // Get service URL for the recommended region
            string serviceUrl = utils:getServiceUrl(recommendedRegion);
            
            // Build target URL with the original path
            string targetPath = "/" + string:'join("/", ...path);
            string targetUrl = serviceUrl + targetPath;
            
            log:printInfo("Routing request to region: " + recommendedRegion + " at URL: " + targetUrl);
            
            // Create HTTP client for the target service with timeout
            http:Client targetClient = check new (serviceUrl, {
                timeout: 5000 // 5 second timeout
            });
            
            // Forward the request to the target service
            // For GET and DELETE requests, we don't need to forward the body
            http:Response response;
            string method = req.method;
            if method == "GET" || method == "DELETE" {
                if method == "GET" {
                    response = check targetClient->get(targetPath);
                } else {
                    response = check targetClient->delete(targetPath);
                }
            } else {
                response = check targetClient->forward(targetPath, req);
            }
            
            // Add region info to response headers
            response.setHeader("X-Green-Proxy-Region", recommendedRegion);
            response.setHeader("X-Green-Proxy-Country", result.detectedCountry);
            if result.carbonIntensity is float {
                response.setHeader("X-Green-Proxy-Carbon-Intensity", result.carbonIntensity.toString());
            }
            
            // Calculate processing time
            int endTime = time:utcNow()[0];
            int processingTimeMs = (endTime - startTime) * 1000;
            
            // Publish routing event to Kafka (async - don't fail on Kafka errors)
            do {
                check kafka:publishRoutingEvent(
                    result.clientIP,
                    result.detectedCountry,
                    result.optimalRegions,
                    recommendedRegion,
                    serviceUrl,
                    result.carbonIntensity,
                    targetPath,
                    method,
                    processingTimeMs
                );
            } on fail var kafkaErr {
                log:printWarn("Failed to publish routing event to Kafka: " + kafkaErr.message());
            }
            
            return response;
        } on fail var err {
            // Calculate processing time for error case
            int endTime = time:utcNow()[0];
            int processingTimeMs = (endTime - startTime) * 1000;
            
            // If the regional service is unavailable, return a helpful error
            log:printError("Failed to route request: " + err.message());
            
            // Publish error event to Kafka
            do {
                check kafka:publishHealthEvent("green-proxy", "ERROR", {
                    "error": err.message(),
                    "processingTimeMs": processingTimeMs,
                    "path": "/" + string:'join("/", ...path)
                });
            } on fail var kafkaErr {
                log:printWarn("Failed to publish error event to Kafka: " + kafkaErr.message());
            }
            
            return <http:InternalServerError>{
                body: {
                    "error": "Failed to route request",
                    "message": err.message(),
                    "suggestion": "Please check the debug endpoint to see which region was selected and ensure the regional service is running"
                }
            };
        }
    }

    // Get optimal regions info without proxying
    resource function get debug/regions(http:Request req) returns json|http:InternalServerError {
        do {
            types:OptimalRegionResult result = check services:getOptimalRegionsForUser(req);
            string serviceUrl = utils:getServiceUrl(result.recommendedRegion);
            
            return {
                "clientIP": result.clientIP,
                "detectedCountry": result.detectedCountry,
                "optimalRegions": result.optimalRegions,
                "recommendedRegion": result.recommendedRegion,
                "serviceUrl": serviceUrl,
                "carbonIntensity": result.carbonIntensity
            };
        } on fail var err {
            return <http:InternalServerError>{
                body: {
                    "error": "Failed to determine optimal regions",
                    "message": err.message()
                }
            };
        }
    }

    // Get cache statistics
    resource function get cache/stats() returns json|http:InternalServerError {
        do {
            var stats = check cache:getCacheStats();
            return {
                "geolocation": {
                    "size": stats.geoSize,
                    "ttl": stats.geoTtl
                },
                "carbonIntensity": {
                    "size": stats.carbonSize,
                    "ttl": stats.carbonTtl
                },
                "total": {
                    "size": stats.totalSize
                },
                "redis": {
                    "host": stats.host,
                    "port": stats.port,
                    "healthy": cache:isRedisHealthy()
                }
            };
        } on fail var err {
            return <http:InternalServerError>{
                body: {
                    "error": "Failed to get cache statistics",
                    "message": err.message()
                }
            };
        }
    }

    resource function delete cache() returns json|http:InternalServerError {
        do {
            check cache:clearCache();
            return {"message": "Cache cleared successfully"};
        } on fail var err {
            return <http:InternalServerError>{
                body: {
                    "error": "Failed to clear cache",
                    "message": err.message()
                }
            };
        }
    }

    // Get Kafka configuration and status
    resource function get kafka/info() returns json {
        return {
            "config": kafka:getKafkaConfig(),
            "healthy": kafka:isKafkaHealthy(),
            "topics": {
                "routing": kafka:getKafkaConfig()["routingTopic"],
                "carbon": kafka:getKafkaConfig()["carbonTopic"],
                "health": kafka:getKafkaConfig()["healthTopic"]
            }
        };
    }

    // Manually trigger a test event to Kafka
    resource function post kafka/test() returns json|http:InternalServerError {
        do {
            // Publish a test event
            check kafka:publishHealthEvent("green-proxy-test", "TEST", {
                "timestamp": time:utcToString(time:utcNow()),
                "message": "Manual test event triggered"
            });
            
            return {"message": "Test event published to Kafka successfully"};
        } on fail var err {
            return <http:InternalServerError>{
                body: {
                    "error": "Failed to publish test event to Kafka",
                    "message": err.message()
                }
            };
        }
    }

    resource function get health() returns json {
        json healthData = {
            "status": "UP",
            "cache": {
                "redis": cache:isRedisHealthy()
            },
            "kafka": {
                "healthy": kafka:isKafkaHealthy(),
                "config": kafka:getKafkaConfig()
            }
        };
        
        // Publish health event to Kafka (async)
        do {
            map<anydata> healthMap = <map<anydata>>healthData;
            check kafka:publishHealthEvent("green-proxy", "UP", healthMap);
        } on fail var kafkaErr {
            log:printWarn("Failed to publish health event to Kafka: " + kafkaErr.message());
        }
        
        return healthData;
    }
}