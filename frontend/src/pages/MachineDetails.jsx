import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api';
import HealthCard from '../components/HealthCard';
import RecommendationCard from '../components/RecommendationCard';
import ChartCard from '../components/ChartCard';
import StatusBadge from '../components/StatusBadge';
import SideRays from '../components/SideRays';
import { Thermometer, Activity as VibrationIcon, Gauge, Zap, Calendar, HardDrive, RefreshCw } from 'lucide-react';

const MachineDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeMachineId = searchParams.get('id');

  const [machines, setMachines] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [latestPrediction, setLatestPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch machines list initially
  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const res = await API.get('/machine');
        const machineList = res.data.data;
        setMachines(machineList);

        // If no activeMachineId in URL, select the first machine
        if (machineList.length > 0 && !activeMachineId) {
          setSearchParams({ id: machineList[0].machineId });
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching machines list:', err);
        setError('Failed to fetch machines.');
      }
    };
    fetchMachines();
  }, [activeMachineId, setSearchParams]);

  // 2. Fetch specific machine details and latest prediction
  useEffect(() => {
    if (!activeMachineId) return;

    const fetchDiagnostics = async () => {
      try {
        const [machineRes, predictionRes] = await Promise.all([
          API.get(`/machine/${activeMachineId}`),
          API.get(`/prediction?machineId=${activeMachineId}&limit=1`)
        ]);

        setSelectedMachine(machineRes.data.data);
        
        // If we have a prediction, set it. If not, create a fallback healthy prediction.
        if (predictionRes.data.data && predictionRes.data.data.length > 0) {
          setLatestPrediction(predictionRes.data.data[0]);
        } else {
          setLatestPrediction({
            health: 98,
            prediction: 'Normal',
            recommendation: 'Continue Monitoring',
            timestamp: new Date()
          });
        }
        setError(null);
      } catch (err) {
        console.error(`Error fetching diagnostics for ${activeMachineId}:`, err);
        setError(`Failed to fetch live diagnostics for ${activeMachineId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnostics();
    const interval = setInterval(fetchDiagnostics, 4000); // poll every 4s for real-time charts/metrics
    return () => clearInterval(interval);
  }, [activeMachineId]);

  const selectMachineId = (id) => {
    setSearchParams({ id });
  };

  if (loading && machines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-slate-500 font-mono text-sm">Loading Diagnostics workspace...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
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
      {/* Left Pane: Machine Selector */}
      <div className="lg:col-span-1 space-y-4">
        <div className="glass-panel rounded-xl p-4 border border-slate-200">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 font-mono">
            Machinery Node List
          </h3>
          <div className="space-y-2">
            {machines.map((m) => (
              <button
                key={m.machineId}
                onClick={() => selectMachineId(m.machineId)}
                className={`w-full flex justify-between items-center p-3 rounded-lg border text-left transition-all ${
                  activeMachineId === m.machineId
                    ? 'bg-blue-600/10 border-blue-600/20 text-blue-600'
                    : 'bg-slate-50 border-slate-205 text-slate-500 hover:text-slate-800 hover:border-slate-350'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono block opacity-80">{m.machineId}</span>
                  <span className="text-xs font-bold font-mono tracking-wide line-clamp-1">{m.machineName}</span>
                </div>
                <span className={`w-2 h-2 rounded-full ${
                  m.status === 'Healthy' ? 'bg-emerald-500' :
                  m.status === 'Warning' ? 'bg-amber-500' : 'bg-rose-500'
                } animate-pulse`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Pane: Diagnostic Workspace */}
      <div className="lg:col-span-3 space-y-6">
        {selectedMachine && latestPrediction ? (
          <>
            {/* Machine Profile Header */}
            <div className="glass-panel rounded-xl p-5 border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-mono bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-500">
                    NODE: {selectedMachine.machineId}
                  </span>
                  <StatusBadge status={selectedMachine.status} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-wide font-sans">
                  {selectedMachine.machineName}
                </h2>
                <div className="flex items-center gap-4 text-xs text-slate-550 font-mono mt-1">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    Last Updated: {new Date(selectedMachine.updatedAt).toLocaleTimeString()}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <HardDrive className="w-3.5 h-3.5" />
                    Edge Module: v3.1.2-beta
                  </span>
                </div>
              </div>

              {/* Status drift info */}
              <div className="flex items-center gap-2 text-xs text-slate-550 font-mono self-stretch md:self-auto bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
                <span>Polling telemetry stream every 4s</span>
              </div>
            </div>

            {/* AI Diagnostics: Health Index & Recommendation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <HealthCard 
                  health={latestPrediction.health} 
                  status={selectedMachine.status} 
                />
              </div>
              <div className="md:col-span-2">
                <RecommendationCard 
                  prediction={latestPrediction.prediction} 
                  recommendation={latestPrediction.recommendation}
                  status={selectedMachine.status}
                />
              </div>
            </div>

            {/* Quick Metrics Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Temperature', value: selectedMachine.temperature, unit: '°C', icon: Thermometer, color: 'text-orange-600', bg: 'bg-orange-50' },
                { label: 'Vibration', value: selectedMachine.vibration, unit: 'mm/s', icon: VibrationIcon, color: 'text-cyan-600', bg: 'bg-cyan-50' },
                { label: 'RPM Speed', value: selectedMachine.rpm, unit: 'RPM', icon: Gauge, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Current Load', value: selectedMachine.current, unit: 'A', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' }
              ].map((metric, i) => {
                const Icon = metric.icon;
                return (
                  <div key={i} className="glass-card rounded-xl p-4 flex items-center justify-between border border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block font-mono">
                        {metric.label}
                      </span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-xl font-bold font-mono text-slate-900">{metric.value}</span>
                        <span className="text-xs text-slate-500 font-mono font-bold">{metric.unit}</span>
                      </div>
                    </div>
                    <div className={`p-2.5 rounded-lg ${metric.bg} ${metric.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* History Chart */}
            <div className="w-full">
              <ChartCard 
                history={selectedMachine.history} 
                title={`${selectedMachine.machineName} Diagnostics Timeline`} 
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center min-h-[40vh] text-slate-500 font-mono">
            No machine selected or telemetry stream disconnected.
          </div>
        )}
      </div>
    </div>
  );
};

export default MachineDetails;
