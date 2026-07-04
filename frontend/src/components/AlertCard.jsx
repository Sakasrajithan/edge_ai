import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

const AlertCard = ({ alerts = [], title = "System Alerts Feed", limit = 5 }) => {
  const displayAlerts = alerts.slice(0, limit);

  return (
    <div className="glass-card rounded-xl p-5 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-500 tracking-wider uppercase">{title}</h3>
        <span className="text-[10px] font-mono bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-500">
          REAL-TIME FEED
        </span>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[360px] space-y-3 pr-1">
        {displayAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
            <ShieldCheck className="w-10 h-10 text-emerald-500/80" />
            <p className="text-slate-800 font-medium">All Systems Operational</p>
            <p className="text-xs text-slate-500">No abnormal edge sensor values detected.</p>
          </div>
        ) : (
          displayAlerts.map((alert, idx) => {
            const isCritical = alert.health < 60; // or status === 'Critical'
            const Icon = isCritical ? AlertCircle : AlertTriangle;
            const iconColor = isCritical ? 'text-rose-500' : 'text-amber-500';
            const bgHoverClass = isCritical ? 'hover:bg-rose-50' : 'hover:bg-amber-50';
            
            return (
              <div 
                key={alert._id || idx} 
                className={`flex justify-between items-center p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:border-slate-350 transition-all ${bgHoverClass}`}
              >
                <div className="flex gap-3 items-center">
                  <div className={`p-1.5 rounded bg-white border border-slate-200 ${iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{alert.machineId}</span>
                      <span className="text-[9px] font-mono text-slate-400">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-0.5 line-clamp-1">
                      {alert.prediction} - Health: <span className="font-bold text-slate-800">{alert.health}%</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${
                    isCritical 
                      ? 'bg-rose-50 text-rose-600 border-rose-200' 
                      : 'bg-amber-50 text-amber-600 border-amber-200'
                  }`}>
                    {isCritical ? 'Critical' : 'Warning'}
                  </span>
                  <Link 
                    to={`/machine?id=${alert.machineId}`}
                    className="text-[10px] text-blue-600 hover:text-blue-700 underline font-medium"
                  >
                    Diagnostics
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AlertCard;
