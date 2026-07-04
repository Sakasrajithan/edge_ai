import React from 'react';

const HealthCard = ({ health, status }) => {
  const safeHealth = typeof health === 'number' ? health : 0;
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (safeHealth / 100) * circumference;

  const getColorClass = () => {
    if (safeHealth >= 85) return 'text-emerald-500 stroke-emerald-500';
    if (safeHealth >= 70) return 'text-amber-500 stroke-amber-500';
    return 'text-rose-500 stroke-rose-500';
  };

  const getBgColorClass = () => {
    if (safeHealth >= 85) return 'bg-emerald-50 border-emerald-200 text-emerald-700';
    if (safeHealth >= 70) return 'bg-amber-50 border-amber-200 text-amber-700';
    return 'bg-rose-50 border-rose-200 text-rose-700';
  };

  return (
    <div className="glass-card rounded-xl p-5 flex flex-col items-center justify-center text-center h-full">
      <h3 className="text-sm font-bold text-slate-500 self-start tracking-wider uppercase">AI Health Index</h3>
      
      <div className="relative flex items-center justify-center my-6">
        {/* SVG Circular Progress Gauge */}
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Track Circle */}
          <circle
            className="stroke-slate-100"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress Circle */}
          <circle
            className={`transition-all duration-500 ease-out ${getColorClass()}`}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeLinecap="round"
          />
        </svg>

        {/* Central percentage text */}
        <div className="absolute text-2xl font-bold font-mono text-slate-900 flex flex-col items-center">
          <span>{safeHealth}%</span>
          <span className="text-[9px] uppercase tracking-widest text-slate-400">Health</span>
        </div>
      </div>

      <div className={`w-full py-2 px-3 rounded-lg border text-center ${getBgColorClass()}`}>
        <p className="text-xs font-semibold uppercase tracking-wider">
          System Condition: <span className="font-bold">{status}</span>
        </p>
      </div>
    </div>
  );
};

export default HealthCard;
