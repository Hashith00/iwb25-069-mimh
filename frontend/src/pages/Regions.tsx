import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Search, 
  Globe, 
  Zap, 
  Clock,
  Wifi,
  TrendingUp,
  TrendingDown,
  Info,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";

const Regions = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Mock data
  const regions = [
    {
      id: "us-west-1",
      name: "US West (Oregon)",
      location: "Oregon, USA",
      carbonIntensity: 89,
      status: "online",
      latency: 35,
      renewable: 78,
      capacity: 95,
      requests24h: 156780,
      costMultiplier: 1.0
    },
    {
      id: "eu-central-1",
      name: "EU Central (Frankfurt)",
      location: "Frankfurt, Germany",
      carbonIntensity: 156,
      status: "online",
      latency: 48,
      renewable: 45,
      capacity: 87,
      requests24h: 98450,
      costMultiplier: 1.2
    },
    {
      id: "ap-southeast-1",
      name: "Asia Pacific (Singapore)",
      location: "Singapore",
      carbonIntensity: 180,
      status: "online",
      latency: 52,
      renewable: 25,
      capacity: 91,
      requests24h: 134590,
      costMultiplier: 1.15
    },
    {
      id: "us-east-1",
      name: "US East (Virginia)",
      location: "Virginia, USA",
      carbonIntensity: 124,
      status: "online",
      latency: 38,
      renewable: 58,
      capacity: 88,
      requests24h: 189230,
      costMultiplier: 0.95
    },
    {
      id: "eu-north-1",
      name: "EU North (Stockholm)",
      location: "Stockholm, Sweden",
      carbonIntensity: 45,
      status: "online",
      latency: 44,
      renewable: 92,
      capacity: 76,
      requests24h: 67890,
      costMultiplier: 1.1
    },
    {
      id: "ca-central-1",
      name: "Canada Central (Toronto)",
      location: "Toronto, Canada",
      carbonIntensity: 67,
      status: "online",
      latency: 41,
      renewable: 85,
      capacity: 82,
      requests24h: 78340,
      costMultiplier: 1.05
    }
  ];

  const getCarbonIntensityColor = (intensity: number) => {
    if (intensity < 100) return "text-success";
    if (intensity < 150) return "text-warning";
    return "text-destructive";
  };

  const getCarbonIntensityBadge = (intensity: number) => {
    if (intensity < 100) return "success";
    if (intensity < 150) return "warning";
    return "destructive";
  };

  const handleIpLookup = () => {
    // Mock IP lookup functionality
    if (ipAddress) {
      setSelectedRegion("us-west-1");
    }
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
                <span className="text-xl font-bold">Region Explorer</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link to="/admin">
                <Button variant="ghost">Admin</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* IP Lookup Tool */}
        <Card className="dashboard-card mb-8">
          <h2 className="text-2xl font-bold mb-6">IP Address Lookup</h2>
          <p className="text-muted-foreground mb-4">
            Enter an IP address to see which regions would be recommended for optimal routing
          </p>
          
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Enter IP address (e.g., 8.8.8.8)"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleIpLookup} disabled={!ipAddress}>
              <Search className="h-4 w-4 mr-2" />
              Lookup
            </Button>
          </div>
          
          {selectedRegion && (
            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-5 w-5 text-success" />
                <span className="font-semibold text-success">Recommended Region</span>
              </div>
              <p className="text-sm">
                Based on the IP location and current carbon intensity, <strong>US West (Oregon)</strong> is 
                the optimal region with the lowest environmental impact and good performance.
              </p>
            </div>
          )}
        </Card>

        {/* Regions Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Available Regions</h2>
              <p className="text-muted-foreground">
                Real-time carbon intensity and performance metrics for all regions
              </p>
            </div>
            <Badge variant="secondary">
              <Wifi className="h-4 w-4 mr-2" />
              {regions.length} Regions Online
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regions.map((region) => (
              <Card 
                key={region.id} 
                className={`dashboard-card cursor-pointer transition-all hover:shadow-lg ${
                  selectedRegion === region.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedRegion(region.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{region.name}</h3>
                  </div>
                  <div className={`status-indicator ${region.status === 'online' ? 'status-online' : 'status-offline'}`}></div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">{region.location}</p>
                
                {/* Carbon Intensity */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">Carbon Intensity</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getCarbonIntensityBadge(region.carbonIntensity) as any}>
                      {region.carbonIntensity}g CO₂/kWh
                    </Badge>
                  </div>
                </div>
                
                {/* Renewable Energy */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">Renewable Energy</span>
                  <span className="font-semibold text-success">{region.renewable}%</span>
                </div>
                
                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{region.latency}ms</div>
                    <div className="text-xs text-muted-foreground">Latency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{region.capacity}%</div>
                    <div className="text-xs text-muted-foreground">Capacity</div>
                  </div>
                </div>
                
                {/* 24h Requests */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <span className="text-sm text-muted-foreground">24h Requests</span>
                  <span className="font-semibold">{region.requests24h.toLocaleString()}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Region Comparison */}
        {selectedRegion && (
          <Card className="dashboard-card">
            <h3 className="text-xl font-semibold mb-6">Region Details</h3>
            
            {(() => {
              const region = regions.find(r => r.id === selectedRegion);
              if (!region) return null;
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-4">{region.name}</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium">{region.location}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant="secondary">Online</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Carbon Intensity</span>
                        <div className="flex items-center space-x-2">
                          <span className={`font-semibold ${getCarbonIntensityColor(region.carbonIntensity)}`}>
                            {region.carbonIntensity}g CO₂/kWh
                          </span>
                          {region.carbonIntensity < 100 ? (
                            <TrendingDown className="h-4 w-4 text-success" />
                          ) : (
                            <TrendingUp className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Renewable Energy</span>
                        <span className="font-semibold text-success">{region.renewable}%</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Cost Multiplier</span>
                        <span className="font-semibold">{region.costMultiplier}x</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-4">Performance Metrics</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Average Latency</span>
                        </div>
                        <span className="font-semibold">{region.latency}ms</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Zap className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Capacity Usage</span>
                        </div>
                        <span className="font-semibold">{region.capacity}%</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Info className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">24h Requests</span>
                        </div>
                        <span className="font-semibold">{region.requests24h.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t">
                      <Button className="w-full" disabled>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Detailed Analytics
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </Card>
        )}

        {/* Carbon Intensity Comparison Chart */}
        <Card className="dashboard-card mt-8">
          <h3 className="text-xl font-semibold mb-6">Carbon Intensity Comparison</h3>
          
          <div className="space-y-4">
            {regions.map((region) => (
              <div key={region.id} className="flex items-center space-x-4">
                <div className="w-32 text-sm font-medium truncate">{region.name}</div>
                <div className="flex-1 bg-muted rounded-full h-4 relative">
                  <div 
                    className={`h-4 rounded-full ${
                      region.carbonIntensity < 100 ? 'bg-success' :
                      region.carbonIntensity < 150 ? 'bg-warning' : 'bg-destructive'
                    }`}
                    style={{ width: `${Math.min((region.carbonIntensity / 200) * 100, 100)}%` }}
                  />
                </div>
                <div className="w-24 text-sm font-semibold text-right">
                  {region.carbonIntensity}g CO₂/kWh
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 rounded-lg bg-muted/30">
            <h4 className="font-semibold mb-2">Routing Recommendation</h4>
            <p className="text-sm text-muted-foreground">
              Based on current carbon intensity, EU North (Stockholm) offers the cleanest energy with 45g CO₂/kWh.
              Consider routing non-latency-critical workloads to this region for maximum environmental benefit.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Regions;