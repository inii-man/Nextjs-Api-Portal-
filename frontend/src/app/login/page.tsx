'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, Lock, User, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [apiKey, setApiKey] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(apiKey, password);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Username/API Key atau password salah');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden font-sans">
      {/* Dynamic Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[150px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] rounded-full bg-emerald-600/5 blur-[120px]" />
      
      <div className="w-full max-w-lg p-4 relative z-10 animate-entrance">
        <div className="glass-card p-12 sm:p-16 rounded-[3rem] relative shadow-[0_32px_128px_-16px_rgba(0,0,0,1)] border-white/[0.08]">
          <div className="flex flex-col items-center mb-14 text-center">
            <div className="mb-8 p-5 bg-indigo-600 rounded-[2rem] shadow-2xl shadow-indigo-600/40 transform -rotate-12 transition-transform hover:rotate-0 duration-500 cursor-default">
              <ShieldCheck className="text-white" size={48} strokeWidth={2.5} />
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-4 uppercase italic">
              <span className="gradient-text">API Portal</span>
            </h1>
            <div className="flex items-center space-x-3">
              <div className="h-px w-8 bg-white/10" />
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">National Data Nexus</p>
              <div className="h-px w-8 bg-white/10" />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/5 border border-red-500/10 text-red-500/80 p-5 rounded-2xl mb-10 flex items-center space-x-4 text-sm font-bold uppercase tracking-wide">
              <AlertCircle size={20} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-2">Access Token / ID</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-600 group-focus-within:text-indigo-400 transition-colors">
                  <User size={20} strokeWidth={2.5} />
                </div>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 hover:border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all placeholder:text-gray-700"
                  placeholder="admin_portal_id"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-2">Secure Passcode</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-600 group-focus-within:text-indigo-400 transition-colors">
                  <Lock size={20} strokeWidth={2.5} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 hover:border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all placeholder:text-gray-700"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full btn-primary !py-5 !text-xs !font-black tracking-[0.3em] uppercase mt-4">
              Authorize Session
            </button>
          </form>

          <div className="mt-14 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">
              Security clearance provided by <span className="text-gray-400">PDN Infrastructure</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
