import { Settings, Shield, Database, Bell, User } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Configuration</h1>
        <p className="text-slate-500 text-sm mt-1">Manage global preferences and API connections.</p>
      </div>

      {/* Profile Section */}
      <section className="card-basic p-6 bg-white">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
            <User size={32} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900">Admin User</h3>
            <p className="text-sm text-slate-500">Super Administrator Access</p>
            <div className="mt-3 flex gap-2">
              <button className="text-xs px-3 py-1.5 border border-slate-200 rounded font-medium text-slate-600 hover:bg-slate-50">Change Avatar</button>
              <button className="text-xs px-3 py-1.5 border border-rose-200 text-rose-600 rounded font-medium hover:bg-rose-50">Reset Password</button>
            </div>
          </div>
        </div>
      </section>

      {/* API Connections */}
      <section className="card-basic overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <Database size={16} className="text-blue-500" /> Connected Services
          </h3>
          <span className="text-[10px] font-mono bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">All Systems Operational</span>
        </div>
        <div className="divide-y divide-slate-100">
          <ConnectionItem name="PostgreSQL Database" status="Connected" latency="24ms" />
          <ConnectionItem name="Google Gemini AI" status="Active" latency="150ms" />
          <ConnectionItem name="Pusher Realtime" status="Live" latency="45ms" />
          <ConnectionItem name="Cohere Text Gen" status="Standby" latency="-" />
        </div>
      </section>

      {/* Notification Prefs */}
      <section className="card-basic p-6 bg-white">
        <h3 className="font-bold text-sm text-slate-800 mb-4 flex items-center gap-2">
          <Bell size={16} className="text-amber-500" /> Alert Preferences
        </h3>
        <div className="space-y-3">
          <ToggleItem label="Low Stock Alerts" desc="Notify when item count drops below 10 units" />
          <ToggleItem label="Driver Status Change" desc="Real-time push notification on delivery updates" />
          <ToggleItem label="Daily Report Email" desc="Send summary PDF at 09:00 AM" />
        </div>
      </section>
    </div>
  );
}

function ConnectionItem({ name, status, latency }: any) {
  return (
    <div className="p-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors">
      <div>
        <p className="text-sm font-medium text-slate-900">{name}</p>
        <p className="text-xs text-slate-400">Latency: {latency}</p>
      </div>
      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
        {status}
      </span>
    </div>
  );
}

function ToggleItem({ label, desc }: any) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <div className="w-10 h-6 bg-slate-200 rounded-full relative cursor-pointer hover:bg-slate-300 transition-colors">
        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
      </div>
    </div>
  );
}