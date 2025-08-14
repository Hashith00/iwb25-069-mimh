# Kafka WebSocket Dashboard API

A real-time API service that consumes Kafka events and streams them to clients via WebSocket connections. Perfect for React frontends that need live event data.

## 🚀 Quick Start

### 1. Start the Service

```bash
bal run
```

### 2. API Endpoints

- **Base URL**: `http://localhost:8080/api`
- **WebSocket**: `ws://localhost:9090/events`

## 📡 API Endpoints

### GET `/api/health`

Service health check with Kafka and WebSocket status.

**Response:**

```json
{
  "status": "UP",
  "timestamp": "2025-08-14T10:30:00Z",
  "services": {
    "kafka": true,
    "websocket": {
      "port": 9090,
      "connectedClients": 5
    }
  },
  "endpoints": {
    "websocket": "ws://localhost:9090/events",
    "health": "http://localhost:8080/api/health",
    "stats": "http://localhost:8080/api/stats"
  }
}
```

### GET `/api/stats`

Real-time statistics for all events.

**Response:**

```json
{
  "totalRoutingEvents": 125,
  "totalCarbonEvents": 87,
  "totalHealthEvents": 23,
  "connectedClients": 5,
  "lastEventTime": "2025-08-14T10:29:45Z",
  "regionStats": {
    "us-east-1": 45,
    "eu-west-1": 38,
    "ap-southeast-1": 42
  },
  "carbonStats": {
    "us-east-1": 234.5,
    "eu-west-1": 128.3,
    "ap-southeast-1": 267.8
  }
}
```

### GET `/api/kafka/config`

Kafka configuration details.

### GET `/api/websocket/clients`

Connected WebSocket clients count.

### GET `/api/info`

Complete API documentation and service information.

## 🔌 WebSocket Connection

### Endpoint

```
ws://localhost:9090/events
```

### Message Types

The WebSocket sends JSON messages with this structure:

```typescript
interface WebSocketMessage {
  type: "routing" | "carbon" | "health" | "stats";
  timestamp: string;
  data: any;
}
```

#### Routing Events

```json
{
  "type": "routing",
  "timestamp": "2025-08-14T10:30:00Z",
  "data": {
    "eventId": "uuid-here",
    "clientIP": "192.168.1.100",
    "detectedCountry": "US",
    "availableRegions": ["us-east-1", "us-west-2"],
    "selectedRegion": "us-east-1",
    "serviceUrl": "https://api.us-east-1.example.com",
    "carbonIntensity": 234.5,
    "requestPath": "/api/data",
    "httpMethod": "GET",
    "processingTimeMs": 45
  }
}
```

#### Carbon Events

```json
{
  "type": "carbon",
  "timestamp": "2025-08-14T10:30:00Z",
  "data": {
    "eventId": "uuid-here",
    "region": "us-east-1",
    "carbonIntensity": 234.5,
    "dataSource": "electricitymap",
    "cached": false
  }
}
```

#### Health Events

```json
{
  "type": "health",
  "timestamp": "2025-08-14T10:30:00Z",
  "data": {
    "eventId": "uuid-here",
    "component": "green-proxy",
    "status": "UP",
    "metadata": {
      "version": "1.0.0",
      "uptime": "2h 30m"
    }
  }
}
```

## ⚛️ React Integration

### 1. Install Dependencies

```bash
npm install ws @types/ws  # For TypeScript
```

### 2. WebSocket Hook

```typescript
// hooks/useWebSocket.ts
import { useState, useEffect, useRef } from "react";

interface WebSocketMessage {
  type: "routing" | "carbon" | "health" | "stats";
  timestamp: string;
  data: any;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  messages: WebSocketMessage[];
  stats: any;
  sendMessage: (message: any) => void;
}

export const useWebSocket = (url: string): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [stats, setStats] = useState({});
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        setIsConnected(true);
        console.log("WebSocket connected");
      };

      ws.current.onmessage = (event) => {
        const message: WebSocketMessage = JSON.parse(event.data);

        if (message.type === "stats") {
          setStats(message.data);
        } else {
          setMessages((prev) => [message, ...prev.slice(0, 49)]); // Keep last 50
        }
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        console.log("WebSocket disconnected");
        // Reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };
    };

    connectWebSocket();

    return () => {
      ws.current?.close();
    };
  }, [url]);

  const sendMessage = (message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return { isConnected, messages, stats, sendMessage };
};
```

### 3. Dashboard Component

```typescript
// components/Dashboard.tsx
import React from "react";
import { useWebSocket } from "../hooks/useWebSocket";

const Dashboard: React.FC = () => {
  const { isConnected, messages, stats } = useWebSocket(
    "ws://localhost:9090/events"
  );

  return (
    <div className="dashboard">
      <header>
        <h1>🌱 Green Proxy Dashboard</h1>
        <div className={`status ${isConnected ? "connected" : "disconnected"}`}>
          {isConnected ? "✅ Connected" : "❌ Disconnected"}
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Connected Clients</h3>
          <div className="stat-value">{stats.connectedClients || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Routing Events</h3>
          <div className="stat-value">{stats.totalRoutingEvents || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Carbon Events</h3>
          <div className="stat-value">{stats.totalCarbonEvents || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Health Events</h3>
          <div className="stat-value">{stats.totalHealthEvents || 0}</div>
        </div>
      </div>

      <div className="events-container">
        <h2>Live Events</h2>
        {messages.map((message, index) => (
          <div key={index} className={`event-item ${message.type}`}>
            <div className="event-header">
              <span className="event-type">{message.type}</span>
              <span className="event-time">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="event-details">
              {JSON.stringify(message.data, null, 2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
```

### 4. API Service

```typescript
// services/api.ts
const API_BASE_URL = "http://localhost:8080/api";

export class DashboardAPI {
  static async getHealth() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  }

  static async getStats() {
    const response = await fetch(`${API_BASE_URL}/stats`);
    return response.json();
  }

  static async getKafkaConfig() {
    const response = await fetch(`${API_BASE_URL}/kafka/config`);
    return response.json();
  }

  static async getConnectedClients() {
    const response = await fetch(`${API_BASE_URL}/websocket/clients`);
    return response.json();
  }

  static async getInfo() {
    const response = await fetch(`${API_BASE_URL}/info`);
    return response.json();
  }
}
```

## 🐳 Docker Configuration

The service is configured to run in Docker with CORS enabled for React development:

```yaml
# In docker-compose.yml
kafka-websocket-dashboard:
  build: ./kafka-websocket-dashboard
  ports:
    - "8080:8080" # HTTP API
    - "9090:9090" # WebSocket
  environment:
    bootstrapServers: "kafka:9092"
    routingTopic: "routing-events"
    carbonTopic: "carbon-events"
    healthTopic: "health-events"
    httpPort: 8080
    wsPort: 9090
```

## 🔧 Configuration

Environment variables:

- `bootstrapServers`: Kafka bootstrap servers (default: localhost:9092)
- `routingTopic`: Routing events topic (default: routing-events)
- `carbonTopic`: Carbon events topic (default: carbon-events)
- `healthTopic`: Health events topic (default: health-events)
- `httpPort`: HTTP API port (default: 8080)
- `wsPort`: WebSocket port (default: 9090)

## 🚨 CORS

The API is configured with CORS to allow connections from:

- `http://localhost:3000` (React default)
- `http://localhost:3001`
- `http://127.0.0.1:3000`

Add your frontend URL to the `corsConfig.allowOrigins` array if needed.
