import ballerina/test;
import ballerina/time;
import visualization_service.types;

// Shared test data - initialized in BeforeSuite with default values
types:RoutingEvent sharedRoutingEvent = {
    eventId: "",
    timestamp: "",
    clientIP: "",
    detectedCountry: "",
    availableRegions: [],
    selectedRegion: "",
    serviceUrl: "",
    carbonIntensity: 0.0,
    requestPath: "",
    httpMethod: "",
    processingTimeMs: 0
};

types:CarbonIntensityEvent sharedCarbonEvent = {
    eventId: "",
    timestamp: "",
    region: "",
    carbonIntensity: 0.0,
    dataSource: "",
    cached: false
};

types:HealthEvent sharedHealthEvent = {
    eventId: "",
    timestamp: "",
    component: "",
    status: "",
    metadata: {}
};

types:WebSocketMessage sharedRoutingMessage = {
    'type: "",
    timestamp: "",
    data: {}
};

types:WebSocketMessage sharedCarbonMessage = {
    'type: "",
    timestamp: "",
    data: {}
};

types:WebSocketMessage sharedHealthMessage = {
    'type: "",
    timestamp: "",
    data: {}
};

types:DashboardStats sharedDashboardStats = {
    totalRoutingEvents: 0,
    totalCarbonEvents: 0,
    totalHealthEvents: 0,
    connectedClients: 0,
    lastEventTime: "",
    regionStats: {},
    carbonStats: {}
};

// BeforeSuite function to initialize test data
@test:BeforeSuite
function setupTestData() {
    // Create shared routing event
    sharedRoutingEvent = {
        eventId: "test-routing-001",
        timestamp: "2025-08-14T10:30:00Z",
        clientIP: "192.168.1.100",
        detectedCountry: "US",
        availableRegions: ["us-east-1", "us-west-2", "eu-west-1"],
        selectedRegion: "us-east-1",
        serviceUrl: "https://us-east-1.api.example.com",
        carbonIntensity: 0.45,
        requestPath: "/api/v1/data",
        httpMethod: "GET",
        processingTimeMs: 125
    };

    // Create shared carbon event
    sharedCarbonEvent = {
        eventId: "test-carbon-001",
        timestamp: "2025-08-14T10:30:00Z",
        region: "us-east-1",
        carbonIntensity: 0.35,
        dataSource: "grid-carbon-api",
        cached: true
    };

    // Create shared health event
    sharedHealthEvent = {
        eventId: "test-health-001",
        timestamp: "2025-08-14T10:30:00Z",
        component: "green-proxy-service",
        status: "healthy",
        metadata: {
            "cpu_usage": 15.5,
            "memory_usage": 45.2,
            "response_time_ms": 89,
            "active_connections": 42
        }
    };

    // Create shared websocket_service_tests messages
    sharedRoutingMessage = {
        'type: "routing",
        timestamp: "2025-08-14T10:30:00Z",
        data: sharedRoutingEvent
    };

    sharedCarbonMessage = {
        'type: "carbon",
        timestamp: "2025-08-14T10:30:00Z",
        data: sharedCarbonEvent
    };

    sharedHealthMessage = {
        'type: "health",
        timestamp: "2025-08-14T10:30:00Z",
        data: sharedHealthEvent
    };

    // Create shared dashboard stats
    sharedDashboardStats = {
        totalRoutingEvents: 150,
        totalCarbonEvents: 75,
        totalHealthEvents: 25,
        connectedClients: 5,
        lastEventTime: "2025-08-14T10:30:00Z",
        regionStats: {
            "us-east-1": 85,
            "us-west-2": 40,
            "eu-west-1": 25
        },
        carbonStats: {
            "us-east-1": 0.45,
            "us-west-2": 0.38,
            "eu-west-1": 0.28
        }
    };
}

// AfterSuite function to clean up after all tests
@test:AfterSuite
function cleanupTestData() {
    sharedRoutingEvent = {
        eventId: "",
        timestamp: "",
        clientIP: "",
        detectedCountry: "",
        availableRegions: [],
        selectedRegion: "",
        serviceUrl: "",
        carbonIntensity: 0.0,
        requestPath: "",
        httpMethod: "",
        processingTimeMs: 0
    };
    
    sharedCarbonEvent = {
        eventId: "",
        timestamp: "",
        region: "",
        carbonIntensity: 0.0,
        dataSource: "",
        cached: false
    };
    
    sharedHealthEvent = {
        eventId: "",
        timestamp: "",
        component: "",
        status: "",
        metadata: {}
    };
    
    sharedRoutingMessage = {
        'type: "",
        timestamp: "",
        data: {}
    };
    
    sharedCarbonMessage = {
        'type: "",
        timestamp: "",
        data: {}
    };
    
    sharedHealthMessage = {
        'type: "",
        timestamp: "",
        data: {}
    };
    
    sharedDashboardStats = {
        totalRoutingEvents: 0,
        totalCarbonEvents: 0,
        totalHealthEvents: 0,
        connectedClients: 0,
        lastEventTime: "",
        regionStats: {},
        carbonStats: {}
    };
}

