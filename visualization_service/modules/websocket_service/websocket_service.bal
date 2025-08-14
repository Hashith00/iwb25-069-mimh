import ballerina/log;
import ballerina/time;
import ballerina/uuid;
import ballerina/websocket;
import visualization_service.types;

// Store active WebSocket connections
map<websocket:Caller> activeConnections = {};
types:DashboardStats stats = {
    totalRoutingEvents: 0,
    totalCarbonEvents: 0,
    totalHealthEvents: 0,
    connectedClients: 0,
    lastEventTime: "",
    regionStats: {},
    carbonStats: {}
};

// Broadcast message to all connected clients
public function broadcastMessage(types:WebSocketMessage message) {
    foreach var [connectionId, caller] in activeConnections.entries() {
        do {
            check caller->writeMessage(webSocketMessageToJson(message));
        } on fail error e {
            log:printError("Failed to send message to client " + connectionId + ": " + e.message());
            // Remove failed connection
            _ = activeConnections.remove(connectionId);
        }
    }
    
    // Update stats
    updateStats(message);
}

// Event handlers for different event types
public function handleRoutingEvent(types:WebSocketMessage message) {
    broadcastMessage(message);
}

public function handleCarbonEvent(types:WebSocketMessage message) {
    broadcastMessage(message);
}

public function handleHealthEvent(types:WebSocketMessage message) {
    broadcastMessage(message);
}

// Update dashboard statistics
function updateStats(types:WebSocketMessage message) {
    stats.lastEventTime = message.timestamp;
    
    match message.'type {
        "routing" => {
            stats.totalRoutingEvents += 1;
            // Update region stats if routing event
            if message.data is types:RoutingEvent {
                types:RoutingEvent routingEvent = <types:RoutingEvent>message.data;
                int currentCount = stats.regionStats[routingEvent.selectedRegion] ?: 0;
                stats.regionStats[routingEvent.selectedRegion] = currentCount + 1;
                
                // Update carbon stats
                if routingEvent.carbonIntensity is float {
                    float carbonIntensity = <float>routingEvent.carbonIntensity;
                    stats.carbonStats[routingEvent.selectedRegion] = carbonIntensity;
                }
            }
        }
        "carbon" => {
            stats.totalCarbonEvents += 1;
        }
        "health" => {
            stats.totalHealthEvents += 1;
        }
    }
    
    stats.connectedClients = activeConnections.length();
}

// Get connection ID for a caller (helper function)
function getConnectionId(websocket:Caller caller) returns string? {
    foreach var [connectionId, storedCaller] in activeConnections.entries() {
        if storedCaller === caller {
            return connectionId;
        }
    }
    return ();
}

// Get current statistics
public function getStats() returns types:DashboardStats {
    stats.connectedClients = activeConnections.length();
    return stats.clone();
}

// Get current statistics as JSON
public function getStatsAsJson() returns json {
    stats.connectedClients = activeConnections.length();
    return {
        "totalRoutingEvents": stats.totalRoutingEvents,
        "totalCarbonEvents": stats.totalCarbonEvents,
        "totalHealthEvents": stats.totalHealthEvents,
        "connectedClients": stats.connectedClients,
        "lastEventTime": stats.lastEventTime,
        "regionStats": stats.regionStats.toJson(),
        "carbonStats": stats.carbonStats.toJson()
    };
}

// Handle client connection
public function handleClientConnection(websocket:Caller caller) returns error? {
    string connectionId = uuid:createType1AsString();
    activeConnections[connectionId] = caller;
    stats.connectedClients = activeConnections.length();
    
    log:printInfo("New WebSocket connection established");
    
    // Send welcome message with current stats
    types:WebSocketMessage welcomeMsg = {
        'type: "stats",
        timestamp: time:utcToString(time:utcNow()),
        data: stats
    };
    
    check caller->writeMessage(webSocketMessageToJson(welcomeMsg));
}

// Handle client message
public function handleClientMessage(websocket:Caller caller, anydata data) returns error? {
    // Handle client messages (e.g., filter requests)
    string dataStr = data.toString();
    json|error messageJson = dataStr.fromJsonString();
    if messageJson is json && messageJson.messageType == "filter" {
        // Handle filter logic here if needed
    }
}

// Handle client disconnection
public function handleClientDisconnection(websocket:Caller caller, int statusCode, string reason) returns error? {
    string? connectionId = getConnectionId(caller);
    if connectionId is string {
        _ = activeConnections.remove(connectionId);
        stats.connectedClients = activeConnections.length();
        log:printInfo("WebSocket connection closed");
    }
}

// Handle client error
public function handleClientError(websocket:Caller caller, error err) returns error? {
    log:printError("WebSocket error: " + err.message());
}

// Get connected clients count
public function getConnectedClientsCount() returns int {
    return activeConnections.length();
}

// Helper function to convert WebSocketMessage to JSON
public function webSocketMessageToJson(types:WebSocketMessage message) returns json {
    json dataJson = message.data is json ? <json>message.data : message.data.toJson();
    return {
        "type": message.'type,
        "timestamp": message.timestamp,
        "data": dataJson
    };
}