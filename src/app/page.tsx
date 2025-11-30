import { ArrowUpRight, ArrowDownRight, DollarSign, Box, Truck, Users } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Executive Overview</h1>
        <p className="text-slate-500 text-sm mt-1">Daily operational metrics and performance summary.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value="Rp 1.25M" trend="+12.5%" trendUp={true} icon={DollarSign} />
        <StatCard title="Pending Orders" value="24" trend="-2.1%" trendUp={false} icon={Box} />
        <StatCard title="Active Fleet" value="18/20" trend="90% Util" trendUp={true} icon={Truck} />
        <StatCard title="Staff On Duty" value="12" trend="Normal" trendUp={true} icon={Users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 card-basic p-6">
          <h3 className="text-base font-bold text-slate-800 mb-4">Live Operations Feed</h3>
          <div className="space-y-0 divide-y divide-slate-100">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="py-3 flex items-center justify-between hover:bg-slate-50 transition-colors px-2 -mx-2 rounded-md">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Order #ORD-2024-{i}02 processed</p>
                    <p className="text-xs text-slate-500">Warehouse A • {i * 5} mins ago</p>
                  </div>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  {i % 2 === 0 ? 'Dispatched' : 'Packed'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-basic p-6">
          <h3 className="text-base font-bold text-slate-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-all shadow-sm text-left flex justify-between items-center group">
              Create Outbound
              <ArrowUpRight size={16} className="opacity-70 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-md transition-all text-left flex justify-between items-center">
              Scan Incoming Stock
              <Box size={16} className="text-slate-400" />
            </button>
            <button className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-md transition-all text-left flex justify-between items-center">
              Assign Driver Manual
              <Truck size={16} className="text-slate-400" />
            </button>
          </div>
          
          <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-lg">
            <h4 className="text-xs font-bold text-amber-800 uppercase mb-1">System Alert</h4>
            <p className="text-xs text-amber-700 leading-relaxed">
              3 Drivers are currently offline while orders are piling up in Zone B.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, trend, trendUp, icon: Icon }: any) {
  return (
    <div className="card-basic p-5 hover:border-blue-300 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-md text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
          <Icon size={20} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'} px-2 py-0.5 rounded-full`}>
          {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">{title}</p>
    </div>
  );
}