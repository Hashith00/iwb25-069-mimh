import ballerina/http;

import green_proxy.types;
import green_proxy.services;
import green_proxy.cache;

service / on new http:Listener(8080) {

    // Get optimal regions for the current user based on their location
    resource function get optimal\-regions(http:Request req) returns json|http:InternalServerError {
        do {
            types:OptimalRegionResult result = check services:getOptimalRegionsForUser(req);
            
            return {
                "clientIP": result.clientIP,
                "detectedCountry": result.detectedCountry,
                "optimalRegions": result.optimalRegions,
                "recommendedRegion": result.recommendedRegion,
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

    // Cache management endpoint - get cache statistics
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

    // Cache management endpoint - clear cache (for admin purposes)
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

    // Health check endpoint including Redis status
    resource function get health() returns json {
        return {
            "status": "UP",
            "cache": {
                "redis": cache:isRedisHealthy()
            }
        };
    }
}