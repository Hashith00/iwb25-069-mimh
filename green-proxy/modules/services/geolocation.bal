import ballerina/http;
import ballerina/regex;
import ballerina/log;

import green_proxy.types;
import green_proxy.cache;

final http:Client geoLocationClient = check new ("http://ip-api.com/json");

// Extract client IP from HTTP request headers
public function getClientIP(http:Request req) returns string|error {
    string clientIP = "";
    
    // First, try to get IP from proxy headers (if behind a proxy/load balancer)
    string|http:HeaderNotFoundError forwardedFor = req.getHeader("X-Forwarded-For");
    if forwardedFor is string {
        // X-Forwarded-For can contain multiple IPs, take the first one
        string[] ips = regex:split(forwardedFor, "\\s*,\\s*");
        clientIP = ips[0];
    } else {
        string|http:HeaderNotFoundError realIP = req.getHeader("X-Real-IP");
        if realIP is string {
            clientIP = realIP;
        }
    }
    
    // If no proxy headers found, get the actual remote address from the request context
    if clientIP == "" {
        do {
            json ipResponse = check geoLocationClient->get("/");
            json|error queryField = ipResponse.query;
            if queryField is string {
                clientIP = queryField;
            } else {
                clientIP = "127.0.0.1"; // Fallback for local testing
            }
        } on fail {
            clientIP = "127.0.0.1"; // Fallback for local testing
        }
    }
    
    return clientIP;
}

// Get geolocation data for an IP address (with Redis caching)
public function getGeolocation(string ip) returns types:GeoLocationResponse|error {
    // Check Redis cache first
    do {
        types:GeoLocationResponse|error? cachedData = cache:getGeoLocationCache(ip);
        if cachedData is types:GeoLocationResponse {
            return cachedData;
        }
    } on fail var cacheError {
        // Log cache error but continue with API call
        log:printWarn("Cache lookup failed for IP " + ip + ": " + cacheError.message());
    }
    
    // Cache miss or error - fetch from API
    types:GeoLocationResponse geoResponse = check geoLocationClient->get("/" + ip);
    log:printInfo("Fetched geolocation data from API for IP " + ip + ": " + geoResponse.toString());
    
    // Try to cache the response (don't fail if caching fails)
    do {
        check cache:putGeoLocationCache(ip, geoResponse);
    } on fail var cacheError {
        log:printWarn("Failed to cache geolocation data for IP " + ip + ": " + cacheError.message());
    }
    
    return geoResponse;
}

// Get country from geolocation response with fallback
public function getCountryFromGeoResponse(types:GeoLocationResponse geoResponse) returns string {
    return geoResponse.country ?: "Unknown";
}