'use client';

import { useState } from 'react';
import { Settings, Bell, Shield, Cloud, Save, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { signOut } from 'next-auth/react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Pengaturan Disimpan", { description: "Perubahan sistem telah diterapkan." });
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Configuration</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola preferensi global dan koneksi API.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={16} /> {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Shield size={18} className="text-blue-600" /> Security & Session
        </h3>
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <p className="text-sm font-bold text-slate-700">Admin Session</p>
            <p className="text-xs text-slate-500">Anda sedang login sebagai Super Admin.</p>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-50 transition-colors flex items-center gap-2"
          >
            <LogOut size={14} /> Force Logout
          </button>
        </div>
      </section>

      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Bell size={18} className="text-amber-500" /> Alert Preferences
        </h3>
        <div className="space-y-4">
          <ToggleItem label="Low Stock Alerts" desc="Notifikasi saat stok < 10 unit" defaultChecked />
          <ToggleItem label="Real-time Driver Updates" desc="Push notifikasi pergerakan armada" defaultChecked />
          <ToggleItem label="Daily Email Report" desc="Kirim ringkasan PDF jam 09:00" />
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Cloud size={18} className="text-indigo-500" /> API Connections
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          <ConnectionItem name="PostgreSQL Database" status="Connected" latency="24ms" />
          <ConnectionItem name="Google Gemini AI" status="Active" latency="150ms" />
          <ConnectionItem name="Pusher Realtime" status="Live" latency="45ms" />
        </div>
      </section>
    </div>
  );
}

function ToggleItem({ label, desc, defaultChecked }: { label: string, desc: string, defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked || false);
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <button 
        onClick={() => setChecked(!checked)}
        className={`w-11 h-6 rounded-full relative transition-colors ${checked ? 'bg-blue-600' : 'bg-slate-200'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${checked ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );
}

function ConnectionItem({ name, status, latency }: any) {
  return (
    <div className="p-4 flex items-center justify-between px-6 hover:bg-slate-50 transition-colors">
      <div>
        <p className="text-sm font-medium text-slate-900">{name}</p>
        <p className="text-xs text-slate-400 font-mono">Latency: {latency}</p>
      </div>
      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 uppercase tracking-wide">
        {status}
      </span>
    </div>
  );
}