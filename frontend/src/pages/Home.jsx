import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SideRays from '../components/SideRays';
import { Cpu, ShieldCheck, Zap, Activity, ChevronRight, Lock } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('sentinel_user');
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 relative overflow-hidden font-sans select-none flex flex-col justify-between">
      {/* Background WebGL Rays effect */}
      <div className="absolute top-0 right-0 w-full h-[700px] pointer-events-none opacity-25 mix-blend-multiply z-0">
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

      {/* Decorative ambient glowing grids */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/10 via-transparent to-transparent pointer-events-none z-0" />

      {/* Custom Landing Navbar */}
      <header className="relative z-10 w-full border-b border-slate-200 bg-white/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/10 p-2 rounded-lg border border-blue-600/20 text-blue-600">
              <Cpu className="w-6 h-6 animate-pulse-subtle" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-wider text-slate-900 flex items-center gap-1.5">
                SentinelEdge <span className="text-blue-600 text-xs px-2 py-0.5 rounded bg-blue-600/10 border border-blue-600/20">AI</span>
              </h1>
              <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase block -mt-0.5">Edge Industrial Intelligence</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all flex items-center gap-2 hover:scale-[1.02]"
              >
                Go to Dashboard <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-white border border-slate-200 hover:border-slate-300 text-slate-700 shadow-sm transition-all flex items-center gap-2 hover:scale-[1.02]"
                >
                  Create Node account
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content container */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-24 flex-1 flex flex-col justify-center items-center">
        
        {/* Minimal Centered Hero Section */}
        <div className="text-center space-y-8 max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20 text-xs text-blue-600 font-mono mx-auto">
            <Activity className="w-3.5 h-3.5 animate-pulse" /> Edge Telemetry Console Active
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 font-sans">
            High Fidelity <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500">
              Predictive Analytics
            </span> <br />
            at the Machine Edge.
          </h2>
          
          <p className="text-slate-600 text-base md:text-lg font-normal leading-relaxed max-w-2xl mx-auto">
            SentinelEdge AI connects directly to industrial micro-sensors to run lightweight, real-time anomaly detection. Predict failures, monitor bearings, and inspect performance telemetry.
          </p>

          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <button 
              onClick={() => navigate(isLoggedIn ? '/dashboard' : '/register')}
              className="px-8 py-4 rounded-lg text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_4px_25px_rgba(59,130,246,0.2)] transition-all flex items-center gap-2"
            >
              Provision Edge Node <ChevronRight className="w-5 h-5" />
            </button>
            <Link 
              to="/login"
              className="px-8 py-4 rounded-lg text-base font-semibold bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 shadow-sm transition-colors"
            >
              Access Specialist Terminal
            </Link>
          </div>
        </div>

        {/* Feature Highlights Section */}
        <section id="features" className="w-full py-16 border-t border-slate-200">
          <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
            <h3 className="text-xs font-bold text-blue-600 font-mono tracking-widest uppercase">System Capabilities</h3>
            <h4 className="text-2xl md:text-4xl font-extrabold text-slate-900 font-sans">Intelligent Industrial Safeguards</h4>
            <p className="text-slate-600 text-sm">Lightweight machine learning modules combined with live WebOS telemetry.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-xl p-6 border border-slate-200 space-y-4 hover:border-slate-350 transition-all text-center">
              <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-600/20 text-blue-600 flex items-center justify-center mx-auto">
                <Activity className="w-5 h-5" />
              </div>
              <h5 className="text-base font-bold text-slate-900 font-sans">High-Frequency Monitoring</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ingest sub-millisecond vibrational sensors, thermal data, and rotor RPM frequencies. Run analytics without high bandwidth dependencies.
              </p>
            </div>

            <div className="glass-card rounded-xl p-6 border border-slate-200 space-y-4 hover:border-slate-350 transition-all text-center">
              <div className="w-10 h-10 rounded-lg bg-amber-600/10 border border-amber-600/20 text-amber-600 flex items-center justify-center mx-auto">
                <Zap className="w-5 h-5" />
              </div>
              <h5 className="text-base font-bold text-slate-900 font-sans">Predictive Diagnostics</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Identify mechanical wear, bearing misalignment, and rotor friction spikes before they manifest in system shutdowns.
              </p>
            </div>

            <div className="glass-card rounded-xl p-6 border border-slate-200 space-y-4 hover:border-slate-350 transition-all text-center">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-600/20 text-indigo-600 flex items-center justify-center mx-auto">
                <Lock className="w-5 h-5" />
              </div>
              <h5 className="text-base font-bold text-slate-900 font-sans">Zero-Trust Security</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                SentinelEdge nodes stream telemetry signatures authenticated via client token authentication. Restrict control panel access to authenticated specialists.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/90 relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-slate-700">SentinelEdge AI</span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            &copy; {new Date().getFullYear()} SentinelEdge AI. Edge Intelligence for Industrial Safety.
          </p>
          <div className="flex gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 block" /> Server: online
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
