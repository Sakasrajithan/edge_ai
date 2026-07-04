import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ChartCard = ({ history = [], title = "Telemetry Historical Trends" }) => {
  const [activeMetric, setActiveMetric] = useState('temperature');

  const metricsConfig = {
    temperature: { label: 'Temperature', unit: '°C', color: '#ea580c', gradient: 'colorTemp' },
    vibration: { label: 'Vibration', unit: 'mm/s', color: '#0891b2', gradient: 'colorVib' },
    rpm: { label: 'RPM', unit: 'rpm', color: '#2563eb', gradient: 'colorRpm' },
    current: { label: 'Current', unit: 'A', color: '#ca8a04', gradient: 'colorCurrent' },
  };

  const currentMetric = metricsConfig[activeMetric];

  // Format data for chart
  const chartData = (history || []).map(item => {
    if (!item) return {};
    return {
      ...item,
      formattedTime: item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '',
      temperature: typeof item.temperature === 'number' ? parseFloat(item.temperature.toFixed(2)) : 0,
      vibration: typeof item.vibration === 'number' ? parseFloat(item.vibration.toFixed(2)) : 0,
      rpm: typeof item.rpm === 'number' ? Math.round(item.rpm) : 0,
      current: typeof item.current === 'number' ? parseFloat(item.current.toFixed(2)) : 0,
    };
  });

  return (
    <div className="glass-card rounded-xl p-5 flex flex-col h-full min-h-[380px]">
      {/* Header and Toggles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-500 tracking-wider uppercase">{title}</h3>
          <span className="text-[10px] font-mono text-slate-400">LATEST {history.length} READINGS</span>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
          {Object.entries(metricsConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveMetric(key)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold font-mono transition-all ${
                activeMetric === key
                  ? 'bg-white text-blue-600 border border-slate-200 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 border border-transparent'
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Component */}
      <div className="w-full h-[260px]">
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500 text-xs font-mono">
            No historical data available. Waiting for stream...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                {/* Custom glowing gradients for each metric */}
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ea580c" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorVib" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0891b2" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#0891b2" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRpm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ca8a04" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#ca8a04" stopOpacity={0}/>
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              
              <XAxis 
                dataKey="formattedTime" 
                stroke="#94a3b8" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
              />
              
              <YAxis 
                stroke="#94a3b8" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                domain={['auto', 'auto']}
              />
              
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                  color: '#0f172a'
                }}
                labelStyle={{ color: '#64748b', fontSize: '10px', fontFamily: 'monospace' }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                formatter={(value) => [`${value} ${currentMetric.unit}`, currentMetric.label]}
              />

              <Area
                type="monotone"
                dataKey={activeMetric}
                stroke={currentMetric.color}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#${currentMetric.gradient})`}
                animationDuration={300}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ChartCard;
