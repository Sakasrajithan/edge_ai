import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Activity, AlertTriangle, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/machine', label: 'Machine Details', icon: Activity },
    { to: '/alerts', label: 'Alerts & Logs', icon: AlertTriangle },
  ];

  const handleLogout = () => {
    localStorage.removeItem('sentinel_user');
    navigate('/');
  };

  return (
    <aside className="glass-panel w-64 border-r border-slate-200 fixed top-16 bottom-0 left-0 z-40 hidden sm:flex flex-col p-4 justify-between">
      <div className="space-y-6">
        <div className="px-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
            Navigation
          </p>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/10 text-blue-600 border border-blue-600/20 shadow-[0_0_15px_-3px_rgba(59,130,246,0.05)]'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer in Sidebar with Logout */}
      <div className="space-y-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Disconnect Node
        </button>

        <div className="p-3 border-t border-slate-200 space-y-1">
          <p className="text-[10px] text-slate-400 font-mono">MVP VERSION: 1.0.0</p>
          <p className="text-[9px] text-slate-400 font-mono">SENTINELEDGE NODE #04</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
