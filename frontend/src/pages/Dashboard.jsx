import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Globe, 
  Zap, 
  Database,
  RefreshCw,
  MapPin
} from 'lucide-react';
import MetricCard from '../components/UI/MetricCard';
import StatusIndicator from '../components/UI/StatusIndicator';
import CarbonIntensityBadge from '../components/UI/CarbonIntensityBadge';
import { greenProxyAPI } from '../services/api';

const Dashboard = () => {
  const [regionData, setRegionData] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [cacheStats, setCacheStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // For development, use mock data. In production, use real API calls
      const [regionResponse, healthResponse, cacheResponse] = await Promise.all([
        greenProxyAPI.getMockRegionData(),
        greenProxyAPI.getMockHealthStatus(),
        greenProxyAPI.getMockCacheStats()
      ]);

      setRegionData(regionResponse.data);
      setHealthData(healthResponse.data);
      setCacheStats(cacheResponse.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading && !regionData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time carbon-aware load balancing overview</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <button
            onClick={fetchDashboardData}
            className="btn-primary flex items-center"
            disabled={loading}
          >
            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="System Status"
          value={<StatusIndicator status={healthData?.status || 'UP'} />}
          icon={Activity}
        />
        <MetricCard
          title="Active Regions"
          value={regionData?.optimalRegions?.length || 0}
          unit="regions"
          icon={Globe}
        />
        <MetricCard
          title="Cache Entries"
          value={cacheStats?.total?.size || 0}
          unit="entries"
          icon={Database}
        />
        <MetricCard
          title="Carbon Intensity"
          value={<CarbonIntensityBadge intensity={regionData?.carbonIntensity} />}
          icon={Zap}
        />
      </div>

      {/* Current Region Info */}
      {regionData && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <MapPin className="mr-2 text-eco-green" size={20} />
              Current Routing Information
            </h2>
            <StatusIndicator status="healthy" text="Active" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Client IP</p>
              <p className="text-lg font-semibold text-gray-900">{regionData.clientIP}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Detected Country</p>
              <p className="text-lg font-semibold text-gray-900">{regionData.detectedCountry}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Recommended Region</p>
              <p className="text-lg font-semibold text-eco-green">{regionData.recommendedRegion}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Carbon Intensity</p>
              <CarbonIntensityBadge intensity={regionData.carbonIntensity} size="lg" />
            </div>
          </div>
        </div>
      )}

      {/* Available Regions */}
      {regionData?.optimalRegions && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Regions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {regionData.optimalRegions.map((region, index) => (
              <div key={region} className={`
                p-4 rounded-lg border-2 transition-all duration-200
                ${region === regionData.recommendedRegion 
                  ? 'border-eco-green bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
                }
              `}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{region}</p>
                    <p className="text-sm text-gray-600">
                      {region === regionData.recommendedRegion ? 'Recommended' : 'Available'}
                    </p>
                  </div>
                  {region === regionData.recommendedRegion && (
                    <div className="w-3 h-3 bg-eco-green rounded-full animate-pulse-slow"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cache Statistics */}
      {cacheStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cache Performance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Geolocation Cache</span>
                <div className="text-right">
                  <p className="font-semibold">{cacheStats.geolocation.size} entries</p>
                  <p className="text-sm text-gray-500">TTL: {cacheStats.geolocation.ttl}s</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Carbon Intensity Cache</span>
                <div className="text-right">
                  <p className="font-semibold">{cacheStats.carbonIntensity.size} entries</p>
                  <p className="text-sm text-gray-500">TTL: {cacheStats.carbonIntensity.ttl}s</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Redis Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Connection</span>
                <StatusIndicator 
                  status={cacheStats.redis.healthy ? 'healthy' : 'error'} 
                  text={cacheStats.redis.healthy ? 'Connected' : 'Disconnected'} 
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Host</span>
                <span className="font-mono text-sm">{cacheStats.redis.host}:{cacheStats.redis.port}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Entries</span>
                <span className="font-semibold">{cacheStats.total.size}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
