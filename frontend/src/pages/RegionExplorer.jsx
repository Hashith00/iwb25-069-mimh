import React, { useState } from 'react';
import { Search, MapPin, Globe, Zap } from 'lucide-react';
import CarbonIntensityBadge from '../components/UI/CarbonIntensityBadge';

const RegionExplorer = () => {
  const [ipAddress, setIpAddress] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for regions and their carbon intensities
  const mockRegionData = {
    'us-east-1': { name: 'US East (Virginia)', carbonIntensity: 320, country: 'United States' },
    'us-west-2': { name: 'US West (Oregon)', carbonIntensity: 180, country: 'United States' },
    'eu-west-1': { name: 'Europe (Ireland)', carbonIntensity: 250, country: 'Ireland' },
    'eu-central-1': { name: 'Europe (Frankfurt)', carbonIntensity: 280, country: 'Germany' },
    'ap-southeast-1': { name: 'Asia Pacific (Singapore)', carbonIntensity: 295, country: 'Singapore' },
    'ap-northeast-1': { name: 'Asia Pacific (Tokyo)', carbonIntensity: 340, country: 'Japan' }
  };

  const handleIPLookup = async () => {
    if (!ipAddress) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock response based on IP
      const mockResponse = {
        clientIP: ipAddress,
        detectedCountry: 'Sri Lanka',
        optimalRegions: ['ap-southeast-1', 'ap-northeast-1', 'eu-central-1'],
        recommendedRegion: 'ap-southeast-1',
        carbonIntensity: 295.5
      };
      
      setSearchResult(mockResponse);
      setIsLoading(false);
    }, 1000);
  };

  const getAllRegions = () => {
    return Object.entries(mockRegionData).map(([code, data]) => ({
      code,
      ...data
    }));
  };

  const getOptimalRegion = (regions) => {
    return regions.reduce((min, region) => 
      mockRegionData[region].carbonIntensity < mockRegionData[min].carbonIntensity ? region : min
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Region Explorer</h1>
        <p className="text-gray-600 mt-1">Discover optimal regions and explore carbon intensity data</p>
      </div>

      {/* IP Lookup Tool */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Search className="mr-2 text-eco-green" size={20} />
          IP Address Lookup
        </h2>
        
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Enter IP address (e.g., 111.223.178.156)"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-green focus:border-transparent"
          />
          <button
            onClick={handleIPLookup}
            disabled={isLoading || !ipAddress}
            className="btn-primary flex items-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Search size={16} className="mr-2" />
            )}
            Lookup
          </button>
        </div>

        {/* Search Results */}
        {searchResult && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-gray-900 mb-3">Lookup Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">IP Address</p>
                <p className="font-semibold">{searchResult.clientIP}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Detected Country</p>
                <p className="font-semibold">{searchResult.detectedCountry}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Recommended Region</p>
                <p className="font-semibold text-eco-green">{searchResult.recommendedRegion}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Carbon Intensity</p>
                <CarbonIntensityBadge intensity={searchResult.carbonIntensity} />
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Available Regions</p>
              <div className="flex flex-wrap gap-2">
                {searchResult.optimalRegions.map(region => (
                  <span
                    key={region}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      region === searchResult.recommendedRegion
                        ? 'bg-eco-green text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {region}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* All Regions Overview */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Globe className="mr-2 text-eco-green" size={20} />
          All Available Regions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getAllRegions().map(region => (
            <div key={region.code} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{region.code}</h3>
                <CarbonIntensityBadge intensity={region.carbonIntensity} size="sm" />
              </div>
              <p className="text-sm text-gray-600 mb-1">{region.name}</p>
              <div className="flex items-center text-xs text-gray-500">
                <MapPin size={12} className="mr-1" />
                {region.country}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carbon Comparison */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="mr-2 text-eco-green" size={20} />
          Carbon Intensity Comparison
        </h2>
        
        <div className="space-y-3">
          {getAllRegions()
            .sort((a, b) => a.carbonIntensity - b.carbonIntensity)
            .map((region, index) => (
              <div key={region.code} className="flex items-center space-x-4">
                <div className="w-8 text-center">
                  <span className={`text-sm font-bold ${
                    index === 0 ? 'text-green-600' : index === 1 ? 'text-yellow-600' : index === 2 ? 'text-orange-600' : 'text-gray-600'
                  }`}>
                    #{index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{region.code}</p>
                      <p className="text-sm text-gray-500">{region.name}</p>
                    </div>
                    <CarbonIntensityBadge intensity={region.carbonIntensity} />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RegionExplorer;
