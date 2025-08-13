# Green Proxy - Smart Carbon-Aware Region Selection

A Ballerina-based proxy service that intelligently routes requests to the most carbon-efficient cloud regions based on real-time carbon intensity data and user geolocation.

## Features

- 🌍 **IP Geolocation Detection** - Automatically detects user location
- ⚡ **Carbon Intensity Analysis** - Fetches real-time carbon intensity data for different regions
- 🎯 **Smart Region Selection** - Recommends the most environmentally friendly region
- 🚀 **Redis Caching** - High-performance caching of geolocation data
- 📊 **Cache Management** - Built-in cache statistics and management endpoints

## Quick Start

### Prerequisites

- [Ballerina](https://ballerina.io/) 2201.12.7 or later
- [Docker](https://www.docker.com/) and Docker Compose
- Redis (provided via Docker Compose)

### Running with Docker Compose

1. **Start Redis**:

   ```bash
   docker-compose up -d redis
   ```

2. **Build and run the Ballerina service**:
   ```bash
   bal run
   ```

### API Endpoints

#### Main Endpoint

- **`GET /optimal-regions`** - Get optimal cloud regions for the user's location
  ```json
  {
    "clientIP": "111.223.178.156",
    "detectedCountry": "Sri Lanka",
    "optimalRegions": ["ap-southeast-1", "ap-northeast-1", "eu-central-1"],
    "recommendedRegion": "ap-southeast-1",
    "carbonIntensity": 295.5
  }
  ```

#### Cache Management

- **`GET /cache/stats`** - View cache statistics
- **`DELETE /cache`** - Clear all cached data
- **`GET /health`** - Health check including Redis status

## Configuration

Configuration is managed through `Config.toml`:

```toml
[gree_proxy.services]
carbon_api_key="your-carbon-api-key"

[gree_proxy.cache]
redisHost="localhost"
redisPort=6379
redisPassword=""
```

## Architecture

The service is organized into modular components:

- **`types/`** - Type definitions
- **`services/`** - Business logic (geolocation, carbon data, optimization)
- **`utils/`** - Utilities (region mapping)
- **`cache/`** - Redis-based caching

## Caching Strategy

### **Geolocation Cache**

- **TTL**: 1 hour (3600s) - IP locations don't change frequently
- **Key pattern**: `geoip:{ip_address}`
- **Use case**: User location detection

### **Carbon Intensity Cache**

- **TTL**: 30 minutes (1800s) - Carbon data updates more frequently
- **Key pattern**: `carbon:{zone}`
- **Use case**: Regional carbon intensity data

### **Performance Benefits**

- **Storage**: Redis for persistence and scalability
- **Speed**: ~100x faster for cached lookups
- **API reduction**: ~90% fewer external API calls
- **Fallback**: Graceful degradation if Redis is unavailable

## Development

```bash
# Build the project
bal build

# Run tests
bal test

# Run with custom config
bal run --config-file=Custom.toml
```
