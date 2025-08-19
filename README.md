# Green Proxy - A Carbon-Aware API Proxy

![Alt text](images/Green_proxy_ui.png "Green Proxy Dashbaord")

Green-Router is an intelligent, lightweight API proxy designed to reduce the carbon footprint of digital services. Built with the cloud-native programming language Ballerina, this service dynamically routes incoming traffic to the cloud region with the lowest real-time carbon intensity, making your applications greener without sacrificing performance.

## The Problem: The Carbon Footprint of the Cloud

Every API request we serve consumes electricity in a data center. While the cloud is efficient, the energy powering these data centers often comes from a mix of renewable and fossil fuel sources. This energy mix changes constantly based on weather (windy or sunny) and grid demand.

A service running in Virginia might be powered by a high-carbon grid in the morning but a cleaner one at night. Meanwhile, a server in Ireland might be running on clean wind power. By being "carbon-aware," we can actively choose to run our workloads where the energy is greenest at any given moment.

## How It Minimizes Carbon Emissions

This project implements a strategy known as "carbon-aware load shifting." Instead of routing traffic based only on technical factors like latency, we add a new, intelligent to the routing mechanism called real-time carbon intensity.

The Green-Router proxy sits in front of your main application and acts as a smart entry point. Its core logic is simple but powerful:

- **1. Identify the User's Location** It determines the user's geographic location to understand the initial network path.
- **2. Fetch Real-time Grid Data** It calls an external Carbon Intensity API to get the current carbon emissions (gCO₂/kWh) for the power grids in each of your available AWS regions.
- **3. Make the Greenest Choice** It compares the carbon intensity of all regions and identifies which one is currently running on the cleanest energy.
- **4. Route the Request** It forwards the user's request to the application backend in that eco-friendly region.

## Architecture

The system is designed as a highly available, scalable, multi-region architecture on AWS.

![Alt text](images/WSO2_Green_Proxy_Architecture_Diagram.drawio.png "Green Proxy Architecture Diagram")

- **1. Global DNS (Amazon Route 53)** A single global endpoint (api.wso2.com) uses latency-based routing to direct the user to the nearest AWS region for the best performance.
- **2. Regional Green Proxy (Ballerina on ECS)** In each region, our custom proxy runs on a scalable AWS Elastic Container Service. It receives the traffic from Route 53.
- **3. WSO2 API Gatewaye** The proxy forwards the request to the main WSO2 API Gateway, which handles core concerns like authentication, security, and rate-limiting.
- **4. Backend Service** The final application that processes the request.

## Request Flow

This is how api request handled by the Green Proxy

![Alt text](images/Request_flow_chart.png "Green Proxy request flow")

## Proxy Core Logic

The proxy's internal logic is designed for high performance by using a multi-level caching strategy.

![Alt text](images/green_proxy_logic_flow.png "Green Proxy logic")

## Quick Start

### Prerequisites

