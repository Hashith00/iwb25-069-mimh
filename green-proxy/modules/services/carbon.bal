// carbon.bal - Carbon intensity API operations

import ballerina/http;
import ballerina/log;

// Import modules
import green_proxy.types;
import green_proxy.cache;
import green_proxy.kafka;

configurable string carbon_api_key = ?;

final http:Client carbonIntensityClient = check new ("http://localhost:3100/api/v1");

// Get carbon intensity for a specific region/zone (with Redis caching)
public function getCarbonIntensity(string zone) returns types:CarbonIntensityResponse|error {
    // Check Redis cache first
    do {
        types:CarbonIntensityResponse|error? cachedData = cache:getCarbonIntensityCache(zone);
        if cachedData is types:CarbonIntensityResponse {
            // Publish cached carbon intensity event to Kafka
            do {
                float carbonValue = carbonIntensityToFloat(cachedData.carbonIntensity);
                check kafka:publishCarbonIntensityEvent(zone, carbonValue, "cache", true);
            } on fail var kafkaErr {
                log:printWarn("Failed to publish cached carbon intensity event to Kafka: " + kafkaErr.message());
            }
            return cachedData;
        }
    } on fail var cacheError {
        // Log cache error but continue with API call
        log:printWarn("Carbon cache lookup failed for zone " + zone + ": " + cacheError.message());
    }
    
    // Cache miss or error - fetch from API
    if carbon_api_key == "" {
        return error("Missing CARBON_API_KEY environment variable");
    }
    
    // Create the path with query parameter
    string path = "/carbon-intensity/latest?zone=" + zone;
    
    // Create headers
    map<string|string[]> headers = {"auth-token": carbon_api_key};
    
    // Make the GET request
    json jsonResponse = check carbonIntensityClient->get(path, headers);
    
    log:printInfo("Fetched carbon intensity data from API for zone " + zone + ": " + jsonResponse.toString());
    
    // Convert to our record type
    types:CarbonIntensityResponse response = check jsonResponse.cloneWithType(types:CarbonIntensityResponse);
    
    // Try to cache the response (don't fail if caching fails)
    do {
        check cache:putCarbonIntensityCache(zone, response);
    } on fail var cacheError {
        log:printWarn("Failed to cache carbon intensity data for zone " + zone + ": " + cacheError.message());
    }
    
    // Publish carbon intensity event to Kafka
    do {
        float carbonValue = carbonIntensityToFloat(response.carbonIntensity);
        check kafka:publishCarbonIntensityEvent(zone, carbonValue, "api", false);
    } on fail var kafkaErr {
        log:printWarn("Failed to publish carbon intensity event to Kafka: " + kafkaErr.message());
    }
    
    return response;
}

// Get carbon intensity for multiple regions and return the results
public function getCarbonIntensityForRegions(string[] regions) returns map<types:CarbonIntensityResponse> {
    map<types:CarbonIntensityResponse> results = {};
    
    foreach string region in regions {
        do {
            types:CarbonIntensityResponse response = check getCarbonIntensity(region);
            results[region] = response;
            log:printInfo("Carbon intensity for region " + region + ": " + response.carbonIntensity.toString());
        } on fail var err {
            log:printWarn("Failed to get carbon intensity for region " + region + ": " + err.message());
            // Continue with next region if one fails
        }
    }
    
    return results;
}

// Convert carbonIntensity value to float for comparison
public function carbonIntensityToFloat(int|float value) returns float {
    return value is int ? <float>value : <float>value;
}