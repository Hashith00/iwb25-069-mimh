import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Globe,
  Activity,
  Gauge,
  Leaf,
  AlertTriangle,
  ExternalLink,
  Calendar,
  Clock,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import HeaderComponent from "@/components/HeaderComponent";
import { api, CarbonIntensityLocation, getErrorMessage } from "@/services/api";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for Leaflet markers in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom hook for fetching data
const useRegionsData = () => {
  const [locations, setLocations] = useState<CarbonIntensityLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to fetch from the enhanced API first
        try {
          const data = await api.getCarbonIntensityGlobal();
          setLocations(data);
        } catch (apiError) {
          console.warn(
            "Enhanced API failed, using fallback data:",
            getErrorMessage(apiError)
          );

          // Fallback to mock data if API fails
          const mockData: CarbonIntensityLocation[] = [
            {
              id: 1,
              city: "N. Virginia",
              country: "USA",
              longitude: -78.2323,
              latitude: 38.8236,
              intensity: 285,
              color: "#ef4444",
              requests: 5120,
              latency: 45,
            },
            {
              id: 4,
              city: "Oregon",
              country: "USA",
              longitude: -122.6784,
              latitude: 45.5152,
              intensity: 110,
              color: "#22c55e",
              requests: 4150,
              latency: 30,
            },
            {
              id: 7,
              city: "Canada Central",
              country: "Canada",
              longitude: -73.5673,
              latitude: 45.5017,
              intensity: 25,
              color: "#22c55e",
              requests: 2100,
              latency: 60,
            },
            {
              id: 8,
              city: "São Paulo",
              country: "Brazil",
              longitude: -46.6333,
              latitude: -23.5505,
              intensity: 150,
              color: "#eab308",
              requests: 1850,
              latency: 180,
            },
            {
              id: 9,
              city: "Ireland",
              country: "Ireland",
              longitude: -6.2603,
              latitude: 53.3498,
              intensity: 290,
              color: "#ef4444",
              requests: 4800,
              latency: 90,
            },
            {
              id: 10,
              city: "Frankfurt",
              country: "Germany",
              longitude: 8.6821,
              latitude: 50.1109,
              intensity: 380,
              color: "#ef4444",
              requests: 4500,
              latency: 100,
            },
            {
              id: 12,
              city: "Paris",
              country: "France",
              longitude: 2.3522,
              latitude: 48.8566,
              intensity: 55,
              color: "#22c55e",
              requests: 3200,
              latency: 105,
            },
            {
              id: 13,
              city: "Stockholm",
              country: "Sweden",
              longitude: 18.0686,
              latitude: 59.3293,
              intensity: 20,
              color: "#22c55e",
              requests: 1500,
              latency: 110,
            },
            {
              id: 18,
              city: "Mumbai",
              country: "India",
              longitude: 72.8777,
              latitude: 19.076,
              intensity: 650,
              color: "#ef4444",
              requests: 4200,
              latency: 210,
            },
            {
              id: 20,
              city: "Singapore",
              country: "Singapore",
              longitude: 103.8198,
              latitude: 1.3521,
              intensity: 400,
              color: "#ef4444",
              requests: 4900,
              latency: 230,
            },
            {
              id: 21,
              city: "Tokyo",
              country: "Japan",
              longitude: 139.6917,
              latitude: 35.6895,
              intensity: 510,
              color: "#ef4444",
              requests: 4600,
              latency: 150,
            },
            {
              id: 23,
              city: "Sydney",
              country: "Australia",
              longitude: 151.2093,
              latitude: -33.8688,
              intensity: 710,
              color: "#ef4444",
              requests: 2900,
              latency: 190,
            },
          ];
          setLocations(mockData);
        }
      } catch (error) {
        console.error("Failed to fetch regions data:", error);
        setError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { locations, loading, error };
};

const RegionsPage: React.FC = () => {
  const { locations, loading, error } = useRegionsData();

  // Current time for display
  const currentTime = new Date().toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading electricity data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to Load Data</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">GreenProxy</span>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-lg font-semibold">
                Global Electricity & Carbon Data
              </h1>
            </div>
            <HeaderComponent />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Main Content Area - Electricity Maps Style */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Panel - Region List */}
          <div className="xl:col-span-1">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Regions
              </h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-sm">{location.city}</h3>
                        <p className="text-xs text-muted-foreground">
                          {location.country}
                        </p>
                      </div>
                      <Badge
                        variant={
                          location.intensity <= 100
                            ? "secondary"
                            : location.intensity <= 300
                            ? "outline"
                            : "destructive"
                        }
                        className="text-xs"
                      >
                        {location.intensity}g
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content - Electricity Maps Style Display */}
          <div className="xl:col-span-3 space-y-6">
            {/* Header Info Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold">
                    Global Electricity Data
                  </h1>
                  <p className="text-muted-foreground flex items-center gap-2 mt-2">
                    <Clock className="h-4 w-4" />
                    {currentTime}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-orange-600">
                    {Math.round(
                      locations.reduce((sum, loc) => sum + loc.intensity, 0) /
                        locations.length
                    )}
                    g
                  </div>
                  <div className="text-sm text-muted-foreground">CO₂eq/kWh</div>
                  <div className="text-sm font-medium">
                    Average Carbon Intensity
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(
                      (locations.filter((loc) => loc.intensity <= 100).length /
                        locations.length) *
                        100
                    )}
                    %
                  </div>
                  <div className="text-sm text-green-700 font-medium">
                    Low-carbon
                  </div>
                </div>

                <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(
                      (locations.filter((loc) => loc.intensity <= 150).length /
                        locations.length) *
                        100
                    )}
                    %
                  </div>
                  <div className="text-sm text-blue-700 font-medium">
                    Renewable
                  </div>
                </div>

                <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">
                    {locations
                      .reduce((sum, loc) => sum + loc.requests, 0)
                      .toLocaleString()}
                  </div>
                  <div className="text-sm text-purple-700 font-medium">
                    Total Requests
                  </div>
                </div>
              </div>
            </Card>

            {/* Carbon Intensity Chart */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Carbon Intensity
              </h2>
              <div className="space-y-3">
                {locations
                  .sort((a, b) => a.intensity - b.intensity)
                  .map((location) => (
                    <div key={location.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">
                          {location.city}, {location.country}
                        </span>
                        <span className="font-semibold">
                          {location.intensity}g CO₂eq/kWh
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            location.intensity <= 100
                              ? "bg-green-500"
                              : location.intensity <= 300
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              (location.intensity / 800) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </Card>

            {/* Electricity Mix Visualization */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Regional Performance Metrics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {locations.slice(0, 6).map((location) => (
                  <div key={location.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{location.city}</h3>
                      <Badge
                        variant={
                          location.intensity <= 100
                            ? "secondary"
                            : location.intensity <= 300
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {location.intensity}g CO₂/kWh
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Latency:</span>
                        <span className="font-medium">
                          {location.latency}ms
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          24h Requests:
                        </span>
                        <span className="font-medium">
                          {location.requests.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Renewable:
                        </span>
                        <span className="font-medium text-green-600">
                          {location.intensity <= 100
                            ? "85%"
                            : location.intensity <= 300
                            ? "45%"
                            : "15%"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Data Sources and External Link */}
            <Card className="p-6 bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-2">
                    Methodologies and data sources
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time carbon intensity data aggregated from multiple
                    regional electricity grids
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <a
                    href="https://app.electricitymaps.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View on Electricity Maps
                  </a>
                  <a
                    href="https://app.electricitymaps.com/zone/LK/72h/hourly"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Sri Lanka Data
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionsPage;
