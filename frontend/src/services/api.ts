const API_BASE_URL = "/api";

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

// API Error class for better error handling
export class ApiError extends Error {
  constructor(message: string, public status: number, public endpoint: string) {
    super(message);
    this.name = "ApiError";
  }
}

// Generic API call function with error handling
async function apiCall<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(
        `API call failed: ${response.status} ${response.statusText}`,
        response.status,
        endpoint
      );
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network or parsing errors
    throw new ApiError(
      `Network error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      0,
      endpoint
    );
  }
}

export const dashboardApi = {
  // Get dashboard metrics
  getMetrics: (): Promise<DashboardMetrics> =>
    apiCall<DashboardMetrics>("/dashboard/metrics"),

  // Get regions data
  getRegions: (): Promise<Region[]> => apiCall<Region[]>("/regions"),

  // Get optimal regions for IP
  getOptimalRegions: (ip?: string): Promise<OptimalRegionsResponse> => {
    const endpoint = ip
      ? `/optimal-regions?ip=${encodeURIComponent(ip)}`
      : "/optimal-regions";
    return apiCall<OptimalRegionsResponse>(endpoint);
  },

  // Get system status
  getSystemStatus: (): Promise<SystemStatus> =>
    apiCall<SystemStatus>("/system/status"),
};

export const enhancedApi = {
  // Get global carbon intensity data
  getCarbonIntensityGlobal: (): Promise<CarbonIntensityLocation[]> =>
    apiCall<CarbonIntensityLocation[]>("/carbon-intensity/global"),

  // Get cache statistics
  getCacheStats: (): Promise<CacheStats> => apiCall<CacheStats>("/cache/stats"),

  // Get environmental impact
  getEnvironmentalImpact: (): Promise<EnvironmentalImpact> =>
    apiCall<EnvironmentalImpact>("/environmental/impact"),
};

// Combined API object for easy access
export const api = {
  ...dashboardApi,
  ...enhancedApi,
};

// Utility functions for error handling
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    return `${error.message} (${error.endpoint})`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
};

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof ApiError && error.status === 0;
};

export const isServerError = (error: unknown): boolean => {
  return error instanceof ApiError && error.status >= 500;
};

export const isClientError = (error: unknown): boolean => {
  return error instanceof ApiError && error.status >= 400 && error.status < 500;
};
