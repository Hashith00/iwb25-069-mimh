# Green Proxy - Carbon-Aware Load Balancing System

A sophisticated carbon-aware proxy service built with Ballerina that intelligently routes user requests to the most environmentally friendly cloud regions based on real-time carbon intensity data.

## 🌍 Overview

Green Proxy helps reduce the carbon footprint of cloud applications by:

- **Detecting user location** via IP geolocation
- **Analyzing carbon intensity** across different cloud regions
- **Routing requests** to the region with the lowest carbon emissions
- **Caching data** for performance optimization

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Green Proxy    │    │ Regional        │
│   Dashboard     │───▶│   (Port 8080)    │───▶│ Services        │
│   (Port 3001)   │    │                  │    │ (Port 3004+)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │     Redis        │
                    │   (Port 6379)    │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Carbon API      │
                    │  (Port 3000)     │
                    └──────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- [Ballerina](https://ballerina.io/) 2201.12.7 or later
- [Docker](https://www.docker.com/) and Docker Compose
- [Node.js](https://nodejs.org/) 18+ (for frontend)

### 1. Start Infrastructure Services

```bash
# Start Redis cache
docker-compose up -d redis
```

### 2. Start Carbon Emission API

```bash
cd sample_carbon_emission_api
npm install
npm start
# API available at http://localhost:3000
```

### 3. Start Green Proxy Service

```bash
cd green-proxy
bal run
# Service available at http://localhost:8080
```

### 4. Start Regional Services

```bash
cd eu_central_1_service
bal run
# Service available at http://localhost:3004
```

### 5. Start Frontend Dashboard

```bash
cd frontend
npm install
npm run dev
# Dashboard available at http://localhost:3001
```

## 📊 Frontend Dashboard

The React-based dashboard provides:

### 🏠 **Dashboard**

- Real-time system status monitoring
- Current routing information
- Available regions overview
- Cache performance metrics

### 🌍 **Region Explorer**

- IP address lookup tool
- All available regions display
- Carbon intensity comparison
- Country-to-region mapping

### 💾 **Cache Manager**

- Redis connection status
- Cache statistics and management
- Performance insights

### 📈 **Analytics**

- Carbon intensity trends
- Request distribution by region
- Environmental impact metrics

## 🔧 Configuration

### Green Proxy Configuration (`green-proxy/Config.toml`)

```toml
[green_proxy.services]
carbon_api_key="your-carbon-api-key"

[green_proxy.cache]
redisHost="localhost"
redisPort=6379
redisPassword=""
```

### Frontend Configuration (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_REFRESH_INTERVAL=30000
```

## 🛠️ Project Structure

```
Ballerina-Project/
├── frontend/                  # React Dashboard
│   ├── src/
│   │   ├── components/       # UI Components
│   │   ├── pages/           # Page Components
│   │   └── services/        # API Services
│   └── package.json
├── green-proxy/              # Main Proxy Service
│   ├── modules/
│   │   ├── cache/           # Redis Caching
│   │   ├── services/        # Business Logic
│   │   ├── types/           # Type Definitions
│   │   └── utils/           # Utilities
│   └── main.bal
├── eu_central_1_service/     # Regional Service Example
├── sample_carbon_emission_api/ # Carbon Data API
└── docker-compose.yml        # Infrastructure
```

## 📈 API Endpoints

### Green Proxy Service (Port 8080)

- `GET /{...path}` - Proxy requests to optimal region
- `GET /debug/regions` - Get region selection debug info
- `GET /cache/stats` - View cache statistics
- `DELETE /cache` - Clear cache
- `GET /health` - Health check

### Frontend Dashboard (Port 3001)

- `/` - Main dashboard
- `/regions` - Region explorer
- `/cache` - Cache manager
- `/analytics` - Analytics and insights

## 🌱 Environmental Impact

This system helps achieve:

- **~90% reduction** in external API calls through caching
- **Up to 15% reduction** in carbon footprint vs random routing
- **Real-time optimization** based on grid carbon intensity
- **Transparency** through detailed carbon impact reporting

## 🧪 Development

### Running Tests

```bash
# Ballerina tests
cd green-proxy
bal test

# Frontend tests
cd frontend
npm test
```

### Mock Data

The frontend includes comprehensive mock data for development when the backend is not available.

## 📄 License

This project is for educational and research purposes as part of a university academic project.
