// main.bal - Main API service for Visualization Service

import ballerina/http;
import ballerina/log;
import ballerina/time;
import ballerina/websocket;
import visualization_service.kafka_consumer;
import visualization_service.websocket_service;
import visualization_service.dashboard_api;

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
    
    // ========== PHASE 1 DASHBOARD APIs ==========
    
    // Dashboard metrics endpoint
    resource function get dashboard/metrics() returns json|http:InternalServerError {
        do {
            json metrics = check dashboard_api:getDashboardMetrics();
            return metrics;
        } on fail var err {
            log:printError("Failed to get dashboard metrics", err);
            return <http:InternalServerError>{
                body: {
                    "error": "Failed to get dashboard metrics",
                    "message": err.message()
                }
            };
        }
    }
    
    // Regions endpoint
    resource function get regions() returns json|http:InternalServerError {
        do {
            json regions = check dashboard_api:getRegions();
            return regions;
        } on fail var err {
            log:printError("Failed to get regions data", err);
            return <http:InternalServerError>{
                body: {
                    "error": "Failed to get regions data",
                    "message": err.message()
                }
            };
        }
    }
    
    // Optimal regions endpoint
    resource function get optimal\-regions(http:Request req, string? ip = ()) returns json|http:InternalServerError {
        do {
            string clientIp = ip ?: dashboard_api:getClientIP(req);
            json optimalRegions = check dashboard_api:getOptimalRegions(clientIp);
            return optimalRegions;
        } on fail var err {
            log:printError("Failed to get optimal regions", err);
            return <http:InternalServerError>{
                body: {
                    "error": "Failed to get optimal regions",
                    "message": err.message()
                }
            };
        }
    }
    
    // System status endpoint
    resource function get system/status() returns json|http:InternalServerError {
        do {
            json status = check dashboard_api:getSystemStatus();
            return status;
        } on fail var err {
            log:printError("Failed to get system status", err);
            return <http:InternalServerError>{
                body: {
                    "error": "Failed to get system status",
                    "message": err.message()
                }
            };
        }
    }
    
    // ========== PHASE 2 ENHANCED FEATURES APIs ==========
    
    // Global carbon intensity for map visualization
    resource function get carbon\-intensity/global() returns json|http:InternalServerError {
        do {
            json carbonData = check dashboard_api:getCarbonIntensityGlobal();
            return carbonData;
        } on fail var err {
            log:printError("Failed to get global carbon intensity data", err);
            return <http:InternalServerError>{
                body: {
                    "error": "Failed to get global carbon intensity data",
                    "message": err.message()
                }
            };
        }
    }
    
    // Cache performance statistics (overrides the existing stats endpoint with enhanced data)
    resource function get cache/stats() returns json|http:InternalServerError {
        do {
            json cacheStats = check dashboard_api:getCacheStats();
            return cacheStats;
        } on fail var err {
            log:printError("Failed to get cache statistics", err);
            return <http:InternalServerError>{
                body: {
                    "error": "Failed to get cache statistics",
                    "message": err.message()
                }
            };
        }
    }
    
    // Environmental impact metrics
    resource function get environmental/impact() returns json|http:InternalServerError {
        do {
            json impactData = check dashboard_api:getEnvironmentalImpact();
            return impactData;
        } on fail var err {
            log:printError("Failed to get environmental impact data", err);
            return <http:InternalServerError>{
                body: {
                    "error": "Failed to get environmental impact data",
                    "message": err.message()
                }
            };
        }
    }
    
    // ========== ORIGINAL ENDPOINTS ==========

    // API info endpoint
    resource function get info() returns json {
        return {
            "serviceName": "Visualization Service API",
            "version": "3.0.0",
            "description": "Real-time streaming API for Kafka events via WebSocket + Phase 1 & 2 Dashboard APIs",
            "phases": {
                "phase1": "Core Dashboard APIs",
                "phase2": "Enhanced Features APIs"
            },
            "endpoints": [
                {
                    "path": "/api/health",
                    "method": "GET",
                    "description": "Service health check",
                    "phase": "original"
                },
                {
                    "path": "/api/stats", 
                    "method": "GET",
                    "description": "Get real-time statistics",
                    "phase": "original"
                },
                {
                    "path": "/api/kafka/config",
                    "method": "GET", 
                    "description": "Get Kafka configuration",
                    "phase": "original"
                },
                {
                    "path": "/api/websocket/clients",
                    "method": "GET",
                    "description": "Get connected WebSocket clients count",
                    "phase": "original"
                },
                {
                    "path": "/api/events/history",
                    "method": "GET",
                    "description": "Get event history (with optional limit parameter)",
                    "phase": "original"
                },
                {
                    "path": "/api/dashboard/metrics",
                    "method": "GET",
                    "description": "Get dashboard overview metrics",
                    "phase": "phase1"
                },
                {
                    "path": "/api/regions",
                    "method": "GET",
                    "description": "Get regions data with carbon intensity and status",
                    "phase": "phase1"
                },
                {
                    "path": "/api/optimal-regions",
                    "method": "GET",
                    "description": "Get optimal regions for client IP (supports ?ip= parameter)",
                    "phase": "phase1"
                },
                {
                    "path": "/api/system/status",
                    "method": "GET",
                    "description": "Get system status and performance metrics",
                    "phase": "phase1"
                },
                {
                    "path": "/api/carbon-intensity/global",
                    "method": "GET",
                    "description": "Get global carbon intensity data for map visualization",
                    "phase": "phase2"
                },
                {
                    "path": "/api/cache/stats",
                    "method": "GET",
                    "description": "Get enhanced cache performance statistics",
                    "phase": "phase2"
                },
                {
                    "path": "/api/environmental/impact",
                    "method": "GET",
                    "description": "Get environmental impact metrics and CO2 savings",
                    "phase": "phase2"
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
