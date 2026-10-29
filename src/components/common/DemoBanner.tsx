import React from 'react';
import { useApp } from '../../context/AppContext';
import { FlaskConical, Building2, Truck, Eye, LogOut, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../types';

export const DemoBanner: React.FC = () => {
  const { user, activeView, demoRole, setDemoPersona, returnToHome, logout } = useApp();

  const roles: { role: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      role: 'researcher',
      label: 'Researcher',
      icon: <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />,
      desc: 'Discover & request instruments',
    },
    {
      role: 'provider',
      label: 'Provider',
      icon: <Building2 className="w-3.5 h-3.5 text-indigo-400" />,
      desc: 'Manage labs & approve bookings',
    },
    {
      role: 'delivery',
      label: 'Delivery',
      icon: <Truck className="w-3.5 h-3.5 text-emerald-400" />,
      desc: 'Precision scientific logistics',
    },
  ];

  return (
    <aside aria-label="Demo role selector" className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-2 px-3 sm:px-6 relative z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="font-semibold text-slate-100 tracking-wide">Interactive Demo Mode</span>
          <span className="hidden sm:inline text-slate-400">· Select role to preview:</span>
        </div>

        {/* Horizontal Role Selector Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {roles.map(({ role, label, icon }) => {
            const isActive = user?.role === role && activeView !== 'home';
            return (
              <button
                key={role}
                onClick={() => setDemoPersona(role)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-sm ring-1 ring-cyan-400 font-semibold'
                    : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                {icon}
                <span>{label}</span>
                {isActive && <CheckCircle2 className="w-3 h-3 text-cyan-200 ml-0.5" />}
              </button>
            );
          })}
        </div>

        {/* Public Homepage & Logout Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={returnToHome}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors ${
              activeView === 'home' ? 'text-cyan-400 font-medium underline underline-offset-4' : ''
            }`}
            title="Open Public Homepage"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Public Homepage</span>
          </button>

          {user && (
            <button
              onClick={logout}
              className="flex items-center gap-1 px-2 py-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
