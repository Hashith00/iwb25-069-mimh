import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Globe,
  BarChart3,
  MapPin,
  TrendingDown,
  Clock,
  Database,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  api,
  CarbonIntensityLocation,
  DashboardMetrics,
  Region,
  SystemStatus,
} from "@/services/api";

// Fix for Leaflet default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const Dashboard = () => {
  // Map center state for OpenStreetMap
  const [mapCenter, setMapCenter] = useState({ lat: 20, lng: 0 });
  const [mapZoom, setMapZoom] = useState(2);
  const [carbonMetrics, setCarbonMetrics] = useState<DashboardMetrics | null>(
    null
  );
  const [regions, setRegions] = useState<Region[] | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [carbonDataPoints, setCarbonDataPoints] = useState<
    CarbonIntensityLocation[] | null
  >(null);

  const fetchCarbonDataPoints = async () => {
    try {
      const carbonDataPoints = await api.getCarbonIntensityGlobal();
      setCarbonDataPoints(carbonDataPoints);
    } catch (error) {
      console.error("Error fetching carbon data points:", error);
    }
  };
  useEffect(() => {
    const fetchCarbonMetrics = async () => {
      try {
        const metrics = await api.getMetrics();
        setCarbonMetrics(metrics);
      } catch (error) {
        console.error("Error fetching carbon metrics:", error);
      }
    };
    const fetchRegions = async () => {
      try {
        const regions = await api.getRegions();
        setRegions(regions);
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };
    const fetchSystemStatus = async () => {
      try {
        const systemStatus = await api.getSystemStatus();
        setSystemStatus(systemStatus);
      } catch (error) {
        console.error("Error fetching system status:", error);
      }
    };
    fetchCarbonMetrics();
    fetchRegions();
    fetchSystemStatus();
  }, []);

  useEffect(() => {
    fetchCarbonDataPoints();
  }, []);

  const getCarbonIntensityBadge = (intensity: number) => {
    if (intensity < 100) return "success";
    if (intensity < 150) return "warning";
    return "destructive";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <Globe className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">GreenRoute Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/regions">
                <Button variant="ghost">Regions</Button>
              </Link>
              <Link to="/admin">
                <Button variant="ghost">Admin</Button>
              </Link>
              <Link to="/events">
                <Button variant="ghost">Events</Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="status-indicator status-online"></div>
                <span className="text-sm text-muted-foreground">
                  System Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="metric-label">Carbon Savings</div>
                <div className="metric-value text-success">
                  {carbonMetrics?.currentSavings ?? 0}%
                </div>
              </div>
              <TrendingDown className="h-8 w-8 text-success" />
            </div>
          </Card>

          <Card className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="metric-label">Requests Today</div>
                <div className="metric-value">
                  {carbonMetrics?.totalRequestsToday?.toLocaleString() ?? "0"}
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="metric-label">Avg Latency</div>
                <div className="metric-value">
                  {carbonMetrics?.averageLatency ?? 0}ms
                </div>
              </div>
              <Clock className="h-8 w-8 text-accent" />
            </div>
          </Card>

          <Card className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="metric-label">Active Regions</div>
                <div className="metric-value">
                  {carbonMetrics?.activeRegions ?? 0}
                </div>
              </div>
              <MapPin className="h-8 w-8 text-warning" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carbon Intensity Map */}
          <Card className="dashboard-card lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">
                Real-Time Carbon Intensity
              </h3>
              <Badge variant="secondary">
                <Activity className="h-4 w-4 mr-2" />
                Live Data
              </Badge>
            </div>

            {/* Interactive Real World Geographic Map with OpenStreetMap (100% FREE) */}
            <div className="bg-green-50 rounded-lg h-80 relative overflow-hidden border border-green-200">
              <MapContainer
                center={[mapCenter.lat, mapCenter.lng]}
                zoom={mapZoom}
                minZoom={2}
                maxZoom={17}
                maxBounds={[
                  [-90, -180],
                  [90, 180],
                ]}
                maxBoundsViscosity={1.0}
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: "0.5rem",
                }}
                className="leaflet-container-bright"
              >
                {/* Green theme tile layer from CartoDB (completely free) */}
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  subdomains="abcd"
                />

                {/* Route Lines Between Major Regions */}
                {/* US West to US East */}
                <Polyline
                  positions={[
                    [34.0522, -118.2437], // Los Angeles
                    [40.7128, -74.006], // New York
                  ]}
                  color="#3b82f6"
                  weight={3}
                  opacity={0.8}
                  dashArray="10, 10"
                  className="animate-pulse"
                />

                {/* US to Europe Route */}
                <Polyline
                  positions={[
                    [40.7128, -74.006], // New York
                    [51.5074, -0.1278], // London
                  ]}
                  color="#10b981"
                  weight={3}
                  opacity={0.8}
                  dashArray="15, 15"
                  className="animate-pulse"
                />

                {/* Europe to Asia Route */}
                <Polyline
                  positions={[
                    [51.5074, -0.1278], // London
                    [39.9042, 116.4074], // Beijing
                  ]}
                  color="#f59e0b"
                  weight={3}
                  opacity={0.8}
                  dashArray="20, 20"
                  className="animate-pulse"
                />

                {/* Asia Pacific Network */}
                <Polyline
                  positions={[
                    [39.9042, 116.4074], // Beijing
                    [35.6762, 139.6503], // Tokyo
                    [-33.8688, 151.2093], // Sydney
                  ]}
                  color="#ef4444"
                  weight={3}
                  opacity={0.8}
                  dashArray="12, 12"
                  className="animate-pulse"
                />

                {/* Global South Connections */}
                <Polyline
                  positions={[
                    [-23.5558, -46.6396], // São Paulo
                    [-33.9249, 18.4241], // Cape Town
                    [19.076, 72.8777], // Mumbai
                  ]}
                  color="#8b5cf6"
                  weight={3}
                  opacity={0.8}
                  dashArray="8, 8"
                  className="animate-pulse"
                />

                {/* Carbon Intensity Data Markers */}
                {carbonDataPoints?.map((point) => (
                  <Marker
                    key={point.id}
                    position={[point.latitude, point.longitude]}
                    icon={L.divIcon({
                      className: "custom-div-icon",
                      html: `
                        <div class="relative">
                          <!-- Animated pulse ring -->
                          <div class="absolute w-8 h-8 rounded-full animate-ping" 
                               style="background-color: ${point.color}; opacity: 0.3; left: -4px; top: -4px;"></div>
                          
                          <!-- Location Pin Icon -->
                          <div class="relative flex items-center justify-center">
                            <!-- Pin Shadow -->
                            <div class="absolute w-5 h-6 shadow-xl opacity-25" 
                                 style="background-color: rgba(0,0,0,0.5); transform: translateY(1px); border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;"></div>
                            
                            <!-- Main Pin Body - Circular -->
                            <div class="relative w-5 h-5 rounded-full border border-white shadow-lg z-10 flex items-center justify-center" 
                                 style="background-color: ${point.color}; 
                                        box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                              
                              <!-- Location Icon (MapPin) -->
                              <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                              </svg>
                            </div>
                            
                            <!-- Inner Highlight -->
                            <div class="absolute w-1.5 h-1.5 rounded-full bg-white opacity-70 z-20" 
                                 style="top: 2px; left: 50%; transform: translateX(-50%);"></div>
                          </div>
                          
                          <!-- City Label - Only show on hover or at higher zoom levels -->
                          <div class="absolute top-full mt-0.5 left-1/2 transform -translate-x-1/2 bg-white/85 backdrop-blur-sm px-1.5 py-0.5 rounded text-xs font-medium text-gray-700 shadow-md border border-gray-200 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-200">
                            ${point.city}
                          </div>
                        </div>
                      `,
                      iconSize: [20, 24],
                      iconAnchor: [10, 12],
                    })}
                  >
                    <Popup>
                      <div className="bg-white text-gray-800 p-3 rounded-lg min-w-[200px] max-w-[250px] shadow-xl border border-gray-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <div
                            className="w-5 h-5 rounded-full border border-white shadow-sm flex items-center justify-center"
                            style={{
                              backgroundColor: point.color,
                            }}
                          >
                            <MapPin className="h-3 w-3 text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-lg text-gray-800">
                              {point.city}
                            </div>
                            <div className="text-sm text-gray-600">
                              {point.country}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">
                              Carbon Intensity:
                            </span>
                            <span
                              className="font-bold text-lg"
                              style={{ color: point.color }}
                            >
                              {point.intensity}g CO₂/kWh
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">
                              Requests:
                            </span>
                            <span className="text-blue-600 font-medium">
                              {point.requests.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">
                              Latency:
                            </span>
                            <span className="text-orange-600 font-medium">
                              {point.latency}ms
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-gray-300">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-gray-600">
                              Live Data
                            </span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              {/* Overlays on top of the map */}
              <div className="absolute top-4 right-4 flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 pointer-events-none z-[1000] shadow-lg border border-gray-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-700 font-medium">
                  Live Carbon Data
                </span>
              </div>

              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 pointer-events-none z-[1000] shadow-lg border border-gray-200">
                <div className="text-xs text-gray-800 mb-2 font-semibold">
                  Carbon Intensity
                </div>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                    <span className="text-xs text-gray-700">
                      Low (&lt;100g)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                    <span className="text-xs text-gray-700">
                      Medium (100-500g)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                    <span className="text-xs text-gray-700">
                      High (&gt;500g)
                    </span>
                  </div>
                </div>
              </div>

              {/* Route Legend */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 pointer-events-none z-[1000] shadow-lg border border-gray-200">
                <div className="text-xs text-gray-800 mb-2 font-semibold">
                  Active Routes
                </div>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-0.5 bg-blue-500"></div>
                    <span className="text-xs text-gray-700">US Network</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-0.5 bg-green-500"></div>
                    <span className="text-xs text-gray-700">
                      Trans-Atlantic
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-0.5 bg-yellow-500"></div>
                    <span className="text-xs text-gray-700">Eurasia Link</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-0.5 bg-red-500"></div>
                    <span className="text-xs text-gray-700">Asia Pacific</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-carbon-low"></div>
                  <span>Low (&lt;100g CO₂/kWh)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-carbon-medium"></div>
                  <span>Medium (100-150g)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-carbon-high"></div>
                  <span>High (&gt;150g)</span>
                </div>
              </div>
              <span className="text-muted-foreground">Updated 2 min ago</span>
            </div>
          </Card>

          {/* Regional Status */}
          <Card className="dashboard-card">
            <h3 className="text-lg font-semibold mb-4">Regional Status</h3>
            <div className="space-y-4">
              {regions?.map((region) => (
                <div
                  key={region.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`status-indicator ${
                        region.status === "online"
                          ? "status-online"
                          : "status-offline"
                      }`}
                    ></div>
                    <div>
                      <div className="font-medium">{region.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {region.requests24h.toLocaleString()} req •{" "}
                        {region.latency}ms
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      getCarbonIntensityBadge(region.carbonIntensity) as any
                    }
                  >
                    {region.carbonIntensity}g CO₂
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Request Routing Visualization */}
          <Card className="dashboard-card lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Request Flow</h3>
              <div className="flex items-center space-x-2">
                <div className="status-indicator status-online pulse-green"></div>
                <span className="text-sm text-muted-foreground">
                  Real-time routing
                </span>
              </div>
            </div>

            {/* Live Request Routing Visualization with Real Map */}
            <div className="bg-green-50 rounded-lg h-64 relative overflow-hidden border border-green-200">
              <MapContainer
                center={[30, 0]}
                zoom={2}
                minZoom={1}
                maxZoom={10}
                maxBounds={[
                  [-90, -180],
                  [90, 180],
                ]}
                maxBoundsViscosity={1.0}
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: "0.5rem",
                }}
                className="leaflet-container-bright"
                zoomControl={false}
                attributionControl={false}
              >
                {/* Green theme tile layer */}
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
                  subdomains="abcd"
                />

                {/* Server Node Locations with Original Icons */}
                {/* US West - Database Server */}
                <Marker
                  position={[37.7749, -122.4194]} // San Francisco
                  icon={L.divIcon({
                    className: "server-node-icon",
                    html: `
                      <div class="relative flex items-center justify-center">
                        <div class="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
                          <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
                          </svg>
                        </div>
                        <div class="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-blue-500/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-xs font-medium text-white shadow-lg whitespace-nowrap">
                          US West DB
                        </div>
                      </div>
                    `,
                    iconSize: [28, 45],
                    iconAnchor: [14, 22],
                  })}
                />

                {/* EU Central - Globe Server */}
                <Marker
                  position={[52.52, 13.405]} // Berlin
                  icon={L.divIcon({
                    className: "server-node-icon",
                    html: `
                      <div class="relative flex items-center justify-center">
                        <div class="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
                          <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                        </div>
                        <div class="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-green-500/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-xs font-medium text-white shadow-lg whitespace-nowrap">
                          EU Central
                        </div>
                      </div>
                    `,
                    iconSize: [28, 45],
                    iconAnchor: [14, 22],
                  })}
                />

                {/* Asia Pacific - Zap Server */}
                <Marker
                  position={[35.6762, 139.6503]} // Tokyo
                  icon={L.divIcon({
                    className: "server-node-icon",
                    html: `
                      <div class="relative flex items-center justify-center">
                        <div class="w-7 h-7 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
                          <svg class="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7 2v11h3v9l7-12h-4l3-8z"/>
                          </svg>
                        </div>
                        <div class="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-yellow-500/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-xs font-medium text-black shadow-lg whitespace-nowrap">
                          Asia Pacific
                        </div>
                      </div>
                    `,
                    iconSize: [28, 45],
                    iconAnchor: [14, 22],
                  })}
                />

                {/* US East - Activity Server */}
                <Marker
                  position={[40.7128, -74.006]} // New York
                  icon={L.divIcon({
                    className: "server-node-icon",
                    html: `
                      <div class="relative flex items-center justify-center">
                        <div class="w-7 h-7 bg-purple-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
                          <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9.5 14.25l-5.584 2.718 1.584 1.585L9.5 14.25zM14.5 9.75l5.584-2.718L18.5 5.447L14.5 9.75z"/>
                          </svg>
                        </div>
                        <div class="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-purple-500/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-xs font-medium text-white shadow-lg whitespace-nowrap">
                          US East
                        </div>
                      </div>
                    `,
                    iconSize: [28, 45],
                    iconAnchor: [14, 22],
                  })}
                />

                {/* Central Routing Hub */}
                <Marker
                  position={[51.5074, -0.1278]} // London (central hub)
                  icon={L.divIcon({
                    className: "routing-hub-icon",
                    html: `
                      <div class="relative flex items-center justify-center">
                        <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-xl border-2 border-white animate-pulse">
                          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l2 2 2-2c-1.1-1.1-2.9-1.1-4 0zm-4-4l2 2c2.21-2.21 5.79-2.21 8 0l2-2c-3.31-3.31-8.69-3.31-12 0z"/>
                          </svg>
                        </div>
                        <div class="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-orange-500/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-xs font-medium text-white shadow-lg whitespace-nowrap">
                          Routing Hub
                        </div>
                      </div>
                    `,
                    iconSize: [32, 50],
                    iconAnchor: [16, 25],
                  })}
                />

                {/* Connection Lines between servers */}
                {/* Hub to US West */}
                <Polyline
                  positions={[
                    [51.5074, -0.1278], // London
                    [37.7749, -122.4194], // San Francisco
                  ]}
                  color="#3b82f6"
                  weight={2}
                  opacity={0.7}
                  dashArray="5, 5"
                  className="animate-pulse"
                />

                {/* Hub to EU Central */}
                <Polyline
                  positions={[
                    [51.5074, -0.1278], // London
                    [52.52, 13.405], // Berlin
                  ]}
                  color="#10b981"
                  weight={2}
                  opacity={0.7}
                  dashArray="5, 5"
                  className="animate-pulse"
                />

                {/* Hub to Asia Pacific */}
                <Polyline
                  positions={[
                    [51.5074, -0.1278], // London
                    [35.6762, 139.6503], // Tokyo
                  ]}
                  color="#f59e0b"
                  weight={2}
                  opacity={0.7}
                  dashArray="5, 5"
                  className="animate-pulse"
                />

                {/* Hub to US East */}
                <Polyline
                  positions={[
                    [51.5074, -0.1278], // London
                    [40.7128, -74.006], // New York
                  ]}
                  color="#8b5cf6"
                  weight={2}
                  opacity={0.7}
                  dashArray="5, 5"
                  className="animate-pulse"
                />
              </MapContainer>

              {/* Live metrics overlay */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200 z-[1000]">
                <div className="text-xs text-gray-800 text-center">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">3,247 requests/min</span>
                  </div>
                  <div className="text-green-600 font-semibold">
                    Optimal routing active
                  </div>
                </div>
              </div>

              {/* Server Status Legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200 z-[1000]">
                <div className="text-xs text-gray-800 mb-2 font-semibold">
                  Server Status
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>US West DB</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>EU Central</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Asia Pacific</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>US East</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Performance Metrics */}
          <Card className="dashboard-card">
            <h3 className="text-lg font-semibold mb-4">Cache Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Hit Rate</span>
                <span className="font-semibold text-success">94.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Miss Rate</span>
                <span className="font-semibold">5.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Cache Size
                </span>
                <span className="font-semibold">2.4 GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">TTL Avg</span>
                <span className="font-semibold">5m 32s</span>
              </div>

              <Button variant="outline" size="sm" className="w-full mt-4">
                <Database className="h-4 w-4 mr-2" />
                Manage Cache
              </Button>
            </div>
          </Card>
        </div>

        {/* Environmental Impact Summary */}
        <Card className="dashboard-card mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Environmental Impact Summary
            </h3>
            <Badge variant="secondary">Last 24 Hours</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-success mb-1">847 kg</div>
              <div className="text-sm text-muted-foreground">CO₂ Avoided</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">12.4%</div>
              <div className="text-sm text-muted-foreground">
                Renewable Energy Usage
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent mb-1">3.2 MWh</div>
              <div className="text-sm text-muted-foreground">
                Clean Energy Consumed
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning mb-1">89</div>
              <div className="text-sm text-muted-foreground">
                Avg Grid Intensity (g CO₂/kWh)
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
