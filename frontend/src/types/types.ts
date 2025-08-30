// Types for API responses
export interface DashboardMetrics {
  currentSavings: number;
  totalRequestsToday: number;
  averageLatency: number;
  activeRegions: number;
}

export interface Region {
  id: string;
  name: string;
  location: string;
  carbonIntensity: number;
  status: "online" | "offline" | "maintenance";
  latency: number;
  renewable: number;
  capacity: number;
  requests24h: number;
  costMultiplier: number;
}

export interface OptimalRegionsResponse {
  clientIP: string;
  detectedCountry: string;
  optimalRegions: string[];
  recommendedRegion: string;
  carbonIntensity: number;
  serviceUrl: string;
  routingReason: string;
}

export interface SystemStatus {
  status: "online" | "degraded" | "offline";
  requestsPerMinute: number;
  optimalRoutingActive: boolean;
  uptime: string;
  lastUpdated: string;
}

export interface CarbonIntensityLocation {
  id: number;
  city: string;
  country: string;
  longitude: number;
  latitude: number;
  intensity: number;
  color: string;
  requests: number;
  latency: number;
}

export interface CacheStats {
  hitRate: number;
  missRate: number;
  cacheSize: string;
  ttlAverage: string;
  geolocation: {
    size: number;
    ttl: number;
  };
  carbonIntensity: {
    size: number;
    ttl: number;
  };
  total: {
    size: number;
  };
  redis: {
    host: string;
    port: number;
    healthy: boolean;
  };
}

export interface EnvironmentalImpact {
  co2Avoided: string;
  renewableUsage: number;
  cleanEnergyConsumed: string;
  avgGridIntensity: number;
  period: string;
  carbonSavingsPercentage: number;
  totalEnergyConsumed: string;
  renewableEnergyConsumed: string;
  fossilEnergyConsumed: string;
  co2EmissionsSaved: number;
  co2EmissionsTotal: number;
  co2EmissionsWithoutOptimization: number;
  efficiencyGain: number;
}
