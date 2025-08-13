// cache.bal - Redis-based IP geolocation caching

import ballerinax/redis;
import ballerina/log;
import green_proxy.types;

// Redis client configuration
configurable string redisHost = "localhost";
configurable int redisPort = 6379;
configurable string redisPassword = "";

// Cache configuration
const int GEO_CACHE_TTL_SECONDS = 3600; // 1 hour TTL for geolocation
const int CARBON_CACHE_TTL_SECONDS = 1800; // 30 minutes TTL for carbon intensity
const string GEO_CACHE_KEY_PREFIX = "geoip:";
const string CARBON_CACHE_KEY_PREFIX = "carbon:";

// Redis client instance
final redis:Client redisClient = check new ({
    connection: {
        host: redisHost,
        port: redisPort,
        password: redisPassword
    }
});

// Add or update geolocation cache entry in Redis with TTL
public function putGeoLocationCache(string ip, types:GeoLocationResponse geoData) returns error? {
    string key = GEO_CACHE_KEY_PREFIX + ip;
    
    // Serialize the geolocation data to JSON string
    json geoJson = geoData.toJson();
    string geoString = geoJson.toString();
    
    // Store in Redis with TTL
    var result = redisClient->setEx(key, geoString, GEO_CACHE_TTL_SECONDS);
    if result is error {
        log:printError("Failed to cache geolocation data for IP " + ip + ": " + result.message());
        return result;
    }
    
    log:printInfo("Cached geolocation data in Redis for IP: " + ip + ", TTL: " + GEO_CACHE_TTL_SECONDS.toString() + "s");
}

// Get cached geolocation entry from Redis if valid (not expired)
public function getGeoLocationCache(string ip) returns types:GeoLocationResponse|error? {
    string key = GEO_CACHE_KEY_PREFIX + ip;
    
    // Get from Redis
    var result = redisClient->get(key);
    if result is error {
        log:printError("Failed to get cached data for IP " + ip + ": " + result.message());
        return result;
    }
    
    if result is () {
        log:printInfo("Cache miss for IP: " + ip);
        return ();
    }
    
    // Deserialize JSON string back to GeoLocationResponse
    json|error jsonData = result.fromJsonString();
    if jsonData is error {
        log:printError("Failed to parse cached JSON for IP " + ip + ": " + jsonData.message());
        return jsonData;
    }
    
    types:GeoLocationResponse|error geoData = jsonData.cloneWithType(types:GeoLocationResponse);
    if geoData is error {
        log:printError("Failed to convert cached data to GeoLocationResponse for IP " + ip + ": " + geoData.message());
        return geoData;
    }
    
    log:printInfo("Cache hit for IP: " + ip);
    return geoData;
}

// Check if IP is cached and valid in Redis
public function isGeoLocationCached(string ip) returns boolean|error {
    string key = GEO_CACHE_KEY_PREFIX + ip;
    
    var result = redisClient->exists([key]);
    if result is error {
        log:printError("Failed to check cache existence for IP " + ip + ": " + result.message());
        return result;
    }
    
    return result > 0;
}

// Add or update carbon intensity cache entry in Redis with TTL
public function putCarbonIntensityCache(string zone, types:CarbonIntensityResponse carbonData) returns error? {
    string key = CARBON_CACHE_KEY_PREFIX + zone;
    
    // Serialize the carbon intensity data to JSON string
    json carbonJson = carbonData.toJson();
    string carbonString = carbonJson.toString();
    
    // Store in Redis with TTL
    var result = redisClient->setEx(key, carbonString, CARBON_CACHE_TTL_SECONDS);
    if result is error {
        log:printError("Failed to cache carbon intensity data for zone " + zone + ": " + result.message());
        return result;
    }
    
    log:printInfo("Cached carbon intensity data in Redis for zone: " + zone + ", TTL: " + CARBON_CACHE_TTL_SECONDS.toString() + "s");
}

