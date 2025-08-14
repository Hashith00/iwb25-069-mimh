import axios from 'axios';

const API_BASE = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
export const greenProxyAPI = {
  // Debug endpoints
  getDebugRegions: () => api.get('/debug/regions'),
  
  // Cache management
  getCacheStats: () => api.get('/cache/stats'),
  clearCache: () => api.delete('/cache'),
  
  // Health check
  getHealth: () => api.get('/health'),
  
  // Mock data functions for development
  getMockRegionData: () => Promise.resolve({
    data: {
      clientIP: "111.223.178.156",
      detectedCountry: "Sri Lanka",
      optimalRegions: ["ap-southeast-1", "ap-northeast-1", "eu-central-1"],
      recommendedRegion: "ap-southeast-1",
      carbonIntensity: 295.5
    }
  }),
  
  getMockCacheStats: () => Promise.resolve({
    data: {
      geolocation: { size: 1250, ttl: 3600 },
      carbonIntensity: { size: 89, ttl: 1800 },
      total: { size: 1339 },
      redis: { host: "localhost", port: 6379, healthy: true }
    }
  }),
  
  getMockHealthStatus: () => Promise.resolve({
    data: {
      status: "UP",
      cache: { redis: true }
    }
  })
};

// Error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
