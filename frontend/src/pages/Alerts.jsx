import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import SideRays from '../components/SideRays';
import { Search, Filter, ShieldCheck, ChevronRight } from 'lucide-react';

const Alerts = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await API.get('/prediction?limit=100');
        // Filter out predictions that are 'Normal'
        const abnormalPredictions = res.data.data.filter(p => p.prediction !== 'Normal');
        setPredictions(abnormalPredictions);
        setError(null);
      } catch (err) {
        console.error('Error fetching prediction logs:', err);
        setError('Connection to edge data logs lost.');
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
    const interval = setInterval(fetchPredictions, 6000); // Poll every 6s
    return () => clearInterval(interval);
  }, []);

  if (loading && predictions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-slate-500 font-mono text-sm">Accessing edge incident records...</p>
      </div>
    );
  }

  // Filter logic
  const filteredPredictions = predictions.filter((p) => {
    const isCritical = p.health < 60;
    const alertStatus = isCritical ? 'Critical' : 'Warning';

    const matchesSearch = 
      p.machineId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.prediction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.recommendation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'All' || 
      alertStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-wider">Alert Incident Logs</h2>
        <p className="text-xs text-slate-500 font-medium">Historical audit of AI predictive warnings and recommendations</p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-600 text-sm animate-pulse">
          {error}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-xl p-4 border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by Machine ID, fault description, recommendation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all font-mono"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-4 w-full md:w-auto shrink-0 justify-end">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 font-mono">
            <Filter className="w-3.5 h-3.5" />
            FILTER LEVEL:
          </span>
          <div className="flex gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
            {['All', 'Warning', 'Critical'].map((level) => (
              <button
                key={level}
                onClick={() => setStatusFilter(level)}
                className={`px-3 py-1 rounded-md text-xs font-semibold font-mono transition-all ${
                  statusFilter === level
                    ? level === 'Critical' 
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : level === 'Warning'
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : 'bg-white text-blue-600 border border-slate-200 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 border border-transparent'
                }`}
              >
                {level.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Table / Feed */}
      <div className="glass-panel rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white/70 backdrop-blur-md">
        {filteredPredictions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <ShieldCheck className="w-12 h-12 text-emerald-500/80" />
            <p className="text-slate-800 font-semibold">No Incidents Found</p>
            <p className="text-xs text-slate-500 max-w-sm">
              All machines are currently operating within nominal parameters, or matches your search query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                  <th className="p-4">Severity</th>
                  <th className="p-4">Machine ID</th>
                  <th className="p-4">Fault Prediction</th>
                  <th className="p-4">Recommended Actions</th>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredPredictions.map((log) => {
                  const isCritical = log.health < 60;
                  const severityStyles = isCritical 
                    ? 'bg-rose-50 text-rose-600 border-rose-200' 
                    : 'bg-amber-50 text-amber-600 border-amber-200';
                  
                  return (
                    <tr 
                      key={log._id} 
                      className={`hover:bg-slate-50/50 transition-all border-b border-slate-100 ${
                        isCritical ? 'hover:bg-rose-50/30' : 'hover:bg-amber-50/30'
                      }`}
                    >
                      {/* Severity Pill */}
                      <td className="p-4 font-semibold font-mono">
                        <span className={`px-2 py-0.5 rounded-full border text-[9px] uppercase ${severityStyles}`}>
                          {isCritical ? 'Critical' : 'Warning'}
                        </span>
                      </td>

                      {/* Machine ID */}
                      <td className="p-4 font-bold text-slate-800 font-mono">
                        {log.machineId}
                      </td>

                      {/* Prediction Description */}
                      <td className="p-4">
                        <div>
                          <p className="font-bold text-slate-900">{log.prediction}</p>
                          <span className="text-[10px] text-slate-400 font-mono">HEALTH: {log.health}%</span>
                        </div>
                      </td>

                      {/* Recommendations */}
                      <td className="p-4 text-slate-600 max-w-xs md:max-w-md truncate">
                        {log.recommendation}
                      </td>

                      {/* Timestamp */}
                      <td className="p-4 text-slate-400 font-mono">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <Link 
                          to={`/machine?id=${log.machineId}`}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold font-mono group"
                        >
                          DIAGNOSTICS
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
