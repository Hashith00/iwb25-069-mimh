import ballerina/http;
import ballerina/log;

import green_proxy.types;
import green_proxy.services;
import green_proxy.cache;
import green_proxy.utils;

service / on new http:Listener(8080) {

    // Wildcard route
    resource function 'default [string... path](http:Request req) returns http:Response|http:InternalServerError {
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
            http:Response response = check targetClient->forward(targetPath, req);
            
            // Add region info to response headers
            response.setHeader("X-Green-Proxy-Region", recommendedRegion);
            response.setHeader("X-Green-Proxy-Country", result.detectedCountry);
            if result.carbonIntensity is float {
                response.setHeader("X-Green-Proxy-Carbon-Intensity", result.carbonIntensity.toString());
            }
            
            return response;
        } on fail var err {
            // If the regional service is unavailable, return a helpful error
            log:printError("Failed to route request: " + err.message());
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

    resource function get health() returns json {
        return {
            "status": "UP",
            "cache": {
                "redis": cache:isRedisHealthy()
            }
        };
    }
}