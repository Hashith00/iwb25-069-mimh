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
    string dataSource;
    boolean cached;
};

public type HealthEvent record {
    string eventId;
    string timestamp;
    string component;
    string status;
    map<anydata> metadata;
};

public type WebSocketMessage record {
    string 'type;
    string timestamp;
    anydata data;
};

public type DashboardStats record {
    int totalRoutingEvents;
    int totalCarbonEvents;
    int totalHealthEvents;
    int connectedClients;
    string lastEventTime;
    map<int> regionStats;
    map<float> carbonStats;
};

public type ClientConnection record {
    string connectionId;
    string connectedAt;
    boolean active;
};

public type EventFilter record {
    string[]? eventTypes;
    string[]? regions;
    float? minCarbonIntensity;
    float? maxCarbonIntensity;
    int? lastNMinutes;
};

public type AggregatedData record {
    int timeWindow; // in minutes
    map<int> eventCounts;
    map<float> avgCarbonIntensity;
    map<int> regionUsage;
};
