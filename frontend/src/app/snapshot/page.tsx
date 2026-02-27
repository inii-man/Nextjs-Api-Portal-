'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { Play, Camera, Layers, Hash, Calendar, CheckCircle, Database, RefreshCw } from 'lucide-react';

export default function SnapshotPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = () => {
    apiClient.get('/snapshot/jobs')
      .then(res => setJobs(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchJobs(); }, []);

  const runSnapshot = async () => {
    setLoading(true);
    try {
      const res = await apiClient.post('/snapshot/run?resource=DEMO_DATA');
      // Poll for job completion after 2 seconds
      setTimeout(fetchJobs, 2000);
    } catch (err: any) {
      alert('Gagal menjalankan snapshot: ' + (err.response?.data?.detail || 'Kuota mungkin habis'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-entrance">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-1 bg-emerald-500 rounded-full" />
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Resource Versioning</span>
          </div>
          <h1 className="text-7xl font-black tracking-tighter leading-none mb-4">
            <span className="gradient-text !from-white !to-emerald-400">Snapshot</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg max-w-2xl">Capture and version point-in-time state of interconnected national data resources.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={fetchJobs} className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/5 text-white font-black text-[10px] tracking-[0.2em] uppercase rounded-xl transition-all flex items-center space-x-2">
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
          <button
            onClick={runSnapshot}
            disabled={loading}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] tracking-[0.2em] uppercase rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center space-x-3 border border-emerald-400/20"
          >
            <Play size={16} fill="currentColor" />
            <span>{loading ? 'Processing...' : 'Execute capture'}</span>
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden animate-entrance">
        <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
              <Layers size={24} />
            </div>
            <div>
              <span className="text-lg font-black uppercase tracking-tight text-white leading-none">Job History</span>
              <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1">Versioning logs</div>
            </div>
          </div>
          <div className="text-[10px] font-black text-emerald-400/60 uppercase tracking-[0.2em] bg-emerald-400/5 px-4 py-2 rounded-lg border border-emerald-400/10">
            {jobs.length} job{jobs.length !== 1 ? 's' : ''} recorded
          </div>
        </div>
        
        <div className="overflow-x-auto p-2">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Resource Node</th>
                <th className="text-center">Version Tag</th>
                <th>Captured At</th>
                <th className="text-right">Integrity Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="!bg-transparent border-none">
                    <div className="flex flex-col items-center justify-center py-32 space-y-6">
                      <div className="p-8 bg-emerald-500/5 rounded-[2.5rem] text-emerald-400/30 shadow-inner">
                        <Database size={64} strokeWidth={1} />
                      </div>
                      <div className="text-center">
                        <div className="text-white font-black text-xl mb-1 uppercase tracking-tighter">No snapshots found</div>
                        <div className="text-gray-600 font-bold uppercase tracking-[0.2em] text-[10px]">Click "Execute Capture" to begin versioning</div>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                jobs.map(j => (
                  <tr key={j.id} className="group cursor-default">
                    <td>
                      <div className="flex items-center space-x-5">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-500 border border-emerald-500/20">
                          <Database size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                           <div className="text-white font-black text-lg group-hover:text-emerald-300 transition-colors">{j.resource}</div>
                           <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-0.5">National Resource Source</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="inline-flex items-center space-x-2 px-4 py-2 bg-black/40 rounded-xl border border-white/5 text-[10px] font-black group-hover:border-emerald-500/30 transition-colors tracking-widest uppercase">
                        <Hash size={14} className="text-emerald-500/50" />
                        <span className="text-gray-300">{j.version || 'v1.0'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center space-x-3 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                        <Calendar size={14} />
                        <span>{j.finished_at ? new Date(j.finished_at).toLocaleString() : new Date(j.started_at).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="text-right">
                      <div className={`inline-flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl border ${
                        j.status === 'COMPLETED' 
                          ? 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10'
                          : 'text-amber-400 bg-amber-400/5 border-amber-400/10'
                      }`}>
                        <CheckCircle size={14} />
                        <span>{j.status}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
