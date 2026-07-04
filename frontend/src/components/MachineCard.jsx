import React from 'react';
import { Link } from 'react-router-dom';
import { Thermometer, Activity, Gauge, Zap, ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

const MachineCard = ({ machine }) => {
  const { machineId, machineName, temperature, vibration, rpm, current, status } = machine;

  const metrics = [
    { label: 'Temperature', value: `${temperature} °C`, icon: Thermometer, color: 'text-orange-600' },
    { label: 'Vibration', value: `${vibration} mm/s`, icon: Activity, color: 'text-cyan-600' },
    { label: 'RPM', value: `${rpm}`, icon: Gauge, color: 'text-blue-600' },
    { label: 'Current', value: `${current} A`, icon: Zap, color: 'text-amber-600' },
  ];

  return (
    <div className="glass-card glass-card-hover rounded-xl p-5 flex flex-col justify-between h-full relative overflow-hidden">
      {/* Glow border based on status */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        status === 'Healthy' ? 'bg-emerald-500' :
        status === 'Warning' ? 'bg-amber-500' : 'bg-rose-500'
      }`} />

      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start gap-2">
          <div>
            <span className="text-[10px] font-mono text-slate-400 block">{machineId}</span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5 tracking-wide line-clamp-1">{machineName}</h3>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 py-2 border-t border-b border-slate-100">
          {metrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={i} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-mono block mb-1 uppercase tracking-wider">{m.label}</span>
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                  <span className="text-sm font-bold text-slate-800 font-mono">{m.value}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 flex justify-end">
        <Link
          to={`/machine?id=${machineId}`}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 group"
        >
          View Live Diagnostics
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default MachineCard;
