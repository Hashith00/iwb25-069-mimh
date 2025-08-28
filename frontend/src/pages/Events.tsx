import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  Zap,
  Route,
  BarChart3,
  Play,
  Pause,
  Trash2,
  Wifi,
  WifiOff,
  AlertCircle,
  Clock,
  Globe,
  Server,
  Gauge,
} from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  useWebSocket,
  WebSocketStatus,
  WebSocketEvent,
  StatsEventData,
  CarbonEventData,
  RoutingEventData,
} from "@/hooks/useWebSocket";

const Events: React.FC = () => {
  const {
    events,
    status,
    error,
    connect,
    disconnect,
    clearEvents,
    latestEvent,
  } = useWebSocket("ws://localhost:9090/events", 200);

  const [selectedEventType, setSelectedEventType] = useState<string>("all");
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    // Auto-connect when component mounts
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  const filteredEvents = events.filter(
    (event) => selectedEventType === "all" || event.type === selectedEventType
  );

  const getEventIcon = (type: string) => {
    switch (type) {
      case "stats":
        return <BarChart3 className="h-4 w-4" />;
      case "carbon":
        return <Zap className="h-4 w-4" />;
      case "routing":
        return <Route className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case "stats":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "carbon":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "routing":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case WebSocketStatus.CONNECTED:
        return <Wifi className="h-4 w-4 text-green-500" />;
      case WebSocketStatus.CONNECTING:
        return <Activity className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case WebSocketStatus.DISCONNECTED:
        return <WifiOff className="h-4 w-4 text-gray-500" />;
      case WebSocketStatus.ERROR:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <WifiOff className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const renderStatsEvent = (data: StatsEventData) => (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <span className="font-medium">Total Events:</span>
        <div className="ml-2">
          <div>Routing: {data.totalRoutingEvents}</div>
          <div>Carbon: {data.totalCarbonEvents}</div>
          <div>Health: {data.totalHealthEvents}</div>
        </div>
      </div>
      <div>
        <span className="font-medium">Connected Clients:</span>{" "}
        {data.connectedClients}
        {data.lastEventTime && (
          <div className="mt-1">
            <span className="font-medium">Last Event:</span>{" "}
            {formatTimestamp(data.lastEventTime)}
          </div>
        )}
      </div>
    </div>
  );

  const renderCarbonEvent = (data: CarbonEventData) => (
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4" />
        <span className="font-medium">Region:</span> {data.region}
        <Badge
          variant="outline"
          className={data.cached ? "border-blue-500" : "border-orange-500"}
        >
          {data.cached ? "Cached" : "Live"}
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <Gauge className="h-4 w-4" />
        <span className="font-medium">Carbon Intensity:</span>{" "}
        {data.carbonIntensity} gCO2/kWh
      </div>
      <div className="flex items-center gap-2">
        <Server className="h-4 w-4" />
        <span className="font-medium">Data Source:</span> {data.dataSource}
      </div>
      <div className="text-xs text-muted-foreground">
        Event ID: {data.eventId}
      </div>
    </div>
  );

  const renderRoutingEvent = (data: RoutingEventData) => (
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4" />
        <span className="font-medium">Client:</span> {data.clientIP} (
        {data.detectedCountry})
      </div>
      <div className="flex items-center gap-2">
        <Route className="h-4 w-4" />
        <span className="font-medium">Selected Region:</span>{" "}
        {data.selectedRegion}
        <Badge variant="outline" className="border-green-500">
          {data.carbonIntensity} gCO2/kWh
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <Server className="h-4 w-4" />
        <span className="font-medium">Service URL:</span> {data.serviceUrl}
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span className="font-medium">Processing Time:</span>{" "}
        {data.processingTimeMs}ms
      </div>
      <div>
        <span className="font-medium">Available Regions:</span>{" "}
        {data.availableRegions.join(", ")}
      </div>
      <div className="text-xs text-muted-foreground">
        {data.httpMethod} {data.requestPath} | Event ID: {data.eventId}
      </div>
    </div>
  );

  const renderEventData = (event: WebSocketEvent) => {
    switch (event.type) {
      case "stats":
        return renderStatsEvent(event.data as StatsEventData);
      case "carbon":
        return renderCarbonEvent(event.data as CarbonEventData);
      case "routing":
        return renderRoutingEvent(event.data as RoutingEventData);
      default:
        return (
          <pre className="text-xs overflow-auto">
            {JSON.stringify(event.data, null, 2)}
          </pre>
        );
    }
  };

  return (
    <DashboardLayout pageTitle="Events">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Real-time Events</h1>
            <p className="text-muted-foreground">
              Live monitoring of Green Proxy system events
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm font-medium capitalize">
              {status.toLowerCase()}
            </span>
          </div>
        </div>

        {/* Connection Error */}
        {error && (
          <Alert className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Event Stream Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {status === WebSocketStatus.CONNECTED ? (
                  <Button onClick={disconnect} variant="outline" size="sm">
                    <Pause className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                ) : (
                  <Button onClick={connect} variant="default" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                )}
                <Button onClick={clearEvents} variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Events
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Events: {filteredEvents.length} / {events.length} total
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Latest Event Summary */}
        {latestEvent && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getEventIcon(latestEvent.type)}
                Latest Event
                <Badge className={getEventBadgeColor(latestEvent.type)}>
                  {latestEvent.type.toUpperCase()}
                </Badge>
              </CardTitle>
              <CardDescription>
                {formatTimestamp(latestEvent.timestamp)}
              </CardDescription>
            </CardHeader>
            <CardContent>{renderEventData(latestEvent)}</CardContent>
          </Card>
        )}

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle>Event History</CardTitle>
            <CardDescription>Real-time stream of system events</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={selectedEventType}
              onValueChange={setSelectedEventType}
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Events</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
                <TabsTrigger value="carbon">Carbon</TabsTrigger>
                <TabsTrigger value="routing">Routing</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedEventType} className="mt-4">
                <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                  {filteredEvents.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      {status === WebSocketStatus.CONNECTED
                        ? "No events yet. Waiting for data..."
                        : "Connect to start receiving events"}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredEvents.map((event, index) => (
                        <div key={`${event.timestamp}-${index}`}>
                          <Card>
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {getEventIcon(event.type)}
                                  <Badge
                                    className={getEventBadgeColor(event.type)}
                                  >
                                    {event.type.toUpperCase()}
                                  </Badge>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {formatTimestamp(event.timestamp)}
                                </span>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              {renderEventData(event)}
                            </CardContent>
                          </Card>
                          {index < filteredEvents.length - 1 && (
                            <Separator className="my-2" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Events;
