import React from "react";
import { AlertCircle, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ApiError, isNetworkError, isServerError } from "@/services/api";

interface ErrorAlertProps {
  error: unknown;
  onRetry?: () => void;
  className?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  error,
  onRetry,
  className = "",
}) => {
  const getErrorIcon = () => {
    if (isNetworkError(error)) {
      return <WifiOff className="h-5 w-5 text-destructive" />;
    }
    return <AlertCircle className="h-5 w-5 text-destructive" />;
  };

  const getErrorTitle = () => {
    if (isNetworkError(error)) {
      return "Connection Error";
    }
    if (isServerError(error)) {
      return "Server Error";
    }
    return "Error";
  };

  const getErrorMessage = () => {
    if (error instanceof ApiError) {
      if (isNetworkError(error)) {
        return "Unable to connect to the server. Please check your internet connection.";
      }
      if (isServerError(error)) {
        return "Server is temporarily unavailable. Please try again later.";
      }
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "An unexpected error occurred";
  };

  return (
    <Card className={`dashboard-card border-destructive/20 ${className}`}>
      <div className="flex items-start space-x-3">
        {getErrorIcon()}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-destructive">
            {getErrorTitle()}
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            {getErrorMessage()}
          </p>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="mt-3"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

// Inline error component for smaller spaces
export const InlineError: React.FC<{
  error: unknown;
  onRetry?: () => void;
}> = ({ error, onRetry }) => (
  <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
    <div className="flex items-center space-x-2">
      <AlertCircle className="h-4 w-4 text-destructive" />
      <span className="text-sm text-destructive">
        {error instanceof Error ? error.message : "Error loading data"}
      </span>
    </div>
    {onRetry && (
      <Button onClick={onRetry} variant="ghost" size="sm">
        <RefreshCw className="h-4 w-4" />
      </Button>
    )}
  </div>
);
