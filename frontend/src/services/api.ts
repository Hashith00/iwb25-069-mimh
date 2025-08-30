const API_BASE_URL = "/api";
import {
  DashboardMetrics,
  Region,
  OptimalRegionsResponse,
  SystemStatus,
  CarbonIntensityLocation,
  CacheStats,
  EnvironmentalImpact,
} from "../types/types";

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
