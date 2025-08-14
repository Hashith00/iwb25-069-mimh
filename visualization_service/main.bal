// main.bal - Main API service for Visualization Service

import ballerina/http;
import ballerina/log;
import ballerina/time;
import ballerina/websocket;
import visualization_service.kafka_consumer;
import visualization_service.websocket_service;

// Configurable ports
configurable int httpPort = ?;
configurable int wsPort = ?;

// CORS configuration for HTTP API
http:CorsConfig corsConfig = {
    allowOrigins: ["*"],
    allowCredentials: false,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS"]
};

// HTTP API service with CORS support
@http:ServiceConfig {
    cors: corsConfig
}
service /api on new http:Listener(httpPort) {
    
    // Health check endpoint
    resource function get health() returns json {
        return {
            "status": "UP",
            "timestamp": time:utcToString(time:utcNow()),
            "services": {
                "kafka": kafka_consumer:isKafkaHealthy(),
                "websocket": {
                    "port": wsPort,
                    "connectedClients": websocket_service:getConnectedClientsCount()
                }
            },
            "endpoints": {
                "websocket": "ws://localhost:" + wsPort.toString() + "/events",
                "health": "http://localhost:" + httpPort.toString() + "/api/health",
                "stats": "http://localhost:" + httpPort.toString() + "/api/stats"
            }
        };
    }
    
    // Get real-time statistics
    resource function get stats() returns json {
        return websocket_service:getStatsAsJson();
    }
    
    // Get Kafka configuration
    resource function get kafka/config() returns json {
        return kafka_consumer:getKafkaConfig();
    }
    
    // Get connected WebSocket clients
    resource function get websocket/clients() returns json {
        return {
            "connectedClients": websocket_service:getConnectedClientsCount(),
            "timestamp": time:utcToString(time:utcNow())
        };
    }
    
    // Get event history (last N events)
    resource function get events/history(int 'limit = 50) returns json {
        // This would require implementing event storage
        // For now, return current stats
        return {
            "message": "Event history endpoint - implement event storage for full functionality",
            "currentStats": websocket_service:getStatsAsJson(),
            "limit": 'limit
        };
    }
    
    // API info endpoint
    resource function get info() returns json {
        return {
            "serviceName": "Visualization Service API",
            "version": "1.0.0",
            "description": "Real-time streaming API for Kafka events via WebSocket",
            "endpoints": [
                {
                    "path": "/api/health",
                    "method": "GET",
                    "description": "Service health check"
                },
                {
                    "path": "/api/stats", 
                    "method": "GET",
                    "description": "Get real-time statistics"
                },
                {
                    "path": "/api/kafka/config",
                    "method": "GET", 
                    "description": "Get Kafka configuration"
                },
                {
                    "path": "/api/websocket/clients",
                    "method": "GET",
                    "description": "Get connected WebSocket clients count"
                },
                {
                    "path": "/api/events/history",
                    "method": "GET",
                    "description": "Get event history (with optional limit parameter)"
                }
            ],
            "websocket": {
                "endpoint": "ws://localhost:" + wsPort.toString() + "/events",
                "description": "Real-time event streaming via WebSocket",
                "messageTypes": ["routing", "carbon", "health", "stats"]
            }
        };
    }
}

// WebSocket service on separate port
service /events on new websocket:Listener(wsPort) {
    
    resource function get .() returns websocket:Service|websocket:UpgradeError {
        return new WebSocketService();
    }
}

service class WebSocketService {
    *websocket:Service;

    remote function onOpen(websocket:Caller caller) returns error? {
        check websocket_service:handleClientConnection(caller);
    }

    remote function onMessage(websocket:Caller caller, anydata data) returns error? {
        check websocket_service:handleClientMessage(caller, data);
    }

    remote function onClose(websocket:Caller caller, int statusCode, string reason) returns error? {
        check websocket_service:handleClientDisconnection(caller, statusCode, reason);
    }

    remote function onError(websocket:Caller caller, error err) returns error? {
        check websocket_service:handleClientError(caller, err);
    }
}

// Initialize the API service
public function main() returns error? {
    log:printInfo("Starting Visualization Service API");
    log:printInfo("HTTP API Port: " + httpPort.toString());
    log:printInfo("WebSocket Port: " + wsPort.toString());
    
    // Set up event handlers for Kafka consumers
    kafka_consumer:setEventHandlers(
        websocket_service:handleRoutingEvent,
        websocket_service:handleCarbonEvent, 
        websocket_service:handleHealthEvent
    );
    
    log:printInfo("WebSocket endpoint: ws://localhost:" + wsPort.toString() + "/events");
    log:printInfo("API endpoints available at: http://localhost:" + httpPort.toString() + "/api/");
    log:printInfo("Dashboard ready - Waiting for connections...");
}
