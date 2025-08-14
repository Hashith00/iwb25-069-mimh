public type CarbonIntensityResponse record {
    string zone;
    int|float carbonIntensity;  // Changed to accept both int and float
    string datetime;
    string updatedAt;
    string createdAt;
    string emissionFactorType;
    boolean isEstimated;
    string estimationMethod;
    string temporalGranularity;
};

public type GeoLocationResponse record {
    string query;
    string status;
    string? country;
    string? countryCode;
    string? region;
    string? regionName;
    string? city;
    string? zip;
    float? lat;
    float? lon;
    string? timezone;
    string? isp;
    string? org;
    string? 'as;  
};

public type OptimalRegionResult record {
    string clientIP;
    string detectedCountry;
    string[] optimalRegions;
    string recommendedRegion;
    float? carbonIntensity;
};

// Event types
public type RoutingEvent record {
    string eventId;
    string timestamp;
    string clientIP;
    string detectedCountry;
    string[] availableRegions;
    string selectedRegion;
    string serviceUrl;
    float? carbonIntensity;
    string requestPath;
    string httpMethod;
    int processingTimeMs;
};

public type CarbonIntensityEvent record {
    string eventId;
    string timestamp;
    string region;
    float carbonIntensity;
    string dataSource;  // Changed from 'source' to 'dataSource'
    boolean cached;
};

public type HealthEvent record {
    string eventId;
    string timestamp;
    string component;
    string status;
    map<anydata> metadata;
};