'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { Activity, BarChart3, Users, Wifi, AlertCircle } from 'lucide-react';

export default function TrafficPage() {
  const [traffic, setTraffic] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get('/admin/traffic')
      .then(res => setTraffic(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-16 pb-20">
      <div className="animate-entrance">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-1 bg-indigo-500 rounded-full" />
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Utilization metrics</span>
        </div>
        <h1 className="text-7xl font-black tracking-tighter leading-none mb-4">
          <span className="gradient-text">Traffic</span>
          <span className="text-white/20 ml-4 font-normal italic">& Utilization</span>
        </h1>
        <p className="text-gray-500 font-medium text-lg max-w-2xl">Real-time orchestrated resource monitoring and agency cryptographic utilization streams.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-entrance">
        {traffic.map(t => (
          <div key={t.partner_name} className="glass-card p-10 group hover:scale-[1.02] transition-all duration-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
               <BarChart3 size={100} strokeWidth={1} />
            </div>

            <div className="flex items-center justify-between mb-10">
              <div className="p-4 bg-indigo-600/10 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-700 text-indigo-400 shadow-xl shadow-indigo-600/10 border border-indigo-600/20 group-hover:rotate-6">
                <BarChart3 size={24} strokeWidth={2.5} />
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute inset-0 opacity-40" />
                   <div className="w-2 h-2 rounded-full bg-emerald-500 relative" />
                </div>
                <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">Live node</span>
              </div>
            </div>

            <h2 className="text-3xl font-black mb-1 text-white group-hover:text-indigo-300 transition-colors uppercase italic tracking-tighter">{t.partner_name}</h2>
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] mb-10">Integrated Institution</p>

            <div className="space-y-8 relative z-10">
              <div>
                <div className="flex justify-between items-end mb-4">
                  <div className="flex items-center space-x-3 text-gray-500 group-hover:text-gray-300 transition-colors">
                    <Wifi size={16} strokeWidth={2.5} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Allocation usage</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-black text-2xl tracking-tighter">{t.quota_used.toLocaleString()}</span>
                    <span className="text-gray-600 text-[10px] font-black uppercase ml-2 tracking-widest">/ {t.quota_daily.toLocaleString()}</span>
                  </div>
                </div>
                <div className="w-full bg-black/40 h-4 rounded-full overflow-hidden border border-white/5 p-1 group-hover:border-white/10 transition-colors">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden shadow-[0_0_15px_rgba(99,102,241,0.3)] ${
                      t.usage_percentage > 90 
                        ? 'bg-gradient-to-r from-red-600 to-orange-500' 
                        : 'bg-gradient-to-r from-indigo-600 via-violet-500 to-emerald-400'
                    }`}
                    style={{ width: `${t.usage_percentage}%` }}
                  >
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-white/10" />
                  </div>
                </div>
                <div className="mt-4 flex justify-between text-[9px] font-black tracking-widest uppercase">
                  <span className={t.usage_percentage > 90 ? 'text-red-500' : 'text-indigo-400'}>{t.usage_percentage}% operational capacity</span>
                  <span className="text-gray-600">{(t.quota_daily - t.quota_used).toLocaleString()} slots available</span>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex items-center justify-between group-hover:border-white/10 transition-colors">
                <div className="flex items-center space-x-3">
                  <Activity size={16} className="text-gray-600" />
                  <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Protocol State</span>
                </div>
                <span className="text-emerald-500 text-[10px] font-black px-4 py-1.5 bg-emerald-500/5 rounded-xl border border-emerald-500/10 uppercase tracking-[0.2em] shadow-inner">Optimized</span>
              </div>
            </div>
          </div>
        ))}

        {traffic.length === 0 && (
          <div className="lg:col-span-3 py-40 text-center glass-card border-dashed">
            <div className="flex flex-col items-center space-y-6">
              <div className="p-10 bg-white/5 rounded-[3rem] text-gray-800 shadow-inner">
                <AlertCircle size={64} strokeWidth={1} />
              </div>
              <div>
                 <div className="text-white font-black text-2xl uppercase tracking-tighter mb-1">No stream data</div>
                 <p className="text-gray-600 font-bold uppercase tracking-[0.2em] text-[10px]">Utilization metrics are currently offline or unavailable</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
