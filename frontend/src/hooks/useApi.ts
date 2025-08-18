import { useState, useEffect, useCallback } from "react";
import {
  api,
  DashboardMetrics,
  Region,
  OptimalRegionsResponse,
  SystemStatus,
  CarbonIntensityLocation,
  CacheStats,
  EnvironmentalImpact,
} from "@/services/api";

// Generic hook for API calls
export function useApiCall<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err);
      console.error("API call failed:", err);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// Specific hooks for each API endpoint
export const useDashboardMetrics = () => {
  return useApiCall<DashboardMetrics>(api.getMetrics);
};

export const useRegions = () => {
  return useApiCall<Region[]>(api.getRegions);
};

export const useOptimalRegions = (ip?: string) => {
  return useApiCall<OptimalRegionsResponse>(
    () => api.getOptimalRegions(ip),
    [ip]
  );
};

export const useSystemStatus = () => {
  return useApiCall<SystemStatus>(api.getSystemStatus);
};

export const useCarbonIntensityGlobal = () => {
  return useApiCall<CarbonIntensityLocation[]>(api.getCarbonIntensityGlobal);
};

export const useCacheStats = () => {
  return useApiCall<CacheStats>(api.getCacheStats);
};

export const useEnvironmentalImpact = () => {
  return useApiCall<EnvironmentalImpact>(api.getEnvironmentalImpact);
};

// Hook for auto-refreshing data
export function useAutoRefresh<T>(
  apiCall: () => Promise<T>,
  interval: number = 30000, // 30 seconds
  dependencies: any[] = []
) {
  const { data, loading, error, refetch } = useApiCall(apiCall, dependencies);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(true);

  useEffect(() => {
    if (!isAutoRefreshing || loading) return;

    const intervalId = setInterval(() => {
      refetch();
    }, interval);

    return () => clearInterval(intervalId);
  }, [isAutoRefreshing, loading, refetch, interval]);

  const toggleAutoRefresh = useCallback(() => {
    setIsAutoRefreshing((prev) => !prev);
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    isAutoRefreshing,
    toggleAutoRefresh,
  };
}

// Hook for dashboard with auto-refresh
export const useDashboardWithRefresh = () => {
  return useAutoRefresh<DashboardMetrics>(api.getMetrics, 30000);
};

// Hook for system status with frequent updates
export const useSystemStatusWithRefresh = () => {
  return useAutoRefresh<SystemStatus>(api.getSystemStatus, 10000); // 10 seconds
};
