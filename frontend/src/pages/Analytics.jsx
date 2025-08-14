import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingDown, TrendingUp, Activity, Leaf } from 'lucide-react';
import MetricCard from '../components/UI/MetricCard';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [loading, setLoading] = useState(false);

  // Mock data for charts
  const carbonIntensityTrends = [
    { time: '00:00', 'us-east-1': 320, 'us-west-2': 180, 'eu-west-1': 250, 'ap-southeast-1': 295 },
    { time: '04:00', 'us-east-1': 310, 'us-west-2': 160, 'eu-west-1': 240, 'ap-southeast-1': 280 },
    { time: '08:00', 'us-east-1': 350, 'us-west-2': 190, 'eu-west-1': 270, 'ap-southeast-1': 310 },
    { time: '12:00', 'us-east-1': 340, 'us-west-2': 200, 'eu-west-1': 260, 'ap-southeast-1': 300 },
    { time: '16:00', 'us-east-1': 330, 'us-west-2': 170, 'eu-west-1': 245, 'ap-southeast-1': 290 },
    { time: '20:00', 'us-east-1': 315, 'us-west-2': 165, 'eu-west-1': 235, 'ap-southeast-1': 285 }
  ];

  const requestDistribution = [
    { region: 'us-west-2', requests: 1250, percentage: 35 },
    { region: 'ap-southeast-1', requests: 1100, percentage: 31 },
    { region: 'eu-west-1', requests: 750, percentage: 21 },
    { region: 'us-east-1', requests: 460, percentage: 13 }
  ];

  const carbonSavings = [
    { date: '2024-01-01', savings: 150 },
    { date: '2024-01-02', savings: 180 },
    { date: '2024-01-03', savings: 200 },
    { date: '2024-01-04', savings: 175 },
    { date: '2024-01-05', savings: 220 },
    { date: '2024-01-06', savings: 195 },
    { date: '2024-01-07', savings: 240 }
  ];

  const regionPerformance = [
    { region: 'us-west-2', avgResponse: 85, uptime: 99.9, carbonIntensity: 180 },
    { region: 'ap-southeast-1', avgResponse: 120, uptime: 99.8, carbonIntensity: 295 },
    { region: 'eu-west-1', avgResponse: 95, uptime: 99.7, carbonIntensity: 250 },
    { region: 'us-east-1', avgResponse: 110, uptime: 99.5, carbonIntensity: 320 }
  ];

  const COLORS = ['#059669', '#0891b2', '#7c3aed', '#dc2626'];

  const pieData = requestDistribution.map((item, index) => ({
    name: item.region,
    value: item.requests,
    color: COLORS[index % COLORS.length]
  }));

  const totalRequests = requestDistribution.reduce((sum, item) => sum + item.requests, 0);
  const avgCarbonIntensity = regionPerformance.reduce((sum, item) => sum + item.carbonIntensity, 0) / regionPerformance.length;
  const totalCarbonSavings = carbonSavings.reduce((sum, item) => sum + item.savings, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Environmental impact and performance insights</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-green focus:border-transparent"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Requests"
          value={totalRequests.toLocaleString()}
          unit="requests"
          trend={12}
          icon={Activity}
        />
        <MetricCard
          title="Carbon Savings"
          value={totalCarbonSavings}
          unit="kg CO₂"
          trend={8}
          icon={Leaf}
          color="green-600"
        />
        <MetricCard
          title="Avg Carbon Intensity"
          value={Math.round(avgCarbonIntensity)}
          unit="gCO₂/kWh"
          trend={-5}
          icon={TrendingDown}
          color="blue-600"
        />
        <MetricCard
          title="Optimal Routes"
          value="87%"
          unit="of requests"
          trend={3}
          icon={TrendingUp}
          color="purple-600"
        />
      </div>

      {/* Carbon Intensity Trends */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Carbon Intensity Trends</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={carbonIntensityTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [`${value} gCO₂/kWh`, name]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Line type="monotone" dataKey="us-west-2" stroke="#059669" strokeWidth={2} name="US West 2" />
              <Line type="monotone" dataKey="eu-west-1" stroke="#0891b2" strokeWidth={2} name="EU West 1" />
              <Line type="monotone" dataKey="ap-southeast-1" stroke="#7c3aed" strokeWidth={2} name="AP Southeast 1" />
              <Line type="monotone" dataKey="us-east-1" stroke="#dc2626" strokeWidth={2} name="US East 1" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Request Distribution and Carbon Savings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Distribution */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Request Distribution by Region</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} requests`]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Carbon Savings Over Time */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Daily Carbon Savings</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={carbonSavings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} kg CO₂`, 'Carbon Savings']}
                  labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                />
                <Bar dataKey="savings" fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Region Performance Table */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Region Performance Metrics</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Response Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uptime
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carbon Intensity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {regionPerformance.map((region, index) => (
                <tr key={region.region} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        region.carbonIntensity < 200 ? 'bg-green-400' :
                        region.carbonIntensity < 300 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}></div>
                      <div className="text-sm font-medium text-gray-900">{region.region}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {region.avgResponse}ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {region.uptime}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      region.carbonIntensity < 200 ? 'bg-green-100 text-green-800' :
                      region.carbonIntensity < 300 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {region.carbonIntensity} gCO₂/kWh
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Healthy
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Environmental Impact Summary */}
      <div className="card bg-green-50 border-green-200">
        <div className="flex items-center mb-4">
          <Leaf className="text-green-600 mr-2" size={24} />
          <h2 className="text-xl font-semibold text-gray-900">Environmental Impact Summary</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{totalCarbonSavings} kg</div>
            <p className="text-gray-600">Total CO₂ Saved</p>
            <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">87%</div>
            <p className="text-gray-600">Optimal Route Selection</p>
            <p className="text-xs text-gray-500 mt-1">Environmentally efficient</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">-15%</div>
            <p className="text-gray-600">Carbon Footprint Reduction</p>
            <p className="text-xs text-gray-500 mt-1">Compared to random routing</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
