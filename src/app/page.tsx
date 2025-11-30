import { query } from '@/src/lib/db';
import { 
  DollarSign, Box, Truck, Activity, 
  CheckCircle2, Clock, Calendar, 
  ArrowRight, TrendingUp, AlertTriangle 
} from 'lucide-react';
import Link from 'next/link';
import RevenueChart from '@/src/components/dashboard/RevenueChart';

interface DashboardMetrics {
  valuation: string;
  orders: {
    pending: number;
    delivered: number;
    total: number;
  };
  fleet: {
    active: number;
    total: number;
    utilization: number;
  };
  logs: {
    tracking_id: string;
    status: string;
    destination_address: string;
    updated_at: Date;
  }[];
  alerts: number;
}

async function getDashboardData(): Promise<DashboardMetrics> {
  try {
    const [inventoryRes, shipmentRes, driverRes, activityRes] = await Promise.all([
      query(`
        SELECT 
          COALESCE(SUM(price * stock), 0) as total_value, 
          COUNT(*) FILTER (WHERE stock < 10) as low_stock 
        FROM products
      `),
      
      query(`
        SELECT 
          COUNT(*) FILTER (WHERE status = 'pending') as pending, 
          COUNT(*) FILTER (WHERE status = 'delivered') as delivered, 
          COUNT(*) as total 
        FROM shipments
      `),

      query(`
        SELECT 
          COUNT(*) FILTER (WHERE status = 'busy') as busy, 
          COUNT(*) as total 
        FROM drivers
      `),

      query(`
        SELECT tracking_id, status, destination_address, updated_at 
        FROM shipments 
        WHERE status != 'pending' 
        ORDER BY updated_at DESC 
        LIMIT 5
      `)
    ]);

    const inv = inventoryRes.rows[0];
    const ship = shipmentRes.rows[0];
    const driver = driverRes.rows[0];

    const activeDrivers = Number(driver.busy);
    const totalDrivers = Number(driver.total);

    return {
      valuation: new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR', 
        maximumFractionDigits: 0 
      }).format(Number(inv.total_value)),
      
      orders: { 
        pending: Number(ship.pending), 
        total: Number(ship.total), 
        delivered: Number(ship.delivered) 
      },
      
      fleet: { 
        active: activeDrivers, 
        total: totalDrivers, 
        utilization: totalDrivers > 0 ? Math.round((activeDrivers / totalDrivers) * 100) : 0 
      },
      
      logs: activityRes.rows,
      alerts: Number(inv.low_stock)
    };
  } catch (error) {
    console.error("Dashboard Data Error:", error);
    return {
      valuation: "Rp 0",
      orders: { pending: 0, total: 0, delivered: 0 },
      fleet: { active: 0, total: 0, utilization: 0 },
      logs: [],
      alerts: 0
    };
  }
}

function StatCard({ title, value, sub, icon: Icon, color, trend }: any) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
  };
  
  const colorClass = colors[color as keyof typeof colors] || colors.blue;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${colorClass} transition-transform group-hover:scale-110`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
            <TrendingUp size={12} /> {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mt-1">{title}</p>
        <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100 flex items-center gap-1">
           {sub}
        </p>
      </div>
    </div>
  );
}


export default async function Dashboard() {
  const data = await getDashboardData();
  const today = new Date().toLocaleDateString('id-ID', { 
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
  });

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Command Center</h1>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
            <Calendar size={14} /> {today}
          </p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/inbound" 
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Box size={16} /> Input Stock
          </Link>
          <Link 
            href="/fleet" 
            className="px-4 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg shadow-slate-900/20"
          >
            <Truck size={16} /> Fleet Map
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Valuasi Aset" 
          value={data.valuation} 
          sub="Berdasarkan stok gudang real-time"
          icon={DollarSign} 
          color="indigo" 
          trend="Live"
        />
        <StatCard 
          title="Pending Orders" 
          value={data.orders.pending.toString()} 
          sub="Menunggu assign driver"
          icon={Box} 
          color={data.orders.pending > 0 ? "amber" : "blue"}
        />
        <StatCard 
          title="Armada Aktif" 
          value={`${data.fleet.active}/${data.fleet.total}`} 
          sub={`${data.fleet.utilization}% Utilization Rate`}
          icon={Activity} 
          color="emerald"
        />
        <StatCard 
          title="Total Pengiriman" 
          value={data.orders.total.toString()} 
          sub={`${data.orders.delivered} Selesai / ${data.orders.total} Total`}
          icon={CheckCircle2} 
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden h-[400px]">
          <RevenueChart />
        </div>

        <div className="space-y-6">
          
          <div className="bg-slate-900 rounded-xl p-6 text-white relative overflow-hidden shadow-lg group">
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                   <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                   </span>
                   AI System Online
                </div>
                <h3 className="font-bold text-lg mb-2">Intelligent Dispatcher</h3>
                <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                   {data.orders.pending > 0 
                     ? `${data.orders.pending} pesanan menunggu optimasi rute. Jalankan AI sekarang untuk efisiensi.` 
                     : "Sistem berjalan optimal. Tidak ada antrian pengiriman mendesak."}
                </p>
                <Link 
                  href="/fleet" 
                  className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all border border-white/10 group-hover:border-white/20"
                >
                   Buka Kontrol AI <ArrowRight size={14} />
                </Link>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/30 rounded-full blur-[50px] group-hover:bg-blue-600/40 transition-all"></div>
             <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-600/30 rounded-full blur-[40px] group-hover:bg-purple-600/40 transition-all"></div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden h-[200px]">
             <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-sm text-slate-700 flex items-center gap-2">
                   <Clock size={14} /> Aktivitas Terakhir
                </h3>
             </div>
             <div className="divide-y divide-slate-50 overflow-y-auto custom-scrollbar">
                {data.logs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 py-8">
                    <p className="text-xs">Belum ada aktivitas</p>
                  </div>
                ) : (
                  data.logs.map((log, i) => (
                     <div key={i} className="p-3.5 flex gap-3 items-start hover:bg-slate-50/80 transition-colors">
                        <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                          log.status === 'delivered' ? 'bg-emerald-500' : 
                          log.status === 'in_transit' ? 'bg-blue-500' : 'bg-amber-500'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                           <div className="flex justify-between">
                             <p className="text-xs font-bold text-slate-800">#{log.tracking_id}</p>
                             <span className="text-[10px] text-slate-400">
                               {new Date(log.updated_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})}
                             </span>
                           </div>
                           <p className="text-[11px] text-slate-500 truncate mt-0.5">{log.destination_address}</p>
                           <p className={`text-[9px] mt-1 uppercase font-bold tracking-wider ${
                              log.status === 'delivered' ? 'text-emerald-600' : 'text-blue-600'
                           }`}>
                              {log.status.replace('_', ' ')}
                           </p>
                        </div>
                     </div>
                  ))
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}