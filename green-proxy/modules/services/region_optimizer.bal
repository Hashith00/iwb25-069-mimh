import ballerina/http;
import ballerina/log;

import green_proxy.types;
import green_proxy.utils;

// Find the optimal region with lowest carbon intensity
public function findOptimalRegion(string[] regions) returns types:OptimalRegionResult|error {
    if regions.length() == 0 {
        return error("No regions provided");
    }
    
    string optimalRegion = regions[0]; // Default to first region
    float optimalCarbonIntensity = float:Infinity; // Start with max value to find minimum
    
    // Get carbon intensity for all regions
    map<types:CarbonIntensityResponse> carbonData = getCarbonIntensityForRegions(regions);
    
    // Find the region with minimum carbon intensity
    foreach string region in regions {
        if carbonData.hasKey(region) {
            types:CarbonIntensityResponse? responseOpt = carbonData[region];
            if responseOpt is types:CarbonIntensityResponse {
                types:CarbonIntensityResponse response = responseOpt;
                float currentIntensity = carbonIntensityToFloat(response.carbonIntensity);
                
                log:printInfo("Region: " + region + ", Carbon Intensity: " + currentIntensity.toString());
                
                if currentIntensity < optimalCarbonIntensity {
                    optimalCarbonIntensity = currentIntensity;
                    optimalRegion = region;
                }
            }
        }
    }
    
    return {
        clientIP: "",  // Will be set by caller
        detectedCountry: "",  // Will be set by caller
        optimalRegions: regions,
        recommendedRegion: optimalRegion,
        carbonIntensity: optimalCarbonIntensity == float:Infinity ? () : optimalCarbonIntensity
    };
}

// Get optimal regions for a user based on their IP and location
public function getOptimalRegionsForUser(http:Request req) returns types:OptimalRegionResult|error {
    // Get client IP
    string clientIP = check getClientIP(req);
    
    // Get geolocation
    types:GeoLocationResponse geoResponse = check getGeolocation(clientIP);
    string country = getCountryFromGeoResponse(geoResponse);
    
    // Get available regions for this country
    string[] regions = utils:getRegions(country);
    log:printInfo("Available regions for " + country + ": " + regions.toString());
    
    // Find optimal region based on carbon intensity
    types:OptimalRegionResult result = check findOptimalRegion(regions);
    
    // Set the client info
    result.clientIP = clientIP;
    result.detectedCountry = country;
    
    return result;
}

