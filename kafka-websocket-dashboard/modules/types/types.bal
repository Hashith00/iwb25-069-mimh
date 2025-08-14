// types.bal - Type definitions for Kafka WebSocket Dashboard

// Event types from Kafka
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

// WebSocket message types
public type WebSocketMessage record {
    string 'type; // "routing", "carbon", "health"
    string timestamp;
    anydata data;
};

// Helper function to convert WebSocketMessage to JSON
public function webSocketMessageToJson(WebSocketMessage message) returns json {
    json dataJson = message.data is json ? <json>message.data : message.data.toJson();
    return {
        "type": message.'type,
        "timestamp": message.timestamp,
        "data": dataJson
    };
}

// Dashboard statistics
public type DashboardStats record {
    int totalRoutingEvents;
    int totalCarbonEvents;
    int totalHealthEvents;
    int connectedClients;
    string lastEventTime;
    map<int> regionStats;
    map<float> carbonStats;
};

// Client connection info
public type ClientConnection record {
    string connectionId;
    string connectedAt;
    boolean active;
};

// Event filter
public type EventFilter record {
    string[]? eventTypes; // ["routing", "carbon", "health"]
    string[]? regions;
    float? minCarbonIntensity;
    float? maxCarbonIntensity;
    int? lastNMinutes; // Only events from last N minutes
};

// Aggregated event data
public type AggregatedData record {
    int timeWindow; // in minutes
    map<int> eventCounts;
    map<float> avgCarbonIntensity;
    map<int> regionUsage;
};
