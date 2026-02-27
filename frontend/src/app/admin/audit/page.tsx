'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { Shield, Clock, User, Globe, AlertTriangle, FileText, CheckCircle, RefreshCw, Download } from 'lucide-react';

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLogs = async () => {
    setRefreshing(true);
    try {
      const res = await apiClient.get('/admin/audit-logs');
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleExport = () => {
    const headers = 'ID,Path,Method,Partner ID,IP,Status Code,Detail,Created At';
    const rows = logs.map(l =>
      `${l.id},${l.path},${l.method},${l.partner_id || 'SYSTEM'},${l.ip},${l.status_code},"${l.detail || ''}",${l.created_at}`
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-export-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-entrance">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-1 bg-indigo-500 rounded-full" />
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Security Operations</span>
          </div>
          <h1 className="text-7xl font-black tracking-tighter leading-none mb-4">
            <span className="gradient-text">Audit</span>
            <span className="text-white/20 ml-4">Logs</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg max-w-2xl">Comprehensive transparency of national system operations and agency data interaction streams.</p>
        </div>
        <div className="flex space-x-4">
          <button onClick={fetchLogs} disabled={refreshing} className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all flex items-center space-x-2 disabled:opacity-60">
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button onClick={handleExport} disabled={logs.length === 0} className="px-6 py-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/10 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 flex items-center space-x-2 disabled:opacity-40">
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden animate-entrance">
        <div className="overflow-x-auto p-2">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Activity Stream</th>
                <th>Method</th>
                <th>Agency Agent</th>
                <th>Network ID</th>
                <th className="text-center">Protocol Status</th>
                <th className="text-right">Observed At</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="!bg-transparent border-none">
                    <div className="flex flex-col items-center justify-center py-32 space-y-6">
                      <div className="p-8 bg-white/5 rounded-[2.5rem] text-gray-700 shadow-inner">
                        <FileText size={64} strokeWidth={1} />
                      </div>
                      <div className="text-center">
                        <div className="text-white font-black text-xl mb-1 uppercase tracking-tighter">No events detected</div>
                        <div className="text-gray-600 font-bold uppercase tracking-[0.2em] text-[10px]">The audit stream is currently synchronized and idle</div>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map(log => (
                  <tr key={log.id} className="group cursor-default">
                    <td>
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-gray-500 group-hover:text-indigo-400 group-hover:bg-indigo-400/10 transition-all duration-500 border border-white/5 group-hover:border-indigo-500/30">
                          <Shield size={18} />
                        </div>
                        <div>
                           <span className="text-white font-black group-hover:text-indigo-300 transition-colors uppercase tracking-tight text-sm">{log.path}</span>
                           <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-0.5">System Access</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-[10px] font-black bg-indigo-500/10 text-indigo-400 px-3 py-1.5 rounded-lg border border-indigo-500/20 uppercase tracking-widest">
                        {log.method}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center space-x-3 text-gray-400 group-hover:text-white transition-colors">
                        <User size={14} className="text-gray-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.15em]">{log.partner_id || 'SYSTEM_CORE'}</span>
                      </div>
                    </td>
                    <td className="font-mono text-[10px] text-gray-500 group-hover:text-indigo-200/50 transition-colors">
                      <div className="flex items-center space-x-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 w-fit">
                        <Globe size={12} className="opacity-50" />
                        <span>{log.ip}</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <span className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${
                        log.status_code < 400 
                          ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10' 
                          : 'bg-red-500/5 text-red-400 border-red-500/10'
                      }`}>
                        {log.status_code < 400 ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                        <span>{log.status_code}</span>
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end space-x-2 text-gray-600 group-hover:text-gray-400 text-[10px] font-black uppercase tracking-widest transition-colors">
                        <Clock size={12} />
                        <span>{new Date(log.created_at).toLocaleString()}</span>
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
