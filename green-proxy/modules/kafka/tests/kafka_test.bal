// kafka_test.bal - Tests for Kafka integration

import ballerina/test;
import ballerina/log;
import green_proxy.types;

@test:Config {}
function testKafkaConfig() {
    map<string> config = getKafkaConfig();
    
    test:assertTrue(config.hasKey("bootstrapServers"));
    test:assertTrue(config.hasKey("routingTopic"));
    test:assertTrue(config.hasKey("carbonTopic"));
    test:assertTrue(config.hasKey("healthTopic"));
    
    log:printInfo("Kafka configuration test passed");
}

@test:Config {}
function testEventCreation() {
    types:RoutingEvent routingEvent = {
        eventId: "test-id",
        timestamp: "2023-08-14T10:00:00Z",
        clientIP: "192.168.1.1",
        detectedCountry: "US",
        availableRegions: ["us-east-1", "us-west-1"],
        selectedRegion: "us-east-1",
        serviceUrl: "http://us-east-1.example.com",
        carbonIntensity: 150.5,
        requestPath: "/api/test",
        httpMethod: "GET",
        processingTimeMs: 250
    };
    
    test:assertEquals(routingEvent.eventId, "test-id");
    test:assertEquals(routingEvent.clientIP, "192.168.1.1");
    test:assertEquals(routingEvent.detectedCountry, "US");
    test:assertEquals(routingEvent.selectedRegion, "us-east-1");
    
    log:printInfo("Event creation test passed");
}

@test:Config {}
function testCarbonIntensityEventCreation() {
    types:CarbonIntensityEvent carbonEvent = {
        eventId: "test-carbon-id",
        timestamp: "2023-08-14T10:00:00Z",
        region: "us-east-1",
        carbonIntensity: 150.5,
        dataSource: "api",  // Changed from 'source' to 'dataSource'
        cached: false
    };
    
    test:assertEquals(carbonEvent.region, "us-east-1");
    test:assertEquals(carbonEvent.carbonIntensity, 150.5);
    test:assertEquals(carbonEvent.dataSource, "api");  // Changed from 'source' to 'dataSource'
    test:assertEquals(carbonEvent.cached, false);
    
    log:printInfo("Carbon intensity event creation test passed");
}

@test:Config {}
function testHealthEventCreation() {
    map<anydata> metadata = {
        "redis": true,
        "carbon-api": true,
        "geolocation-api": true
    };
    
    types:HealthEvent healthEvent = {
        eventId: "test-health-id",
        timestamp: "2023-08-14T10:00:00Z",
        component: "green-proxy",
        status: "UP",
        metadata: metadata
    };
    
    test:assertEquals(healthEvent.component, "green-proxy");
    test:assertEquals(healthEvent.status, "UP");
    test:assertTrue(healthEvent.metadata.hasKey("redis"));
    
    log:printInfo("Health event creation test passed");
}
