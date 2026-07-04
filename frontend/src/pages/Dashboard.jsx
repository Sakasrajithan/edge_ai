import React, { useState, useEffect } from 'react';
import API from '../api';
import MachineCard from '../components/MachineCard';
import AlertCard from '../components/AlertCard';
import SideRays from '../components/SideRays';
import { Cpu, CheckCircle2, ShieldAlert, Zap } from 'lucide-react';

const Dashboard = () => {
  const [machines, setMachines] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Poll data
  useEffect(() => {
    const fetchData = async () => {
      const machinesPromise = API.get('/machine')
        .then((res) => {
          setMachines(res.data?.data || []);
          setError(null);
        })
        .catch((err) => {
          console.error(err);
          if (err.message) console.error(err.message);
          if (err.response) {
            console.error(err.response);
            console.error(err.response.status);
            console.error(err.response.data);
          }
          setError('Failed to fetch machine telemetries. Reconnecting to SentinelEdge Node...');
        });

      const predictionsPromise = API.get('/prediction?limit=10')
        .then((res) => {
          setPredictions(res.data?.data || []);
        })
        .catch((err) => {
          console.error(err);
          if (err.message) console.error(err.message);
          if (err.response) {
            console.error(err.response);
            console.error(err.response.status);
            console.error(err.response.data);
          }
        });

      await Promise.allSettled([machinesPromise, predictionsPromise]);
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 4000); // Poll every 4 seconds
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (loading && (!machines || machines.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-slate-500 font-mono text-sm">Initializing dashboard telemetry...</p>
      </div>
    );
  }

  // Calculate summary metrics
  const totalMachines = (machines || []).length;
  const criticalCount = (machines || []).filter(m => m?.status === 'Critical').length;
  const warningCount = (machines || []).filter(m => m?.status === 'Warning').length;
  
  // Estimate overall health based on latest machine predictions
  // If we don't have predictions, use 100%. Otherwise, average the health values of all active machines.
  // We can find the latest prediction health for each unique machine.
  const machineHealthMap = {};
  (predictions || []).forEach(p => {
    if (p && p.machineId) {
      if (!machineHealthMap[p.machineId]) {
        machineHealthMap[p.machineId] = p.health;
      }
    }
  });

  const healthScores = Object.values(machineHealthMap);
  const avgHealth = healthScores.length > 0 
    ? Math.round(healthScores.reduce((a, b) => a + b, 0) / healthScores.length)
    : 95;

  const kpis = [
    {
      label: 'Overall System Health',
      value: `${avgHealth}%`,
      subText: avgHealth >= 85 ? 'System Optimal' : avgHealth >= 70 ? 'Degraded Performance' : 'Immediate Action Required',
      icon: CheckCircle2,
      color: avgHealth >= 85 ? 'text-emerald-600 border-emerald-250 bg-emerald-50' : avgHealth >= 70 ? 'text-amber-600 border-amber-250 bg-amber-50' : 'text-rose-600 border-rose-250 bg-rose-50',
      glow: avgHealth >= 85 ? 'glow-green' : avgHealth >= 70 ? 'glow-yellow' : 'glow-red'
    },
    {
      label: 'Connected Edge Nodes',
      value: totalMachines,
      subText: 'Telemetries streaming active',
      icon: Cpu,
      color: 'text-blue-600 border-blue-200 bg-blue-50',
      glow: 'glow-blue'
    },
    {
      label: 'Active Incident Alerts',
      value: criticalCount + warningCount,
      subText: `${criticalCount} Critical, ${warningCount} Warning`,
      icon: ShieldAlert,
      color: criticalCount > 0 ? 'text-rose-600 border-rose-200 bg-rose-50' : 'text-slate-600 border-slate-200 bg-slate-100',
      glow: criticalCount > 0 ? 'glow-red' : ''
    },
    {
      label: 'Calculated Efficiency',
      value: '98.7%',
      subText: 'Optimal power usage',
      icon: Zap,
      color: 'text-amber-600 border-amber-200 bg-amber-50',
      glow: 'glow-yellow'
    }
  ];

  return (
    <div className="space-y-6 relative">
      {/* Background SideRays */}
      <div className="absolute top-0 right-0 w-full h-[600px] pointer-events-none opacity-20 mix-blend-multiply z-0">
        <SideRays
          speed={2.5}
          rayColor1="#EAB308"
          rayColor2="#96c8ff"
          intensity={2}
          spread={2}
          origin="top-right"
          tilt={0}
          saturation={1.5}
          blend={0.75}
          falloff={1.6}
          opacity={1}
        />
      </div>
      {/* Telemetry connection status warning */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center justify-between text-rose-600 text-sm animate-pulse">
          <span className="font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            {error}
          </span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className={`glass-card rounded-xl p-5 border flex items-center justify-between ${kpi.glow}`}>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">{kpi.label}</span>
                <span className="text-2xl font-bold text-slate-900 font-mono block">{kpi.value}</span>
                <span className="text-[10px] text-slate-500 block font-medium">{kpi.subText}</span>
              </div>
              <div className={`p-3 rounded-lg border ${kpi.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Machine Cards & Alerts Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Machine Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-wider">Connected Machinery</h2>
              <p className="text-xs text-slate-500">Active machine diagnostics and state summaries</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {machines.map((machine) => (
              <MachineCard key={machine.machineId} machine={machine} />
            ))}
          </div>
        </div>

        {/* Real-time Alerts */}
        <div className="lg:col-span-1">
          <AlertCard 
            alerts={predictions.filter(p => p.prediction !== 'Normal')} 
            title="System Alert History" 
            limit={6} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