- [Ballerina](https://ballerina.io/) 2201.12.7 or later
- [Docker](https://www.docker.com/) 20.10+ and Docker Compose 2.0+
- [Node.js](https://nodejs.org/) 18+ (for frontend)
- [Git](https://git-scm.com/) for cloning the repository

### 🔧 Installation Steps

#### 1. Clone and Setup Project

```bash
# Clone the repository
git clone <repository-url>
cd green-proxy

# Verify Ballerina installation
bal version

# Verify Docker installation
docker --version
docker-compose --version

# Verify Node.js installation
node --version
npm --version
```

#### 2. Start Infrastructure Services

```bash
# Start Redis cache and other infrastructure services
docker-compose up -d

# Verify Redis is running
docker ps | grep redis
# Expected output: redis container should be running on port 6379

# Check Redis connectivity
docker exec -it green-proxy-redis-1 redis-cli ping
# Expected output: PONG
```

#### 3. Start Carbon Emission API

```bash
cd sample_carbon_emission_api

# Install dependencies
npm install

# Start the service
npm start

# Verify API is running
curl http://localhost:3000/health
# Expected output: {"status": "healthy"}

# API available at http://localhost:3000
```

#### 4. Start Green Proxy Service

```bash
cd ../green-proxy

# Install Ballerina dependencies
bal build

# Start the service
bal run

# Verify service is running
curl http://localhost:8080/health
# Expected output: Service health status

# Service available at http://localhost:8080
```

#### 5. Start Regional Services

```bash
# Start European region service
cd ../eu_central_1_service
bal run
# Service available at http://localhost:3004

# In a new terminal, start US East service
cd ../us_east_1_service
bal run
# Service available at http://localhost:3001

# In another terminal, start US West service
cd ../us_west_2_service
bal run
# Service available at http://localhost:3002
```

#### 6. Start Visualization Service

```bash
cd ../visualization_service

# Build and run the service
bal build
bal run

# Verify service is running
curl http://localhost:3005/health
# Service available at http://localhost:3005
```

#### 7. Start Frontend Dashboard

```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Verify frontend is running
curl http://localhost:4001
# Dashboard available at http://localhost:4001
```

## Configuration

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
green-proxy/
├── 📁 frontend/                          # React Dashboard Application
│   ├── src/
│   │   ├── components/                   # Reusable UI Components
│   │   │   ├── ui/                      # Shadcn/ui Components
│   │   │   ├── HeaderComponent.tsx      # Main Header
│   │   │   ├── LoginModal.tsx           # Authentication Modal
│   │   │   └── ProtectedRoute.tsx       # Route Protection
│   │   ├── pages/                       # Application Pages
│   │   │   ├── Dashboard.tsx            # Main Dashboard
│   │   │   ├── Events.tsx               # Event Monitoring
│   │   │   ├── Regions.tsx              # Regional Status
│   │   │   └── Landing.tsx              # Landing Page
│   │   ├── contexts/                    # React Contexts
│   │   │   └── AuthContext.tsx          # Authentication State
│   │   ├── hooks/                       # Custom React Hooks
│   │   ├── services/                    # API Integration
│   │   └── lib/                         # Utility Functions
│   ├── package.json                     # Frontend Dependencies
│   └── tailwind.config.ts               # Styling Configuration
│
├── 📁 green-proxy/                      # Main Green Proxy Service (Ballerina)
│   ├── modules/
│   │   ├── cache/                       # Redis Caching Layer
│   │   │   ├── cache.bal               # Cache Implementation
│   │   │   └── tests/                  # Cache Unit Tests
│   │   ├── kafka/                      # Kafka Integration
│   │   │   ├── kafka.bal               # Kafka Producer/Consumer
│   │   │   └── tests/                  # Kafka Tests
│   │   ├── services/                   # Business Logic Services
│   │   │   ├── carbon.bal              # Carbon Intensity Service
│   │   │   ├── geolocation.bal         # Location Detection
│   │   │   └── region_optimizer.bal    # Region Selection Logic
│   │   ├── types/                      # Type Definitions
│   │   │   ├── types.bal               # Data Models
│   │   │   └── tests/                  # Type Tests
│   │   └── utils/                      # Utility Functions
│   │       ├── region_mapping.bal      # Region Mapping Logic
│   │       └── region_to_service_url_mapping.bal
│   ├── main.bal                        # Service Entry Point
│   ├── Ballerina.toml                  # Ballerina Configuration
│   ├── Config.toml                     # Environment Configuration
│   └── Dockerfile                      # Container Configuration
│
├── 📁 regional-services/                # Regional Service Instances
│   ├── us_east_1_service/              # US East (N. Virginia)
│   │   ├── main.bal                    # Regional Service Logic
│   │   ├── Ballerina.toml              # Service Configuration
│   │   └── Dockerfile                  # Container Setup
│   ├── us_west_2_service/              # US West (Oregon)
│   ├── eu_central_1_service/           # Europe (Frankfurt)
│   ├── ap_northeast_1_service/         # Asia Pacific (Tokyo)
│   └── ap_southeast_1_service/         # Asia Pacific (Singapore)
│
├── 📁 visualization_service/            # Real-time Dashboard Backend
│   ├── modules/
│   │   ├── dashboard_api/              # Dashboard REST API
│   │   ├── kafka_consumer/             # Kafka Data Consumer
│   │   ├── websocket_service/          # Real-time Updates
│   │   └── types/                      # Data Types
│   ├── data/                           # Static Data Files
│   │   ├── carbon_intensity_global.json
│   │   ├── dashboard_metrics.json
│   │   └── regions.json
│   ├── main.bal                        # Service Entry Point
│   └── Dockerfile                      # Container Configuration
│
├── 📁 sample_carbon_emission_api/      # Mock Carbon Intensity API
│   ├── routes/                         # API Endpoints
│   ├── middleware/                     # Request Processing
│   └── package.json                    # Node.js Dependencies
│
├── 📁 images/                          # Documentation Images
│   ├── Green_proxy_ui.png             # Dashboard Screenshot
│   ├── WSO2_Green_Proxy_Architecture_Diagram.drawio.png
│   ├── Request_flow_chart.png         # Request Flow Diagram
│   └── green_proxy_logic_flow.png     # Logic Flow Diagram
│
├── 📄 docker-compose.yml               # Infrastructure Services
├── 📄 README.md                        # Project Documentation
└── 📄 .gitignore                       # Git Ignore Rules
```

**Key Components:**

- **Frontend**: React-based dashboard with real-time monitoring
- **Green Proxy**: Core routing logic with carbon-aware decision making
- **Regional Services**: Deployed instances across different AWS regions
- **Visualization Service**: Backend for dashboard data and WebSocket updates
- **Carbon API**: Mock service for carbon intensity data
- **Infrastructure**: Docker Compose for local development
