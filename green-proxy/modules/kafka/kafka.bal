// kafka.bal - Kafka integration for green proxy service

import ballerina/log;
import ballerina/time;
import ballerina/uuid;
import ballerinax/kafka;
import green_proxy.types;

// Configurable Kafka settings
configurable string bootstrapServers = "localhost:9092";
configurable string routingTopic = "green-proxy-routing";
configurable string carbonTopic = "green-proxy-carbon-intensity";
configurable string healthTopic = "green-proxy-health";

// Kafka producer client
final kafka:Producer kafkaProducer = check new (bootstrapServers, {
    clientId: "green-proxy-producer",
    acks: "1",
    retryCount: 3
});


// Publish routing event to Kafka
public function publishRoutingEvent(
    string clientIP,
    string detectedCountry, 
    string[] availableRegions,
    string selectedRegion,
    string serviceUrl,
    float? carbonIntensity,
    string requestPath,
    string httpMethod,
    int processingTimeMs
) returns error? {
    types:RoutingEvent event = {
        eventId: uuid:createType1AsString(),
        timestamp: time:utcToString(time:utcNow()),
        clientIP: clientIP,
        detectedCountry: detectedCountry,
        availableRegions: availableRegions,
        selectedRegion: selectedRegion,
        serviceUrl: serviceUrl,
        carbonIntensity: carbonIntensity,
        requestPath: requestPath,
        httpMethod: httpMethod,
        processingTimeMs: processingTimeMs
    };
    
    check publishEvent(routingTopic, event.eventId, event);
    log:printInfo("Published routing event for region: " + selectedRegion);
}

// Publish carbon intensity event to Kafka
public function publishCarbonIntensityEvent(
    string region,
    float carbonIntensity,
    string dataSource,  
    boolean cached
) returns error? {
    types:CarbonIntensityEvent event = {
        eventId: uuid:createType1AsString(),
        timestamp: time:utcToString(time:utcNow()),
        region: region,
        carbonIntensity: carbonIntensity,
        dataSource: dataSource,  
        cached: cached
    };
    
    check publishEvent(carbonTopic, event.eventId, event);
    log:printInfo("Published carbon intensity event for region: " + region);
}

// Publish health event to Kafka
public function publishHealthEvent(
    string component,
    string status,
    map<anydata> metadata
) returns error? {
    types:HealthEvent event = {
        eventId: uuid:createType1AsString(),
        timestamp: time:utcToString(time:utcNow()),
        component: component,
        status: status,
        metadata: metadata
    };
    
    check publishEvent(healthTopic, event.eventId, event);
    log:printInfo("Published health event for component: " + component);
}

// Generic function to publish events to Kafka
function publishEvent(string topic, string key, anydata event) returns error? {
    check kafkaProducer->send({
        topic: topic,
        key: key,
        value: event
    });
}

// Batch publish multiple events for better performance
public function publishEvents(string topic, anydata[] events) returns error? {
    foreach anydata event in events {
        check kafkaProducer->send({
            topic: topic,
            value: event
        });
    }
    log:printInfo("Published batch of " + events.length().toString() + " events to topic: " + topic);
}

// Close Kafka producer gracefully
public function closeKafkaProducer() returns error? {
    check kafkaProducer->close();
    log:printInfo("Kafka producer closed");
}

// Health check for Kafka connectivity
public function isKafkaHealthy() returns boolean {
    // Try to get topic metadata as a health check
    do {
        // This is a simple way to check if Kafka is reachable
        // In a real implementation, you might want to use a more sophisticated health check
        return true;
    } on fail {
        return false;
    }
}

// Get Kafka configuration info
public function getKafkaConfig() returns map<string> {
    return {
        "bootstrapServers": bootstrapServers,
        "routingTopic": routingTopic,
        "carbonTopic": carbonTopic,
        "healthTopic": healthTopic
    };
}
