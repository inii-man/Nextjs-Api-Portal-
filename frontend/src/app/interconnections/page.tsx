'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { Send, Globe, Calendar, CheckCircle, Clock, X, Check } from 'lucide-react';

export default function InterconnectionsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ requested_resource: '', purpose: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchRequests = () => {
    apiClient.get('/interconnections/')
      .then(res => setRequests(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.post('/interconnections/', form);
      setShowModal(false);
      setForm({ requested_resource: '', purpose: '' });
      fetchRequests();
      showToast('✅ Interlink request submitted!');
    } catch (err: any) {
      showToast('❌ ' + (err.response?.data?.detail || 'Failed to submit request'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {toast && (
        <div className="fixed top-6 right-6 z-50 glass-card px-6 py-4 text-sm font-bold text-white border border-white/10 animate-entrance shadow-2xl">{toast}</div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="glass-card w-full max-w-lg p-10 rounded-3xl shadow-2xl animate-entrance">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">New Interlink Request</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Target Resource</label>
                <input type="text" required value={form.requested_resource} onChange={e => setForm({ ...form, requested_resource: e.target.value })}
                  className="w-full bg-black/40 border border-white/5 hover:border-white/10 rounded-2xl py-4 px-5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all"
                  placeholder="e.g. DATA_KEPENDUDUKAN" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Purpose / Justification</label>
                <textarea required value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })}
                  rows={3}
                  className="w-full bg-black/40 border border-white/5 hover:border-white/10 rounded-2xl py-4 px-5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all resize-none"
                  placeholder="Describe the purpose of this data access request..." />
              </div>
              <div className="flex space-x-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-sm font-black text-gray-400 uppercase tracking-widest transition-all">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-4 bg-violet-600 hover:bg-violet-500 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all disabled:opacity-60 flex items-center justify-center space-x-2">
                  <Check size={16} />
                  <span>{saving ? 'Submitting...' : 'Submit Request'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-entrance">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-1 bg-violet-500 rounded-full" />
            <span className="text-[10px] font-black text-violet-400 uppercase tracking-[0.3em]">Data Interlink</span>
          </div>
          <h1 className="text-7xl font-black tracking-tighter leading-none mb-4">
            <span className="gradient-text !from-white !to-violet-400">Requests</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg max-w-2xl">Management of cross-agency data access requests and cryptographic link status orchestration.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center space-x-3 !py-4 !px-8 !text-[10px] tracking-[0.2em] uppercase !font-black !bg-violet-600 hover:!bg-violet-500 !shadow-violet-600/20 border-violet-400/20">
          <Send size={18} strokeWidth={3} />
          <span>New Interlink</span>
        </button>
      </div>

      <div className="glass-card overflow-hidden animate-entrance">
        <div className="overflow-x-auto p-2">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Resource Target</th>
                <th>Request Purpose</th>
                <th>Authorization Date</th>
                <th className="text-center">Link Status</th>
                <th className="text-right">Orchestration</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="!bg-transparent border-none">
                    <div className="flex flex-col items-center justify-center py-32 space-y-6">
                      <div className="p-8 bg-violet-500/5 rounded-[2.5rem] text-violet-400/30 shadow-inner">
                        <Globe size={64} strokeWidth={1} />
                      </div>
                      <div className="text-center">
                        <div className="text-white font-black text-xl mb-1 uppercase tracking-tighter">No active requests</div>
                        <div className="text-gray-600 font-bold uppercase tracking-[0.2em] text-[10px]">Click "New Interlink" to submit your first access request</div>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                requests.map(r => (
                  <tr key={r.id} className="group cursor-default">
                    <td>
                      <div className="flex items-center space-x-5">
                        <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 font-black text-xl border border-violet-500/20 group-hover:scale-110 transition-transform duration-500">
                          {r.requested_resource.charAt(0)}
                        </div>
                        <div>
                           <div className="text-white font-black text-lg group-hover:text-violet-300 transition-colors">{r.requested_resource}</div>
                           <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-0.5">Target Resource</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-gray-400 text-sm italic group-hover:text-gray-200 transition-colors font-medium border-l-2 border-white/5 pl-4 group-hover:border-violet-500/30">
                        {r.purpose || '—'}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center space-x-3 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                        <Calendar size={14} />
                        <span>{new Date(r.requested_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className={`inline-flex items-center space-x-3 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-[0.15em] ${
                        r.status === 'APPROVED' 
                          ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10' 
                          : 'bg-indigo-500/5 text-indigo-400 border-indigo-500/10'
                      }`}>
                        {r.status === 'APPROVED' ? <CheckCircle size={14} /> : <Clock size={14} />}
                        <span>{r.status}</span>
                      </div>
                    </td>
                    <td className="text-right">
                      <button onClick={() => showToast(`ℹ️ Detail for request #${r.id} — coming soon.`)} className="p-4 hover:bg-white/5 rounded-2xl text-gray-600 hover:text-white transition-all duration-300 border border-transparent hover:border-white/5">
                        ···
                      </button>
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
