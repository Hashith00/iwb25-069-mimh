import { useState, useEffect, useRef, useCallback } from "react";

export interface WebSocketEvent {
  type: "stats" | "carbon" | "routing" | "health";
  timestamp: string;
  data: any;
}

export interface StatsEventData {
  totalRoutingEvents: number;
  totalCarbonEvents: number;
  totalHealthEvents: number;
  connectedClients: number;
  lastEventTime: string;
  regionStats: Record<string, any>;
  carbonStats: Record<string, any>;
}

export interface CarbonEventData {
  eventId: string;
  timestamp: string;
  region: string;
  carbonIntensity: number;
  dataSource: string;
  cached: boolean;
}

export interface RoutingEventData {
  eventId: string;
  timestamp: string;
  clientIP: string;
  detectedCountry: string;
  availableRegions: string[];
  selectedRegion: string;
  serviceUrl: string;
  carbonIntensity: number;
  requestPath: string;
  httpMethod: string;
  processingTimeMs: number;
}

export enum WebSocketStatus {
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
  DISCONNECTED = "DISCONNECTED",
  ERROR = "ERROR",
}

interface UseWebSocketReturn {
  events: WebSocketEvent[];
  status: WebSocketStatus;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  clearEvents: () => void;
  latestEvent: WebSocketEvent | null;
}

export const useWebSocket = (
  url: string,
  maxEvents: number = 100
): UseWebSocketReturn => {
  const [events, setEvents] = useState<WebSocketEvent[]>([]);
  const [status, setStatus] = useState<WebSocketStatus>(
    WebSocketStatus.DISCONNECTED
  );
  const [error, setError] = useState<string | null>(null);
  const [latestEvent, setLatestEvent] = useState<WebSocketEvent | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const addEvent = useCallback(
    (event: WebSocketEvent) => {
      setEvents((prev) => {
        const newEvents = [event, ...prev];
        return newEvents.slice(0, maxEvents);
      });
      setLatestEvent(event);
    },
    [maxEvents]
  );

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      setStatus(WebSocketStatus.CONNECTING);
      setError(null);

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        setStatus(WebSocketStatus.CONNECTED);
        setError(null);
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          addEvent(data);
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err);
        }
      };

      ws.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
        setStatus(WebSocketStatus.DISCONNECTED);

        // Auto-reconnect logic
        if (
          !event.wasClean &&
          reconnectAttempts.current < maxReconnectAttempts
        ) {
          const delay = Math.min(
            1000 * Math.pow(2, reconnectAttempts.current),
            10000
          );
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setStatus(WebSocketStatus.ERROR);
        setError("Connection failed");
      };
    } catch (err) {
      setStatus(WebSocketStatus.ERROR);
      setError("Failed to create WebSocket connection");
      console.error("WebSocket connection error:", err);
    }
  }, [url, addEvent]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setStatus(WebSocketStatus.DISCONNECTED);
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
    setLatestEvent(null);
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    events,
    status,
    error,
    connect,
    disconnect,
    clearEvents,
    latestEvent,
  };
};
