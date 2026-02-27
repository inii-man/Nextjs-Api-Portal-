'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Repeat, Camera, FileText, BarChart, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Sidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Partners', path: '/partners', icon: Users },
    { name: 'Interconnections', path: '/interconnections', icon: Repeat },
    { name: 'Snapshot', path: '/snapshot', icon: Camera },
    { name: 'Audit Logs', path: '/admin/audit', icon: FileText },
    { name: 'Traffic', path: '/admin/traffic', icon: BarChart },
  ];

  return (
    <div className="w-72 glass-panel h-screen p-8 flex flex-col z-50">
      <div className="flex items-center space-x-4 mb-12 px-2 group cursor-pointer">
        <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/20 group-hover:scale-110 transition-transform duration-500">
          <ShieldCheck className="text-white" size={24} />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-tight text-white uppercase leading-none">API Portal</span>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Management</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center space-x-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "bg-white/[0.05] text-white shadow-lg border border-white/10" 
                  : "text-gray-400 hover:bg-white/[0.03] hover:text-white"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full" />
              )}
              <Icon size={20} className={cn("transition-all duration-500 group-hover:scale-110", isActive ? "text-indigo-400" : "text-gray-500 group-hover:text-indigo-400")} />
              <span className="font-bold text-sm tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-8 mt-4 border-t border-white/5">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-5 py-4 text-gray-500 hover:bg-red-500/10 hover:text-red-400 rounded-2xl transition-all duration-300 group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm tracking-wide uppercase">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
