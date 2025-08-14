# Kafka WebSocket Dashboard Service

This service consumes events from Kafka topics and streams them to web clients via WebSocket connections.

## Features

- Real-time streaming of routing events
- Real-time streaming of carbon intensity events  
- Real-time streaming of health events
- WebSocket-based client connections
- Web dashboard interface
- Event filtering and aggregation

## Endpoints

- **WebSocket**: `ws://localhost:8080/events` - Main WebSocket endpoint for streaming events
- **HTTP**: `http://localhost:8080/dashboard` - Web dashboard interface
- **HTTP**: `http://localhost:8080/health` - Health check endpoint

## Configuration

Set the following environment variables:

```bash
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
KAFKA_ROUTING_TOPIC=routing-events
KAFKA_CARBON_TOPIC=carbon-events  
KAFKA_HEALTH_TOPIC=health-events
```

## Usage

1. Start the service: `bal run`
2. Open browser to `http://localhost:8080/dashboard`
3. Or connect WebSocket client to `ws://localhost:8080/events`

## WebSocket Message Format

The service sends JSON messages with the following structure:

```json
{
  "type": "routing|carbon|health",
  "timestamp": "2025-08-14T10:30:00Z",
  "data": { /* event data */ }
}
```
