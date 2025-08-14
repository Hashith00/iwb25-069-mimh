import React from 'react';

const CarbonIntensityBadge = ({ intensity, size = 'md' }) => {
  const getCarbonColor = (value) => {
    if (value < 200) return 'carbon-low';
    if (value < 400) return 'carbon-medium';
    return 'carbon-high';
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-lg';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  if (intensity === null || intensity === undefined) {
    return (
      <span className={`inline-flex items-center rounded-full bg-gray-100 text-gray-800 font-medium ${getSizeClasses(size)}`}>
        N/A
      </span>
    );
  }

  const colorClass = getCarbonColor(intensity);

  return (
    <span className={`inline-flex items-center rounded-full bg-${colorClass} text-white font-medium ${getSizeClasses(size)}`}>
      {intensity} gCO₂/kWh
    </span>
  );
};

export default CarbonIntensityBadge;
