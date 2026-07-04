import React, { useEffect, useState } from 'react';
import { Activity, ShieldAlert, Cpu } from 'lucide-react';

const Navbar = ({ machines = [] }) => {
  const [time, setTime] = useState(new Date());

  const [user, setUser] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    try {
      const stored = localStorage.getItem('sentinel_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error parsing user state in navbar:', e);
    }
    
    return () => clearInterval(timer);
  }, []);

  const criticalCount = machines.filter(m => m.status === 'Critical').length;
  const warningCount = machines.filter(m => m.status === 'Warning').length;

  return (
    <nav className="glass-panel border-b border-slate-200 h-16 px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
      {/* Branding */}
      <div className="flex items-center gap-3">
        <div className="bg-blue-600/10 p-2 rounded-lg border border-blue-500/20 text-blue-600 glow-blue">
          <Cpu className="w-6 h-6 animate-pulse-subtle" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-wider text-slate-900 flex items-center gap-1.5">
            SentinelEdge <span className="text-blue-600">AI</span>
          </h1>
          <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Edge Industrial Intelligence</span>
        </div>
      </div>

      {/* System Status Metrics */}
      <div className="hidden md:flex items-center gap-6 text-sm font-medium">
        <div className="flex items-center gap-2 border-r border-slate-200 pr-6">
          <Activity className="w-4 h-4 text-emerald-600" />
          <span className="text-slate-600">Node Status:</span>
          <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Active</span>
        </div>

        <div className="flex items-center gap-2 border-r border-slate-200 pr-6">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span className="text-slate-600">Critical Incidents:</span>
          {criticalCount > 0 ? (
            <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200 animate-pulse">
              {criticalCount} Active
            </span>
          ) : (
            <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">0</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-600">Warnings:</span>
          {warningCount > 0 ? (
            <span className="text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {warningCount} Alert{warningCount > 1 ? 's' : ''}
            </span>
          ) : (
            <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">0</span>
          )}
        </div>
      </div>

      {/* Clock and Live telemetry badge */}
      <div className="flex items-center gap-4 text-sm">
        <span className="hidden sm:inline text-slate-400 font-mono">
          {time.toLocaleDateString()} {time.toLocaleTimeString()}
        </span>
        {user && (
          <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-600/20 text-blue-600 flex items-center justify-center font-bold text-xs">
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div className="hidden lg:block text-left">
              <span className="block text-xs font-bold text-slate-800 leading-none">{user.name}</span>
              <span className="text-[9px] text-slate-500 font-mono">{user.role || 'Specialist'}</span>
            </div>
          </div>
        )}
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
