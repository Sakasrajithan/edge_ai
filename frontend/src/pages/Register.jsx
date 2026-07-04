import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SideRays from '../components/SideRays';
import { Cpu, User, Mail, Lock, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('sentinel_user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all telemetry registry fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Key sign discrepancies. Confirm security passkey matches.');
      return;
    }

    if (password.length < 6) {
      setError('Security passkey must contain at least 6 characters.');
      return;
    }

    setLoading(true);

    // Simulate account provisioning
    setTimeout(() => {
      try {
        const users = JSON.parse(localStorage.getItem('sentinel_users') || '[]');
        
        // Check if email already registered
        const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (emailExists || email.toLowerCase() === 'admin@sentinel.ai') {
          setError('Email signature registered under another node profile.');
          setLoading(false);
          return;
        }

        const newUser = {
          name,
          email,
          password
        };

        // Add to users database
        users.push(newUser);
        localStorage.setItem('sentinel_users', JSON.stringify(users));

        setSuccess('Sentinel credentials provisioned successfully! Authorizing node...');
        
        // Log in immediately
        setTimeout(() => {
          localStorage.setItem('sentinel_user', JSON.stringify({
            email: newUser.email,
            name: newUser.name,
            role: 'Associate Analyst',
            token: 'mock-jwt-token-' + Math.random().toString(36).substr(2)
          }));
          navigate('/dashboard');
        }, 1500);

      } catch (err) {
        setError('Failed to provision node registry. Telemetry storage full or write failure.');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center relative overflow-hidden font-sans select-none">
      
      {/* Background WebGL Rays effect */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-25 mix-blend-multiply z-0">
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

      <div className="absolute -top-[200px] left-[5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Main glass registration card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        
        {/* Logo and header */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-blue-600/10 p-3 rounded-xl border border-blue-600/20 text-blue-600 mb-3 shadow-[0_0_20px_rgba(59,130,246,0.05)]">
            <Cpu className="w-8 h-8 animate-pulse-subtle" />
          </div>
          <h2 className="text-2xl font-black tracking-wider text-slate-900">
            SentinelEdge <span className="text-blue-600">AI</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono uppercase tracking-widest mt-1">Edge Node Registry Console</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-8 shadow-xl relative">
          
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span>Provision New Node Account</span>
          </h3>

          {error && (
            <div className="bg-rose-50 border border-rose-250 text-rose-600 rounded-xl p-4 text-xs flex gap-3 mb-6 items-start">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-250 text-emerald-600 rounded-xl p-4 text-xs flex gap-3 mb-6 items-start">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Specialist Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 font-mono tracking-widest uppercase block">
                Specialist Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Alex Mercer"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 font-mono tracking-widest uppercase block">
                Contact Signature (Email)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 font-mono tracking-widest uppercase block">
                Access Passkey
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                  required
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 font-mono tracking-widest uppercase block">
                Confirm Passkey
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-[0_4px_20px_rgba(59,130,246,0.25)] transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
                  <span>Provisioning telemetry node...</span>
                </>
              ) : (
                <>
                  <span>Create Specialist Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>

        {/* Link to Login */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Already have node authorization?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold underline">
            Log in to node console
          </Link>
        </p>

        {/* Link to landing page */}
        <p className="text-center text-xs mt-3">
          <Link to="/" className="text-slate-500 hover:text-slate-600 font-mono">
            &larr; Return to main landing console
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
