import React from 'react';

const MetricCard = ({ title, value, unit, trend, icon: Icon, color = 'eco-green' }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {Icon && <Icon className={`h-8 w-8 text-${color} mr-3`} />}
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
              {unit && <p className="ml-2 text-sm text-gray-500">{unit}</p>}
            </div>
          </div>
        </div>
        
        {trend && (
          <div className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