@test:Config {groups: ["websocket_service_tests"]}
function testWebSocketMessageStructure() {
    types:WebSocketMessage message = {
        'type: "routing",
        timestamp: time:utcToString(time:utcNow()),
        data: sharedRoutingEvent
    };
    
    test:assertEquals(message.'type, "routing");
    test:assertTrue(message.timestamp is string);
    test:assertTrue(message.data is types:RoutingEvent);
    
    types:RoutingEvent extractedData = <types:RoutingEvent>message.data;
    test:assertEquals(extractedData.selectedRegion, "us-east-1");
    test:assertEquals(extractedData.carbonIntensity, 0.45);
}

@test:Config {groups: ["websocket_service_tests"]}
function testWebSocketMessageWithCarbonEvent() {    
    types:WebSocketMessage message = {
        'type: "carbon",
        timestamp: time:utcToString(time:utcNow()),
        data: sharedCarbonEvent
    };
    
    test:assertEquals(message.'type, "carbon");
    test:assertTrue(message.data is types:CarbonIntensityEvent);
    
    types:CarbonIntensityEvent extractedData = <types:CarbonIntensityEvent>message.data;
    test:assertEquals(extractedData.region, "us-east-1");
    test:assertEquals(extractedData.carbonIntensity, 0.35);
    test:assertEquals(extractedData.cached, true);
}

@test:Config {groups: ["websocket_service_tests"]}
function testWebSocketMessageWithHealthEvent() {  
    types:WebSocketMessage message = {
        'type: "health",
        timestamp: time:utcToString(time:utcNow()),
        data: sharedHealthEvent
    };
    
    test:assertEquals(message.'type, "health");
    test:assertTrue(message.data is types:HealthEvent);
    
    types:HealthEvent extractedData = <types:HealthEvent>message.data;
    test:assertEquals(extractedData.component, "green-proxy-service");
    test:assertEquals(extractedData.status, "healthy");
    test:assertTrue(extractedData.metadata.hasKey("cpu_usage"));
    test:assertTrue(extractedData.metadata.hasKey("memory_usage"));
}

@test:Config {groups: ["websocket_service_tests"]}
function testDashboardStatsStructure() {
    types:DashboardStats stats = {
        totalRoutingEvents: 10,
        totalCarbonEvents: 5,
        totalHealthEvents: 3,
        connectedClients: 2,
        lastEventTime: time:utcToString(time:utcNow()),
        regionStats: {"us-east-1": 7, "eu-west-1": 3},
        carbonStats: {"us-east-1": 0.5, "eu-west-1": 0.3}
    };
    
    test:assertEquals(stats.totalRoutingEvents, 10);
    test:assertEquals(stats.totalCarbonEvents, 5);
    test:assertEquals(stats.totalHealthEvents, 3);
    test:assertEquals(stats.connectedClients, 2);
    test:assertTrue(stats.lastEventTime is string);
    test:assertEquals(stats.regionStats.length(), 2);
    test:assertEquals(stats.carbonStats.length(), 2);
    test:assertEquals(stats.regionStats["us-east-1"], 7);
    test:assertEquals(stats.carbonStats["us-east-1"], 0.5);
}

@test:Config {groups: ["websocket_service_tests"]}
function testRoutingEventValidation() {
    test:assertTrue(sharedRoutingEvent.eventId.length() > 0);
    test:assertTrue(sharedRoutingEvent.timestamp.length() > 0);
    test:assertTrue(sharedRoutingEvent.clientIP.length() > 0);
    test:assertTrue(sharedRoutingEvent.detectedCountry.length() > 0);
    test:assertTrue(sharedRoutingEvent.availableRegions.length() > 0);
    test:assertTrue(sharedRoutingEvent.selectedRegion.length() > 0);
    test:assertTrue(sharedRoutingEvent.serviceUrl.length() > 0);
    test:assertTrue(sharedRoutingEvent.requestPath.length() > 0);
    test:assertTrue(sharedRoutingEvent.httpMethod.length() > 0);
    test:assertTrue(sharedRoutingEvent.processingTimeMs > 0);
    test:assertTrue(sharedRoutingEvent.carbonIntensity is float);
}

@test:Config {groups: ["websocket_service_tests"]}
function testCarbonEventValidation() {
    test:assertTrue(sharedCarbonEvent.eventId.length() > 0);
    test:assertTrue(sharedCarbonEvent.timestamp.length() > 0);
    test:assertTrue(sharedCarbonEvent.region.length() > 0);
    test:assertTrue(sharedCarbonEvent.carbonIntensity > 0.0);
    test:assertTrue(sharedCarbonEvent.dataSource.length() > 0);
    test:assertTrue(sharedCarbonEvent.cached is boolean);
}

@test:Config {groups: ["websocket_service_tests"]}
function testHealthEventValidation() {
    test:assertTrue(sharedHealthEvent.eventId.length() > 0);
    test:assertTrue(sharedHealthEvent.timestamp.length() > 0);
    test:assertTrue(sharedHealthEvent.component.length() > 0);
    test:assertTrue(sharedHealthEvent.status.length() > 0);
    test:assertTrue(sharedHealthEvent.metadata.length() > 0);
}

@test:Config {groups: ["websocket_service_tests"]}
function testRoutingEventWithoutCarbonIntensity() {
    types:RoutingEvent routingEvent = {
        eventId: "test-event-no-carbon",
        timestamp: time:utcToString(time:utcNow()),
        clientIP: "192.168.1.1",
        detectedCountry: "US",
        availableRegions: ["us-east-1"],
        selectedRegion: "us-east-1",
        serviceUrl: "https://api.example.com",
        carbonIntensity: (), // No carbon intensity
        requestPath: "/api/data",
        httpMethod: "GET",
        processingTimeMs: 150
    };
    
    types:WebSocketMessage message = {
        'type: "routing",
        timestamp: time:utcToString(time:utcNow()),
        data: routingEvent
    };
    
    test:assertEquals(message.'type, "routing");
    types:RoutingEvent extractedData = <types:RoutingEvent>message.data;
    test:assertEquals(extractedData.carbonIntensity, ());
    test:assertEquals(extractedData.selectedRegion, "us-east-1");
}

@test:Config {groups: ["websocket_service_tests"]}
function testMultipleRegionsInRoutingEvent() {
    types:RoutingEvent routingEvent = {
        eventId: "test-event-multi-region",
        timestamp: time:utcToString(time:utcNow()),
        clientIP: "192.168.1.1",
        detectedCountry: "US",
        availableRegions: ["us-east-1", "us-west-1", "us-west-2"],
        selectedRegion: "us-west-2",
        serviceUrl: "https://us-west-2.example.com",
        carbonIntensity: 0.3,
        requestPath: "/api/data",
        httpMethod: "POST",
        processingTimeMs: 200
    };
    
    test:assertEquals(routingEvent.availableRegions.length(), 3);
    test:assertEquals(routingEvent.selectedRegion, "us-west-2");
    test:assertEquals(routingEvent.carbonIntensity, 0.3);
    test:assertEquals(routingEvent.httpMethod, "POST");
}

@test:Config {groups: ["websocket_service_tests"]}
function testDashboardStatsWithEmptyMaps() {
    types:DashboardStats stats = {
        totalRoutingEvents: 0,
        totalCarbonEvents: 0,
        totalHealthEvents: 0,
        connectedClients: 0,
        lastEventTime: "",
        regionStats: {},
        carbonStats: {}
    };
    
    test:assertEquals(stats.totalRoutingEvents, 0);
    test:assertEquals(stats.regionStats.length(), 0);
    test:assertEquals(stats.carbonStats.length(), 0);
    test:assertEquals(stats.lastEventTime, "");
}

@test:Config {groups: ["websocket_service_tests"]}
function testWebSocketMessageSerialization() {
    types:WebSocketMessage message = {
        'type: "routing",
        timestamp: time:utcToString(time:utcNow()),
        data: sharedRoutingEvent
    };
    
    // Test that the message can be converted to JSON
    json messageJson = message.toJson();
    
    // Verify JSON structure exists
    json|error typeValue = messageJson.'type;
    test:assertTrue(typeValue is json);
    
    json|error timestampValue = messageJson.timestamp;
    test:assertTrue(timestampValue is json);
    
    json|error dataValue = messageJson.data;
    test:assertTrue(dataValue is json);
    
    // Verify actual values
    if typeValue is json {
        test:assertEquals(typeValue, "routing");
    }
    
    if timestampValue is json {
        test:assertTrue(timestampValue is string);
    }
    
    if dataValue is json {
        test:assertTrue(dataValue is json);
    }
}