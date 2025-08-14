import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const StatusIndicator = ({ status, text, size = 'md' }) => {
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'up':
      case 'online':
      case 'connected':
        return {
          icon: CheckCircle,
          className: 'status-healthy',
          color: 'text-green-600'
        };
      case 'warning':
      case 'degraded':
        return {
          icon: AlertTriangle,
          className: 'status-warning',
          color: 'text-yellow-600'
        };
      case 'error':
      case 'down':
      case 'offline':
      case 'disconnected':
        return {
          icon: XCircle,
          className: 'status-error',
          color: 'text-red-600'
        };
      default:
        return {
          icon: AlertTriangle,
          className: 'status-warning',
          color: 'text-gray-600'
        };
    }
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'lg':
        return 'text-base';
      default:
        return 'text-sm';
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`status-indicator ${config.className} ${getSizeClasses(size)}`}>
      <Icon size={size === 'sm' ? 12 : size === 'lg' ? 20 : 16} className="mr-1" />
      {text || status}
    </span>
  );
};

export default StatusIndicator;
