import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { X, Dna, ShieldCheck, Mail, Lock, Building, ArrowRight, UserCheck } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authInitialTab, authPreselectedRole, closeAuth, loginUser, registerUser } = useApp();

  const [tab, setTab] = useState<'login' | 'signup'>(authInitialTab);
  const [selectedRole, setSelectedRole] = useState<UserRole>(authPreselectedRole);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Sync tab if initial tab changes
  React.useEffect(() => {
    setTab(authInitialTab);
  }, [authInitialTab]);

  React.useEffect(() => {
    setSelectedRole(authPreselectedRole);
  }, [authPreselectedRole]);

  if (!authModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide an email address.');
      return;
    }
    setError(null);
    loginUser(email, selectedRole);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !institution.trim()) {
      setError('Please complete all required fields.');
      return;
    }
    setError(null);
    registerUser({
      name,
      email,
      role: selectedRole,
      institution,
      department,
      phone,
    });
  };

  const handleQuickDemo = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'researcher') {
      setEmail('elena.rostova@biotech-institute.edu');
      setName('Dr. Elena Rostova');
      setInstitution('Institute for Molecular Oncology');
    } else if (role === 'provider') {
      setEmail('m.vance@corelabs.stanford.edu');
      setName('Prof. Marcus Vance');
      setInstitution('Stanford Core Instrumentation Facility');
    } else {
      setEmail('ops@apex-sci-logistics.com');
      setName('Apex Scientific Logistics');
      setInstitution('Apex Certified Precision Transport');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 text-white p-6 relative">
          <button
            onClick={closeAuth}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Dna className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Resource DNA</h2>
              <p className="text-xs text-cyan-200/80">The Building Blocks of Every Breakthrough.</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-2">
            Secure scientific resource access & laboratory verification network.
          </p>

          {/* Tab Selector */}
          <div className="flex items-center gap-2 mt-4 p-1 bg-white/10 rounded-lg">
            <button
              onClick={() => {
                setTab('login');
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                tab === 'login' ? 'bg-cyan-500 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setTab('signup');
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                tab === 'signup' ? 'bg-cyan-500 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Your Platform Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { role: 'researcher', label: 'Researcher', desc: 'Faculty & Students' },
                  { role: 'provider', label: 'Provider', desc: 'Lab & Core Facilities' },
                  { role: 'delivery', label: 'Delivery', desc: 'Transport Partner' },
                ] as const
              ).map((r) => (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => setSelectedRole(r.role)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    selectedRole === r.role
                      ? 'border-cyan-600 bg-cyan-50/70 text-cyan-950 ring-1 ring-cyan-500'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
                  }`}
                >
                  <p className="text-xs font-bold">{r.label}</p>
                  <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      selectedRole === 'researcher'
                        ? 'elena.rostova@biotech-institute.edu'
                        : selectedRole === 'provider'
                        ? 'm.vance@corelabs.stanford.edu'
                        : 'ops@apex-sci-logistics.com'
                    }
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Password</label>
                  <span className="text-[11px] text-cyan-600 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Sign In to Resource DNA</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </button>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-[11px] text-slate-500 mb-2 font-medium">Quick sign-in with verified demo profile:</p>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('researcher')}
                    className="flex-1 py-1 px-2 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 transition-colors"
                  >
                    Researcher
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('provider')}
                    className="flex-1 py-1 px-2 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 transition-colors"
                  >
                    Provider
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('delivery')}
                    className="flex-1 py-1 px-2 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 transition-colors"
                  >
                    Delivery
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name / Principal Investigator
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Julian Croft"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institutional Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institution / Lab
                  </label>
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. MIT, Berkeley"
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Bioengineering"
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Create Verified {selectedRole === 'delivery' ? 'Delivery Partner' : selectedRole === 'provider' ? 'Provider' : 'Researcher'} Account</span>
              </button>
            </form>
          )}

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>End-to-end scientific asset chain-of-custody verification</span>
          </div>
        </div>
      </div>
    </div>
  );
};
