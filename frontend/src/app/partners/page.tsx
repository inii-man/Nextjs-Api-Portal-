'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { Plus, User, Key, Activity, MoreHorizontal, Search, X, Check, Trash2 } from 'lucide-react';

interface Partner {
  id: number;
  name: string;
  api_key: string;
  quota_daily: number;
  quota_used: number;
  is_active: boolean;
  role: string;
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', api_key: '', password: '', quota_daily: 100 });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchPartners = () => {
    apiClient.get('/partners/')
      .then(res => setPartners(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchPartners(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.post('/partners/', form);
      setShowModal(false);
      setForm({ name: '', api_key: '', password: '', quota_daily: 100 });
      fetchPartners();
      showToast('✅ Partner registered successfully!');
    } catch (err: any) {
      showToast('❌ ' + (err.response?.data?.detail || 'Failed to create partner'));
    } finally {
      setSaving(false);
    }
  };

  const handleRevoke = async (partner: Partner) => {
    if (!confirm(`Revoke access for ${partner.name}?`)) return;
    try {
      await apiClient.delete(`/partners/${partner.api_key}`).catch(() => {
        // If delete not available, show info
        showToast(`⚠️ Revoke for "${partner.name}" — endpoint not implemented yet.`);
      });
      fetchPartners();
    } catch {
      showToast(`⚠️ Revoke endpoint not available.`);
    }
  };

  const filtered = partners.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.api_key.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-20">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 glass-card px-6 py-4 text-sm font-bold text-white border border-white/10 animate-entrance shadow-2xl">
          {toast}
        </div>
      )}

      {/* Register Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="glass-card w-full max-w-lg p-10 rounded-3xl shadow-2xl animate-entrance">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">Register Partner Node</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Institution Name</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-black/40 border border-white/5 hover:border-white/10 rounded-2xl py-4 px-5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all"
                  placeholder="Dinas Kesehatan Kota" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">API Key / Username</label>
                <input type="text" required value={form.api_key} onChange={e => setForm({ ...form, api_key: e.target.value })}
                  className="w-full bg-black/40 border border-white/5 hover:border-white/10 rounded-2xl py-4 px-5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all font-mono"
                  placeholder="dinas_kesehatan_01" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Initial Password</label>
                <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-black/40 border border-white/5 hover:border-white/10 rounded-2xl py-4 px-5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all"
                  placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Daily Quota</label>
                <input type="number" required min={1} value={form.quota_daily} onChange={e => setForm({ ...form, quota_daily: parseInt(e.target.value) })}
                  className="w-full bg-black/40 border border-white/5 hover:border-white/10 rounded-2xl py-4 px-5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all" />
              </div>
              <div className="flex space-x-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-sm font-black text-gray-400 uppercase tracking-widest transition-all">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary !py-4 uppercase tracking-[0.2em] text-[10px] disabled:opacity-60 flex items-center justify-center space-x-2">
                  <Check size={16} />
                  <span>{saving ? 'Saving...' : 'Register Node'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-entrance">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-1 bg-indigo-500 rounded-full" />
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Institutional Access</span>
          </div>
          <h1 className="text-7xl font-black tracking-tighter leading-none mb-4">
            <span className="gradient-text">Partners</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg max-w-2xl">Management of institutional data partners and cryptographic access keys.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center space-x-3 !py-4 !px-8 !text-[10px] tracking-[0.2em] uppercase !font-black">
          <Plus size={18} strokeWidth={3} />
          <span>Register Node</span>
        </button>
      </div>

      <div className="glass-card overflow-hidden animate-entrance">
        <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="relative w-full max-w-xl group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400 transition-colors" size={20} />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter by institution name or registration ID..." 
              className="w-full bg-black/40 border border-white/5 group-hover:border-white/10 focus:border-indigo-500/50 rounded-2xl py-5 pl-16 pr-6 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-medium tracking-wide"
            />
          </div>
          <button onClick={() => setSearch('')} className="p-4 hover:bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-all duration-300 border border-transparent hover:border-white/5">
            <MoreHorizontal size={24} />
          </button>
        </div>
        
        <div className="overflow-x-auto p-2">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Institution</th>
                <th>Cryptographic Key</th>
                <th className="text-center">Daily Quota</th>
                <th className="text-center">Node Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="!bg-transparent border-none">
                    <div className="flex flex-col items-center justify-center py-32 space-y-6">
                      <div className="p-8 bg-indigo-500/5 rounded-[2.5rem] text-indigo-400 shadow-inner">
                        <User size={64} strokeWidth={1} />
                      </div>
                      <div className="text-center">
                        <div className="text-white font-black text-xl mb-1 uppercase tracking-tighter">{search ? 'No results found' : 'No nodes registered'}</div>
                        <div className="text-gray-600 font-bold uppercase tracking-[0.2em] text-[10px]">{search ? `No partners match "${search}"` : 'Initialize your first institutional connection'}</div>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id} className="group cursor-default">
                    <td>
                      <div className="flex items-center space-x-5">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-black text-xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                           <div className="text-white font-black text-lg group-hover:text-indigo-300 transition-colors">{p.name}</div>
                           <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{p.role === 'admin' ? 'Administrator' : 'Registered Institution'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center space-x-3 text-gray-500">
                        <Key size={16} />
                        <span className="font-mono text-xs tracking-wider bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">{p.api_key}</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="bg-white/5 px-4 py-2 rounded-xl text-xs font-black text-white border border-white/5 shadow-inner">
                        {p.quota_daily.toLocaleString()}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <div className="relative">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute inset-0 opacity-40" />
                          <div className="w-2 h-2 rounded-full bg-emerald-500 relative shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        </div>
                        <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">Active Node</span>
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                        <button onClick={() => showToast(`ℹ️ Config for "${p.name}" — coming soon.`)} className="px-4 py-2 hover:bg-white/10 rounded-xl text-indigo-400 font-black text-[10px] uppercase tracking-widest transition-all">Config</button>
                        <button onClick={() => handleRevoke(p)} className="px-4 py-2 hover:bg-red-500/10 rounded-xl text-red-500/70 hover:text-red-500 font-black text-[10px] uppercase tracking-widest transition-all flex items-center space-x-1">
                          <Trash2 size={12} />
                          <span>Revoke</span>
                        </button>
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
