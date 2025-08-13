// types.bal - All record type definitions

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
    string? 'as;  // 'as' is a reserved keyword, so we use quotes
};

public type OptimalRegionResult record {
    string clientIP;
    string detectedCountry;
    string[] optimalRegions;
    string recommendedRegion;
    float? carbonIntensity;
};