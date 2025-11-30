import { query } from '@/src/lib/db';
import { 
  DollarSign, Box, Truck, Users, ArrowRight, 
  AlertTriangle, CheckCircle2, Clock, Calendar, 
  Activity, BarChart3, MapPin, MoreHorizontal, 
  TrendingUp, TrendingDown 
} from 'lucide-react';
import Link from 'next/link';
import RevenueChart from '@/src/components/dashboard/RevenueChart';

async function getDashboardData() {
  const inventoryRes = await query(`SELECT COALESCE(SUM(price * stock), 0) as total_value, COUNT(*) FILTER (WHERE stock < 10) as low_stock FROM products`);
  const shipmentRes = await query(`SELECT COUNT(*) FILTER (WHERE status = 'pending') as pending, COUNT(*) FILTER (WHERE status = 'delivered') as delivered, COUNT(*) as total FROM shipments`);
  const driverRes = await query(`SELECT COUNT(*) FILTER (WHERE status = 'busy') as busy, COUNT(*) as total FROM drivers`);
  const activityRes = await query(`SELECT tracking_id, status, created_at, destination_address FROM shipments WHERE status != 'pending' ORDER BY created_at DESC LIMIT 5`);

  const inv = inventoryRes.rows[0];
  const ship = shipmentRes.rows[0];
  const driver = driverRes.rows[0];
  const activeDrivers = Number(driver.busy);
  const totalDrivers = Number(driver.total);
  
  return {
    valuation: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(inv.total_value)),
    orders: { pending: Number(ship.pending), total: Number(ship.total), delivered: Number(ship.delivered) },
    fleet: { active: activeDrivers, total: totalDrivers, utilization: totalDrivers > 0 ? Math.round((activeDrivers/totalDrivers)*100) : 0 },
    logs: activityRes.rows,
    alerts: Number(inv.low_stock)
  };
}

function StatCard({ title, value, sub, icon: Icon, color, trend }: any) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };
  
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${colors[color as keyof typeof colors] || colors.blue}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            <TrendingUp size={12} /> {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mt-1">{title}</p>
        <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-100">{sub}</p>
      </div>
    </div>
  );
}

export default async function Dashboard() {
  const data = await getDashboardData();
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
            <Calendar size={14} /> {today}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/inbound" className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Box size={16} /> Input Stock
          </Link>
          <Link href="/fleet" className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg shadow-slate-900/20">
            <Truck size={16} /> Fleet Command
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Aset" 
          value={data.valuation} 
          sub="Valuasi Inventaris Gudang"
          icon={DollarSign} 
          color="indigo" 
          trend="2.4%"
        />
        <StatCard 
          title="Pending Orders" 
          value={data.orders.pending.toString()} 
          sub="Menunggu Armada"
          icon={Box} 
          color="amber"
        />
        <StatCard 
          title="Fleet Active" 
          value={`${data.fleet.active}/${data.fleet.total}`} 
          sub={`${data.fleet.utilization}% Utilization Rate`}
          icon={Activity} 
          color="emerald"
        />
        <StatCard 
          title="Total Delivery" 
          value={data.orders.total.toString()} 
          sub={`${data.orders.delivered} Successful`}
          icon={CheckCircle2} 
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-1 shadow-sm h-[400px]">
          <RevenueChart />
        </div>

        <div className="space-y-6">
          
          <div className="bg-slate-900 rounded-xl p-6 text-white relative overflow-hidden shadow-lg">
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                   <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span> AI System Online
                </div>
                <h3 className="font-bold text-lg mb-2">Intelligent Dispatcher</h3>
                <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                   {data.orders.pending > 0 
                     ? `${data.orders.pending} pesanan belum diproses. Algoritma menyarankan optimasi rute sekarang.` 
                     : "Semua operasional berjalan lancar. Tidak ada antrian mendesak."}
                </p>
                <Link href="/fleet" className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-white/10">
                   Buka Kontrol AI <ArrowRight size={14} />
                </Link>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/30 rounded-full blur-[50px]"></div>
             <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-600/30 rounded-full blur-[40px]"></div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
             <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-sm text-slate-700 flex items-center gap-2">
                   <Clock size={14} /> Log Aktivitas
                </h3>
             </div>
             <div className="divide-y divide-slate-50">
                {data.logs.map((log: any, i: number) => (
                   <div key={i} className="p-4 flex gap-3 items-start hover:bg-slate-50/50 transition-colors">
                      <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${log.status === 'delivered' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                      <div className="flex-1 min-w-0">
                         <p className="text-xs font-bold text-slate-800">#{log.tracking_id}</p>
                         <p className="text-[11px] text-slate-500 truncate">{log.destination_address}</p>
                         <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{log.status.replace('_', ' ')}</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}