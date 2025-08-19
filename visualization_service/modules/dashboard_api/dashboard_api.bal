import ballerina/io;
import ballerina/http;
import ballerina/regex;

// Function to read JSON file content
function readJsonFile(string filePath) returns json|error {
    string content = check io:fileReadString(filePath);
    json jsonContent = check content.fromJsonString();
    return jsonContent;
}

// Get dashboard metrics from static JSON
public function getDashboardMetrics() returns json|error {
    return check readJsonFile("data/dashboard_metrics.json");
}

// Get regions data from static JSON
public function getRegions() returns json|error {
    return check readJsonFile("data/regions.json");
}

// Get system status from static JSON
public function getSystemStatus() returns json|error {
    return check readJsonFile("data/system_status.json");
}

// Get global carbon intensity data for map visualization
public function getCarbonIntensityGlobal() returns json|error {
    return check readJsonFile("data/carbon_intensity_global.json");
}

// Get cache performance statistics
public function getCacheStats() returns json|error {
    return check readJsonFile("data/cache_stats.json");
}

// Get environmental impact metrics
public function getEnvironmentalImpact() returns json|error {
    return check readJsonFile("data/environmental_impact.json");
}

// Get optimal regions based on IP geolocation
public function getOptimalRegions(string? clientIp) returns json|error {
    json optimalRegionsMapping = check readJsonFile("data/optimal_regions_mapping.json");
    
    // Mock IP to country mapping (in real implementation, this would call geolocation API)
    string detectedCountry = getCountryFromIP(clientIp);
    
    // Get optimal regions for the detected country
    map<json> mappingMap = <map<json>>optimalRegionsMapping;
    json? countryDataResult = mappingMap[detectedCountry];
    json countryData;
    
    if countryDataResult is () {
        // Fallback to default if country not found
        countryData = <json>mappingMap["default"];
    } else {
        countryData = countryDataResult;
    }
    
    // Cast to map to access fields
    map<json> countryMap = <map<json>>countryData;
    
    // Build response
    json response = {
        "clientIP": clientIp ?: "unknown",
        "detectedCountry": detectedCountry,
        "optimalRegions": countryMap["optimalRegions"],
        "recommendedRegion": countryMap["recommendedRegion"],
        "carbonIntensity": countryMap["carbonIntensity"],
        "serviceUrl": countryMap["serviceUrl"],
        "routingReason": countryMap["routingReason"]
    };
    
    return response;
}

function getCountryFromIP(string? ip) returns string {
    if ip is () {
        return "default";
    }
    
    // Mock IP to country mapping for demo purposes
    if ip.startsWith("123.231") || ip.startsWith("112.134") {
        return "Sri Lanka";
    } else if ip.startsWith("192.168") || ip.startsWith("10.0") || ip.startsWith("172.16") {
        return "United States";
    } else if ip.startsWith("203.94") {
        return "Singapore";
    } else if ip.startsWith("210.196") {
        return "Japan";
    } else if ip.startsWith("80.156") {
        return "Germany";
    } else if ip.startsWith("142.150") {
        return "Canada";
    }
    
    return "default";
}

public function getClientIP(http:Request req) returns string {
    string|http:HeaderNotFoundError xForwardedFor = req.getHeader("X-Forwarded-For");
    if xForwardedFor is string {
        // Take the first IP if there are multiple
        string[] ips = regex:split(xForwardedFor, ",");
        if ips.length() > 0 {
            return ips[0].trim();
        }
    }
    
    string|http:HeaderNotFoundError xRealIp = req.getHeader("X-Real-IP");
    if xRealIp is string {
        return xRealIp;
    }
    
    return "123.231.120.186";
}