// Get cached carbon intensity entry from Redis if valid (not expired)
public function getCarbonIntensityCache(string zone) returns types:CarbonIntensityResponse|error? {
    string key = CARBON_CACHE_KEY_PREFIX + zone;
    
    // Get from Redis
    var result = redisClient->get(key);
    if result is error {
        log:printError("Failed to get cached carbon data for zone " + zone + ": " + result.message());
        return result;
    }
    
    if result is () {
        log:printInfo("Carbon cache miss for zone: " + zone);
        return ();
    }
    
    // Deserialize JSON string back to CarbonIntensityResponse
    json|error jsonData = result.fromJsonString();
    if jsonData is error {
        log:printError("Failed to parse cached carbon JSON for zone " + zone + ": " + jsonData.message());
        return jsonData;
    }
    
    types:CarbonIntensityResponse|error carbonData = jsonData.cloneWithType(types:CarbonIntensityResponse);
    if carbonData is error {
        log:printError("Failed to convert cached data to CarbonIntensityResponse for zone " + zone + ": " + carbonData.message());
        return carbonData;
    }
    
    log:printInfo("Carbon cache hit for zone: " + zone);
    return carbonData;
}

// Check if zone carbon intensity is cached and valid in Redis
public function isCarbonIntensityCached(string zone) returns boolean|error {
    string key = CARBON_CACHE_KEY_PREFIX + zone;
    
    var result = redisClient->exists([key]);
    if result is error {
        log:printError("Failed to check carbon cache existence for zone " + zone + ": " + result.message());
        return result;
    }
    
    return result > 0;
}

// Get cache statistics from Redis
public function getCacheStats() returns record {int geoSize; int carbonSize; int totalSize; string geoTtl; string carbonTtl; string host; int port;}|error {
    // Count geolocation keys
    var geoKeys = redisClient->keys(GEO_CACHE_KEY_PREFIX + "*");
    if geoKeys is error {
        log:printError("Failed to get geo cache keys: " + geoKeys.message());
        return geoKeys;
    }
    
    // Count carbon intensity keys
    var carbonKeys = redisClient->keys(CARBON_CACHE_KEY_PREFIX + "*");
    if carbonKeys is error {
        log:printError("Failed to get carbon cache keys: " + carbonKeys.message());
        return carbonKeys;
    }
    
    return {
        geoSize: geoKeys.length(),
        carbonSize: carbonKeys.length(),
        totalSize: geoKeys.length() + carbonKeys.length(),
        geoTtl: GEO_CACHE_TTL_SECONDS.toString() + "s",
        carbonTtl: CARBON_CACHE_TTL_SECONDS.toString() + "s",
        host: redisHost,
        port: redisPort
    };
}

// Clear all cached entries (both geo and carbon)
public function clearCache() returns error? {
    // Get all geo keys
    var geoKeys = redisClient->keys(GEO_CACHE_KEY_PREFIX + "*");
    if geoKeys is error {
        log:printError("Failed to get geo cache keys for clearing: " + geoKeys.message());
        return geoKeys;
    }
    
    // Get all carbon keys
    var carbonKeys = redisClient->keys(CARBON_CACHE_KEY_PREFIX + "*");
    if carbonKeys is error {
        log:printError("Failed to get carbon cache keys for clearing: " + carbonKeys.message());
        return carbonKeys;
    }
    
    // Combine all keys
    string[] allKeys = [];
    allKeys.push(...geoKeys);
    allKeys.push(...carbonKeys);
    
    if allKeys.length() == 0 {
        log:printInfo("No cache entries to clear");
        return;
    }
    
    // Delete all keys
    var result = redisClient->del(allKeys);
    if result is error {
        log:printError("Failed to clear cache: " + result.message());
        return result;
    }
    
    log:printInfo("Cleared " + allKeys.length().toString() + " cache entries from Redis (geo: " + geoKeys.length().toString() + ", carbon: " + carbonKeys.length().toString() + ")");
}

// Get TTL for a specific IP (for debugging)
public function getGeoCacheTTL(string ip) returns int|error {
    string key = GEO_CACHE_KEY_PREFIX + ip;
    
    var result = redisClient->ttl(key);
    if result is error {
        log:printError("Failed to get TTL for IP " + ip + ": " + result.message());
        return result;
    }
    
    return result;
}

// Get TTL for a specific zone (for debugging)
public function getCarbonCacheTTL(string zone) returns int|error {
    string key = CARBON_CACHE_KEY_PREFIX + zone;
    
    var result = redisClient->ttl(key);
    if result is error {
        log:printError("Failed to get TTL for zone " + zone + ": " + result.message());
        return result;
    }
    
    return result;
}

// Health check for Redis connection
public function isRedisHealthy() returns boolean {
    var result = redisClient->ping();
    if result is error {
        log:printError("Redis health check failed: " + result.message());
        return false;
    }
    return result == "PONG";
}