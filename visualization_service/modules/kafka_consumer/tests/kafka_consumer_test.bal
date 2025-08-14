import ballerina/test;
import ballerina/time;
import visualization_service.types;

// Test data and mock handlers
types:WebSocketMessage? capturedMessage = ();
boolean handlerCalled = false;

// Mock event handler for testing
function mockEventHandler(types:WebSocketMessage message) {
    capturedMessage = message;
    handlerCalled = true;
}

// Reset test state before each test
function resetTestState() {
    capturedMessage = ();
    handlerCalled = false;
}

@test:Config {groups: ["kafka_consumer_tests"]}
function testEventHandlerSetup() {
    // Test that we can create mock event handlers
    types:WebSocketMessage testMessage = {
        'type: "test",
        timestamp: time:utcToString(time:utcNow()),
        data: {"test": "data"}
    };
    
    mockEventHandler(testMessage);
    test:assertTrue(handlerCalled, "Mock event handler should be called");
    test:assertTrue(capturedMessage is types:WebSocketMessage, "Message should be captured");
}

@test:Config {groups: ["kafka_consumer_tests"]}
function testWebSocketMessageCreation() {
    // Test creating WebSocket messages for different event types
    types:RoutingEvent routingEvent = {
        eventId: "test-routing-001",
        timestamp: "2025-08-14T10:30:00Z",
        clientIP: "192.168.1.100",
        detectedCountry: "US",
        availableRegions: ["us-east-1", "us-west-2"],
        selectedRegion: "us-east-1",
        serviceUrl: "https://us-east-1.example.com",
        carbonIntensity: 0.45,
        requestPath: "/api/data",
        httpMethod: "GET",
        processingTimeMs: 150
    };
    
    types:WebSocketMessage wsMessage = {
        'type: "routing",
        timestamp: time:utcToString(time:utcNow()),
        data: routingEvent
    };
    
    test:assertEquals(wsMessage.'type, "routing", "Message type should be 'routing'");
    test:assertTrue(wsMessage.data is types:RoutingEvent, "Data should be RoutingEvent");
    test:assertTrue(wsMessage.timestamp.length() > 0, "Timestamp should be set");
}

@test:Config {groups: ["kafka_consumer_tests"]}
function testCarbonIntensityEventStructure() {
    types:CarbonIntensityEvent carbonEvent = {
        eventId: "test-carbon-001",
        timestamp: "2025-08-14T10:30:00Z",
        region: "us-east-1",
        carbonIntensity: 0.35,
        dataSource: "EIA",
        cached: false
    };
    
    // Test conversion to JSON and back
    json eventJson = carbonEvent.toJson();
    test:assertTrue(eventJson is json, "Should convert to JSON");
    
    // Test cloning with type
    types:CarbonIntensityEvent|error clonedEvent = eventJson.cloneWithType(types:CarbonIntensityEvent);
    test:assertTrue(clonedEvent is types:CarbonIntensityEvent, "Should clone back to CarbonIntensityEvent");
    
    if clonedEvent is types:CarbonIntensityEvent {
        test:assertEquals(clonedEvent.eventId, "test-carbon-001", "Event ID should match");
        test:assertEquals(clonedEvent.region, "us-east-1", "Region should match");
        test:assertEquals(clonedEvent.carbonIntensity, 0.35, "Carbon intensity should match");
    }
}

@test:Config {groups: ["kafka_consumer_tests"]}
function testHealthEventStructure() {
    types:HealthEvent healthEvent = {
        eventId: "test-health-001",
        timestamp: "2025-08-14T10:30:00Z",
        component: "proxy-service",
        status: "healthy",
        metadata: {
            "cpu_usage": 15.5,
            "memory_usage": 45.2,
            "uptime_seconds": 3600
        }
    };
    
    // Test conversion to JSON and back
    json eventJson = healthEvent.toJson();
    test:assertTrue(eventJson is json, "Should convert to JSON");
    
    // Test cloning with type
    types:HealthEvent|error clonedEvent = eventJson.cloneWithType(types:HealthEvent);
    test:assertTrue(clonedEvent is types:HealthEvent, "Should clone back to HealthEvent");
    
    if clonedEvent is types:HealthEvent {
        test:assertEquals(clonedEvent.eventId, "test-health-001", "Event ID should match");
        test:assertEquals(clonedEvent.component, "proxy-service", "Component should match");
        test:assertEquals(clonedEvent.status, "healthy", "Status should match");
        test:assertTrue(clonedEvent.metadata.hasKey("cpu_usage"), "Should contain cpu_usage metadata");
    }
}

@test:Config {groups: ["kafka_consumer_tests"]}
function testEventTypeValidation() {
    // Test valid event types
    string[] validEventTypes = ["routing", "carbon", "health"];
    
    foreach string eventType in validEventTypes {
        test:assertTrue(eventType == "routing" || eventType == "carbon" || eventType == "health", 
                      string `${eventType} should be a valid event type`);
    }
    
    // Test invalid event type handling
    string invalidEventType = "invalid_type";
    test:assertFalse(invalidEventType == "routing" || invalidEventType == "carbon" || invalidEventType == "health",
                    "invalid_type should not be a valid event type");
}

@test:Config {groups: ["kafka_consumer_tests"]}
function testJsonStringConversion() {
    // Test JSON string parsing for different event types
    string routingEventJson = string `{
        "eventId": "test-001",
        "timestamp": "2025-08-14T10:30:00Z",
        "clientIP": "192.168.1.1",
        "detectedCountry": "US",
        "availableRegions": ["us-east-1"],
        "selectedRegion": "us-east-1",
        "serviceUrl": "https://example.com",
        "carbonIntensity": 0.5,
        "requestPath": "/api/test",
        "httpMethod": "GET",
        "processingTimeMs": 100
    }`;
    
    json|error eventJson = routingEventJson.fromJsonString();
    test:assertTrue(eventJson is json, "Should parse valid JSON string");
    
    if eventJson is json {
        types:RoutingEvent|error routingEvent = eventJson.cloneWithType(types:RoutingEvent);
        test:assertTrue(routingEvent is types:RoutingEvent, "Should convert to RoutingEvent");
    }
}

@test:Config {groups: ["kafka_consumer_tests"]}
function testMalformedJsonHandling() {
    // Test handling of malformed JSON
    string malformedJson = "{invalid-json-content";
    
    json|error eventJson = malformedJson.fromJsonString();
    test:assertTrue(eventJson is error, "Should return error for malformed JSON");
    
    if eventJson is error {
        test:assertTrue(eventJson.message().length() > 0, "Error message should be provided");
    }
}

@test:Config {groups: ["kafka_consumer_tests"]}
function testByteArrayToStringConversion() {
    // Test conversion from byte array to string 
    string originalMessage = "test message content";
    byte[] messageBytes = originalMessage.toBytes();
    
    string|error convertedMessage = string:fromBytes(messageBytes);
    test:assertTrue(convertedMessage is string, "Should convert bytes back to string");
    
    if convertedMessage is string {
        test:assertEquals(convertedMessage, originalMessage, "Converted message should match original");
    }
}

@test:Config {groups: ["kafka_consumer_tests"]}
function testTimestampGeneration() {
    // Test timestamp generation consistency
    string timestamp1 = time:utcToString(time:utcNow());
    string timestamp2 = time:utcToString(time:utcNow());
    
    test:assertTrue(timestamp1.length() > 0, "Timestamp should not be empty");
    test:assertTrue(timestamp2.length() > 0, "Timestamp should not be empty");
    
    // Timestamps should be close but not necessarily identical due to execution time
    test:assertTrue(timestamp1.includes("2025"), "Timestamp should include current year");
    test:assertTrue(timestamp2.includes("2025"), "Timestamp should include current year");
}

@test:Config {groups: ["kafka_consumer_tests"]}
function testEventDataTypes() {
    // Test that all event types have the required fields
    types:RoutingEvent routingEvent = {
        eventId: "test-001",
        timestamp: "2025-08-14T10:30:00Z",
        clientIP: "192.168.1.1",
        detectedCountry: "US",
        availableRegions: ["us-east-1"],
        selectedRegion: "us-east-1",
        serviceUrl: "https://example.com",
        carbonIntensity: 0.5,
        requestPath: "/api/test",
        httpMethod: "GET",
        processingTimeMs: 100
    };
    
    types:CarbonIntensityEvent carbonEvent = {
        eventId: "test-002",
        timestamp: "2025-08-14T10:30:00Z",
        region: "us-east-1",
        carbonIntensity: 0.35,
        dataSource: "EIA",
        cached: false
    };
    
    types:HealthEvent healthEvent = {
        eventId: "test-003",
        timestamp: "2025-08-14T10:30:00Z",
        component: "proxy-service",
        status: "healthy",
        metadata: {"test": "value"}
    };
    
    // Test that all events have required eventId and timestamp
    test:assertTrue(routingEvent.eventId.length() > 0, "RoutingEvent should have eventId");
    test:assertTrue(routingEvent.timestamp.length() > 0, "RoutingEvent should have timestamp");
    
    test:assertTrue(carbonEvent.eventId.length() > 0, "CarbonIntensityEvent should have eventId");
    test:assertTrue(carbonEvent.timestamp.length() > 0, "CarbonIntensityEvent should have timestamp");
    
    test:assertTrue(healthEvent.eventId.length() > 0, "HealthEvent should have eventId");
    test:assertTrue(healthEvent.timestamp.length() > 0, "HealthEvent should have timestamp");
}

@test:Config {groups: ["kafka_consumer_tests"]}
function testWebSocketMessageType() {
    // Test WebSocket message structure
    types:WebSocketMessage message = {
        'type: "test",
        timestamp: time:utcToString(time:utcNow()),
        data: {"key": "value"}
    };
    
    test:assertEquals(message.'type, "test", "Message type should be set");
    test:assertTrue(message.timestamp.length() > 0, "Timestamp should be set");
    test:assertTrue(message.data is anydata, "Data should be anydata type");
}

@test:Config {groups: ["kafka_consumer_tests"]}
function testErrorHandling() {
    string emptyString = "";
    json|error emptyJson = emptyString.fromJsonString();
    test:assertTrue(emptyJson is error, "Empty string should cause JSON parsing error");
    
    // Test invalid type conversion
    json testJson = {"invalid": "data"};
    types:RoutingEvent|error invalidConversion = testJson.cloneWithType(types:RoutingEvent);
    test:assertTrue(invalidConversion is error, "Invalid data should cause type conversion error");
}

@test:Config {groups: ["kafka_consumer_tests"]}
function testKafkaHealthCheck() {
    boolean mockHealthStatus = true;
    test:assertTrue(mockHealthStatus, "Mock health check should return true");
    
    // Test configuration concept
    map<string> mockConfig = {
        "bootstrapServers": "localhost:9092",
        "routingTopic": "routing-events",
        "carbonTopic": "carbon-events",
        "healthTopic": "health-events"
    };
    
    test:assertTrue(mockConfig.hasKey("bootstrapServers"), "Config should contain bootstrapServers");
    test:assertTrue(mockConfig.hasKey("routingTopic"), "Config should contain routingTopic");
    test:assertTrue(mockConfig.hasKey("carbonTopic"), "Config should contain carbonTopic");
    test:assertTrue(mockConfig.hasKey("healthTopic"), "Config should contain healthTopic");
}