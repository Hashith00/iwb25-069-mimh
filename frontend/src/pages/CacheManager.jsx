import React, { useState, useEffect } from 'react';
import { Database, Trash2, RefreshCw, Clock, Server } from 'lucide-react';
import StatusIndicator from '../components/UI/StatusIndicator';
import { greenProxyAPI } from '../services/api';

const CacheManager = () => {
  const [cacheStats, setCacheStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchCacheStats = async () => {
    try {
      // For development, use mock data
      const response = await greenProxyAPI.getMockCacheStats();
      setCacheStats(response.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching cache stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async () => {
    setClearing(true);
    try {
      // In real implementation, this would call the actual API
      // await greenProxyAPI.clearCache();
      
      // Simulate clearing cache
      setTimeout(() => {
        setCacheStats({
          ...cacheStats,
          geolocation: { ...cacheStats.geolocation, size: 0 },
          carbonIntensity: { ...cacheStats.carbonIntensity, size: 0 },
          total: { size: 0 }
        });
        setClearing(false);
      }, 1000);
    } catch (error) {
      console.error('Error clearing cache:', error);
      setClearing(false);
    }
  };

  useEffect(() => {
    fetchCacheStats();
    const interval = setInterval(fetchCacheStats, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green"></div>
        <span className="ml-3 text-gray-600">Loading cache statistics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cache Manager</h1>
          <p className="text-gray-600 mt-1">Monitor and manage Redis cache performance</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <button
            onClick={fetchCacheStats}
            className="btn-secondary flex items-center"
            disabled={loading}
          >
            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={clearCache}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
            disabled={clearing}
          >
            {clearing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Trash2 size={16} className="mr-2" />
            )}
            Clear Cache
          </button>
        </div>
      </div>

      {/* Redis Status */}
      {cacheStats && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Server className="mr-2 text-eco-green" size={20} />
              Redis Connection Status
            </h2>
            <StatusIndicator 
              status={cacheStats.redis.healthy ? 'healthy' : 'error'}
              text={cacheStats.redis.healthy ? 'Connected' : 'Disconnected'}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Host</p>
              <p className="text-lg font-semibold font-mono">{cacheStats.redis.host}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Port</p>
              <p className="text-lg font-semibold font-mono">{cacheStats.redis.port}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Total Entries</p>
              <p className="text-lg font-semibold">{cacheStats.total.size.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Cache Statistics */}
      {cacheStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Geolocation Cache */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Database className="mr-2 text-blue-600" size={18} />
              Geolocation Cache
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Entries</span>
                <span className="font-semibold text-lg">{cacheStats.geolocation.size.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">TTL (Time To Live)</span>
                <span className="font-semibold flex items-center">
                  <Clock size={16} className="mr-1 text-gray-500" />
                  {cacheStats.geolocation.ttl} seconds
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cache Type</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                  IP Geolocation
                </span>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Stores IP address to location mappings. Longer TTL since locations don't change frequently.
                </p>
              </div>
            </div>
          </div>

          {/* Carbon Intensity Cache */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Database className="mr-2 text-green-600" size={18} />
              Carbon Intensity Cache
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Entries</span>
                <span className="font-semibold text-lg">{cacheStats.carbonIntensity.size.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">TTL (Time To Live)</span>
                <span className="font-semibold flex items-center">
                  <Clock size={16} className="mr-1 text-gray-500" />
                  {cacheStats.carbonIntensity.ttl} seconds
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cache Type</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                  Carbon Data
                </span>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Stores real-time carbon intensity by region. Shorter TTL for more frequent updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cache Performance Metrics */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Insights</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-eco-green mb-2">~90%</div>
            <p className="text-gray-600">API Call Reduction</p>
            <p className="text-sm text-gray-500 mt-1">Estimated savings from caching</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">~100x</div>
            <p className="text-gray-600">Faster Lookups</p>
            <p className="text-sm text-gray-500 mt-1">Redis vs external API calls</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">&lt;5ms</div>
            <p className="text-gray-600">Average Response</p>
            <p className="text-sm text-gray-500 mt-1">Cache hit response time</p>
          </div>
        </div>
      </div>

      {/* Cache Strategy */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Cache Strategy</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Geolocation Caching</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 1 hour TTL (3600 seconds)</li>
              <li>• IP locations rarely change</li>
              <li>• Key pattern: geoip:{ip_address}</li>
              <li>• Reduces geolocation API calls</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Carbon Intensity Caching</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 30 minutes TTL (1800 seconds)</li>
              <li>• Carbon data updates frequently</li>
              <li>• Key pattern: carbon:{zone}</li>
              <li>• Balances freshness vs performance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CacheManager;
