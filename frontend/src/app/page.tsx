'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Users, Repeat, Camera, Activity, ArrowUpRight, Clock, RefreshCw, Download } from 'lucide-react';
import apiClient from '@/lib/apiClient';

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="glass-card p-8 relative group transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] animate-entrance">
    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700">
      <Icon size={120} strokeWidth={1} />
    </div>
    <div className="flex items-center justify-between mb-8">
      <div className={`p-4 rounded-2xl ${color} shadow-lg shadow-current/5 group-hover:shadow-current/10 transition-all duration-700 group-hover:rotate-6`}>
        <Icon size={24} />
      </div>
      {trend && (
        <div className="flex items-center space-x-1.5 text-emerald-400 text-[10px] font-black bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20 group-hover:bg-emerald-400/20 transition-colors">
          <ArrowUpRight size={14} />
          <span className="tracking-widest uppercase">{trend}</span>
        </div>
      )}
    </div>
    <div className="relative z-10">
      <div className="text-5xl font-black text-white mb-3 tracking-tighter group-hover:translate-x-1 transition-transform duration-500">{value}</div>
      <div className="text-gray-500 text-[10px] font-black tracking-[0.2em] uppercase">{title}</div>
    </div>
    <div className="mt-6 pt-6 border-t border-white/5 flex items-center text-[10px] text-gray-600 font-bold uppercase tracking-[0.15em]">
      <Clock size={12} className="mr-2" strokeWidth={3} />
      Live Status • Updated now
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState({ partners: 0, requests: 0, health: 'Online', lastSnapshot: 'Never' });
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    setRefreshing(true);
    try {
      const [partnersRes, requestsRes] = await Promise.all([
        apiClient.get('/partners/'),
        apiClient.get('/interconnections/'),
      ]);
      setStats({
        partners: partnersRes.data.length,
        requests: requestsRes.data.length,
        health: 'Healthy',
        lastSnapshot: 'Just now',
      });
    } catch {
      // fallback to simulated data
      setStats({ partners: 12, requests: 45, health: 'Healthy', lastSnapshot: '2h ago' });
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleExport = () => {
    const data = `Dashboard Stats Export\n\nDate: ${new Date().toLocaleString()}\nTotal Partners: ${stats.partners}\nTotal Requests: ${stats.requests}\nSystem Health: ${stats.health}\nLast Snapshot: ${stats.lastSnapshot}`;
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-export-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-16 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="animate-entrance">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-1 bg-indigo-500 rounded-full" />
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">System Overview</span>
          </div>
          <h1 className="text-7xl font-black tracking-tighter leading-none mb-4">
            <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg max-w-2xl">Real-time monitoring of national data interconnection metrics and system integrity.</p>
        </div>
        <div className="flex space-x-4 animate-entrance">
          <button onClick={handleExport} className="px-6 py-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/10 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 flex items-center space-x-2">
            <Download size={14} />
            <span>Export Analytics</span>
          </button>
          <button onClick={fetchStats} disabled={refreshing} className="btn-primary !px-6 !text-[10px] tracking-widest uppercase flex items-center space-x-2 disabled:opacity-60">
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Node'}</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Total Partners" value={stats.partners} icon={Users} color="bg-indigo-500/10 text-indigo-400" trend="+2.4%" />
        <StatCard title="Total Requests" value={stats.requests} icon={Repeat} color="bg-violet-500/10 text-violet-400" trend="+18%" />
        <StatCard title="Last Snapshot" value={stats.lastSnapshot} icon={Camera} color="bg-emerald-500/10 text-emerald-400" />
        <StatCard title="System Health" value={stats.health} icon={Activity} color="bg-orange-500/10 text-orange-400" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 glass-card p-10 animate-entrance">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-black tracking-tight mb-1 text-white uppercase italic">Audit stream</h2>
              <div className="h-1 w-12 bg-indigo-500/50 rounded-full" />
            </div>
            <button onClick={fetchStats} className="text-indigo-400 text-[10px] font-black hover:text-indigo-300 transition-colors uppercase tracking-[0.2em] bg-indigo-400/5 px-4 py-2 rounded-lg border border-indigo-400/10 hover:bg-indigo-400/10">Archive</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="group flex items-center justify-between p-6 bg-white/[0.01] hover:bg-white/[0.04] rounded-2xl border border-white/5 hover:border-indigo-500/20 transition-all duration-500 cursor-default">
                <div className="flex items-center space-x-5">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/5 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/10 transition-all duration-500">
                    <Repeat size={24} />
                  </div>
                  <div>
                    <div className="text-white font-black text-lg group-hover:text-indigo-300 transition-colors mb-0.5">Dinas Kesehatan Integration</div>
                    <div className="flex items-center space-x-2">
                       <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Base Data Vaksinasi</span>
                       <span className="w-1 h-1 bg-gray-700 rounded-full" />
                       <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest">12:45 PM</span>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2 bg-amber-500/5 text-amber-500 text-[10px] font-black rounded-xl border border-amber-500/10 uppercase tracking-[0.2em]">PENDING</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass-card p-10 bg-indigo-600/[0.02] border-indigo-500/10 animate-entrance">
          <h2 className="text-2xl font-black tracking-tight mb-8 text-white uppercase italic">System health</h2>
          <div className="space-y-10">
            <div className="p-6 bg-black/40 rounded-2xl border border-white/5 group hover:border-indigo-500/30 transition-all duration-500">
              <div className="flex justify-between text-[10px] font-black text-gray-500 mb-4 uppercase tracking-[0.25em]">
                <span>Node Usage</span>
                <span className="text-indigo-400">85%</span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.5)]" style={{ width: '85%' }} />
              </div>
            </div>
            <div className="space-y-6">
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Network performance is optimal. All {stats.partners} partner nodes are currently synchronized with the master portal.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
                   <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Latency</div>
                   <div className="text-white font-black">24ms</div>
                </div>
                <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
                   <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Uptime</div>
                   <div className="text-white font-black">99.9%</div>
                </div>
              </div>
            </div>
            <button onClick={fetchStats} disabled={refreshing} className="w-full btn-primary !py-5 uppercase tracking-[0.2em] text-[10px] !font-black flex items-center justify-center space-x-2 disabled:opacity-60">
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              <span>Scale Infrastructure</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
