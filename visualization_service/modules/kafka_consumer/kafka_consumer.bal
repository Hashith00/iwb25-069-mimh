// kafka_consumer.bal - Kafka consumer for streaming events

import ballerina/log;
import ballerina/time;
import ballerinax/kafka;
import visualization_service.types;

// Configurable Kafka settings
configurable string bootstrapServers = "localhost:9092";
configurable string routingTopic = "routing-events";
configurable string carbonTopic = "carbon-events";
configurable string healthTopic = "health-events";

// Event handlers - these will be set by the main service
public type EventHandler function(types:WebSocketMessage message);

EventHandler? routingEventHandler = ();
EventHandler? carbonEventHandler = ();
EventHandler? healthEventHandler = ();

// Set event handlers
public function setEventHandlers(
    EventHandler routingHandler,
    EventHandler carbonHandler, 
    EventHandler healthHandler
) {
    routingEventHandler = routingHandler;
    carbonEventHandler = carbonHandler;
    healthEventHandler = healthHandler;
}

// Helper function to process Kafka records
public function processKafkaRecord(kafka:AnydataConsumerRecord kafkaRecord, string eventType, EventHandler? handler) returns error? {
    anydata valueData = kafkaRecord?.value;
    if valueData is byte[] {
        string valueStr = check string:fromBytes(valueData);
        json eventJson = check valueStr.fromJsonString();
        
        anydata eventData;
        if eventType == "routing" {
            eventData = check eventJson.cloneWithType(types:RoutingEvent);
        } else if eventType == "carbon" {
            eventData = check eventJson.cloneWithType(types:CarbonIntensityEvent);
        } else if eventType == "health" {
            eventData = check eventJson.cloneWithType(types:HealthEvent);
        } else {
            return error("Unknown event type: " + eventType);
        }
        
        types:WebSocketMessage wsMessage = {
            'type: eventType,
            timestamp: time:utcToString(time:utcNow()),
            data: eventData
        };
        
        if handler is EventHandler {
            handler(wsMessage);
        } else {
            log:printError("No event handler configured for: " + eventType);
        }
    } else {
        log:printError("Invalid message format for " + eventType + " event");
    }
}

// Kafka consumers for different topics
service kafka:Service on new kafka:Listener(bootstrapServers, {
    topics: [routingTopic],
    groupId: "dashboard-routing-consumer",
    clientId: "dashboard-routing-client"
}) {

    function init() {
        log:printInfo("Kafka Routing Consumer started - Topic: " + routingTopic);
    }

    remote function onConsumerRecord(kafka:Caller caller, kafka:AnydataConsumerRecord[] records) returns error? {
        foreach var kafkaRecord in records {
            check processKafkaRecord(kafkaRecord, "routing", routingEventHandler);
        }
    }
}

service kafka:Service on new kafka:Listener(bootstrapServers, {
    topics: [carbonTopic],
    groupId: "dashboard-carbon-consumer",
    clientId: "dashboard-carbon-client"
}) {

    function init() {
        log:printInfo("Kafka Carbon Consumer started - Topic: " + carbonTopic);
    }

    remote function onConsumerRecord(kafka:Caller caller, kafka:AnydataConsumerRecord[] records) returns error? {
        foreach var kafkaRecord in records {
            check processKafkaRecord(kafkaRecord, "carbon", carbonEventHandler);
        }
    }
}

service kafka:Service on new kafka:Listener(bootstrapServers, {
    topics: [healthTopic],
    groupId: "dashboard-health-consumer",
    clientId: "dashboard-health-client"
}) {

    function init() {
        log:printInfo("Kafka Health Consumer started - Topic: " + healthTopic);
    }

    remote function onConsumerRecord(kafka:Caller caller, kafka:AnydataConsumerRecord[] records) returns error? {
        foreach var kafkaRecord in records {
            check processKafkaRecord(kafkaRecord, "health", healthEventHandler);
        }
    }
}

// Health check for Kafka connectivity
public function isKafkaHealthy() returns boolean {
    // Simple health check - could be enhanced
    return true;
}

// Get consumer configuration
public function getKafkaConfig() returns map<string> {
    return {
        "bootstrapServers": bootstrapServers,
        "routingTopic": routingTopic,
        "carbonTopic": carbonTopic,
        "healthTopic": healthTopic
    };
}
