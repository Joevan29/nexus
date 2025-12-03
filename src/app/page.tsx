import { query } from '@/src/lib/db';
import { 
  DollarSign, Box, Truck, Activity, 
  CheckCircle2, Clock, Calendar, 
  ArrowRight, TrendingUp, MoreHorizontal 
} from 'lucide-react';
import Link from 'next/link';
import RevenueChart from '@/src/components/dashboard/RevenueChart';

// --- 1. Definisi Tipe Data ---
interface LogData {
  tracking_id: string;
  status: string;
  destination_address: string;
  created_at: string;
}

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
  logs: LogData[];
  alerts: number;
}

// --- 2. Komponen Kartu Statistik (Updated Design) ---
function StatCard({ title, value, sub, icon: Icon, trend }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(6,81,237,0.04)] hover:shadow-[0_4px_20px_-4px_rgba(6,81,237,0.08)] hover:border-slate-300 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 group-hover:text-slate-900 group-hover:bg-white transition-colors">
          <Icon size={20} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50/50 px-2 py-1 rounded-full border border-emerald-100/50">
            <TrendingUp size={12} /> {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">{value}</h3>
        <p className="text-xs font-medium text-slate-500 mt-1">{title}</p>
        {sub && <p className="text-[10px] text-slate-400 mt-2 font-medium">{sub}</p>}
      </div>
    </div>
  );
}

// --- 3. Fungsi Fetch Data ---
async function getDashboardData(): Promise<DashboardMetrics> {
  try {
    const [inventoryRes, shipmentRes, driverRes, activityRes] = await Promise.all([
      query(`SELECT COALESCE(SUM(price * stock), 0) as total_value, COUNT(*) FILTER (WHERE stock < 10) as low_stock FROM products`),
      query(`SELECT COUNT(*) FILTER (WHERE status = 'pending') as pending, COUNT(*) FILTER (WHERE status = 'delivered') as delivered, COUNT(*) as total FROM shipments`),
      query(`SELECT COUNT(*) FILTER (WHERE status = 'busy') as busy, COUNT(*) as total FROM drivers`),
      query(`SELECT tracking_id, status, destination_address, created_at FROM shipments WHERE status != 'pending' ORDER BY created_at DESC LIMIT 6`)
    ]);

    const inv = inventoryRes.rows[0];
    const ship = shipmentRes.rows[0];
    const driver = driverRes.rows[0];

    const activeDrivers = Number(driver.busy);
    const totalDrivers = Number(driver.total);

    return {
      valuation: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(inv.total_value)),
      orders: { pending: Number(ship.pending), total: Number(ship.total), delivered: Number(ship.delivered) },
      fleet: { active: activeDrivers, total: totalDrivers, utilization: totalDrivers > 0 ? Math.round((activeDrivers/totalDrivers)*100) : 0 },
      logs: activityRes.rows.map((row: any) => ({
        tracking_id: row.tracking_id,
        status: row.status,
        destination_address: row.destination_address,
        created_at: new Date(row.created_at).toISOString() 
      })),
      alerts: Number(inv.low_stock)
    };
  } catch (error) {
    console.error("Dashboard Error:", error);
    return {
      valuation: "Rp 0", orders: { pending: 0, delivered: 0, total: 0 },
      fleet: { active: 0, total: 0, utilization: 0 }, logs: [], alerts: 0
    };
  }
}

// --- 4. Halaman Utama ---
export default async function Dashboard() {
  const data = await getDashboardData();
  
  // Logic Sapaan Waktu
  const hour = new Date().getHours();
  let greeting = "Selamat Pagi";
  if (hour >= 12) greeting = "Selamat Siang";
  if (hour >= 15) greeting = "Selamat Sore";
  if (hour >= 18) greeting = "Selamat Malam";

  return (
    <div className="space-y-8">
      
      {/* 1. Header Section (Lebih Bersih) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{greeting}, Commander.</h1>
          <p className="text-slate-500 text-sm mt-2 max-w-lg">
            Berikut adalah ringkasan operasional logistik dan inventaris untuk hari ini.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/inbound" className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center gap-2">
            <Box size={16} /> Kelola Stok
          </Link>
          <Link href="/fleet" className="px-4 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center gap-2">
            <Truck size={16} /> Pantau Armada
          </Link>
        </div>
      </div>

      {/* 2. Grid Statistik (Lebih Lega) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="Total Valuasi Aset" 
          value={data.valuation} 
          sub="Estimasi nilai stok gudang"
          icon={DollarSign} 
          trend="+2.4%"
        />
        <StatCard 
          title="Pending Orders" 
          value={data.orders.pending.toString()} 
          sub={`${data.orders.total} total pesanan masuk`}
          icon={Box} 
        />
        <StatCard 
          title="Armada Aktif" 
          value={`${data.fleet.active} / ${data.fleet.total}`} 
          sub={`${data.fleet.utilization}% tingkat utilitas`}
          icon={Activity} 
        />
        <StatCard 
          title="Pengiriman Selesai" 
          value={data.orders.delivered.toString()} 
          sub="Bulan ini"
          icon={CheckCircle2} 
        />
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kiri: Grafik Revenue (Lebih Luas) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-1 min-h-[400px] flex flex-col">
          <RevenueChart />
        </div>

        {/* Kanan: AI & Logs */}
        <div className="space-y-6">
          
          {/* AI Insight Card (Dark Theme yang Elegan) */}
          <div className="bg-slate-950 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl shadow-slate-900/10 group">
             {/* Decorative Gradient */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-all duration-1000"></div>
             
             <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/30 px-2 py-1 rounded-full bg-emerald-500/10">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Live AI
                   </div>
                   <Activity size={16} className="text-slate-500" />
                </div>
                
                <h3 className="font-bold text-lg mb-2 text-white">Intelligent Dispatch</h3>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                   {data.orders.pending > 0 
                     ? `${data.orders.pending} pesanan terdeteksi. AI menyarankan optimasi rute segera.` 
                     : "Sistem stabil. Tidak ada anomali atau antrian yang memerlukan tindakan."}
                </p>
                
                <Link href="/fleet" className="inline-flex w-full items-center justify-center gap-2 py-3 bg-white text-slate-950 rounded-xl text-xs font-bold hover:bg-blue-50 transition-colors">
                   Buka Kontrol AI <ArrowRight size={14} />
                </Link>
             </div>
          </div>

          {/* Activity Feed (Clean List) */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
             <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-sm text-slate-900">Aktivitas Terkini</h3>
                <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={16}/></button>
             </div>
             
             <div className="flex-1 overflow-y-auto max-h-[300px] custom-scrollbar">
                {data.logs.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">Belum ada aktivitas hari ini.</div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {data.logs.map((log, i) => (
                       <div key={i} className="p-4 hover:bg-slate-50/50 transition-colors flex gap-3 group cursor-default">
                          <div className="mt-1">
                            {log.status === 'delivered' ? (
                              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-baseline mb-0.5">
                                <p className="text-xs font-bold text-slate-800 truncate">#{log.tracking_id}</p>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {new Date(log.created_at).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}
                                </span>
                             </div>
                             <p className="text-[11px] text-slate-500 truncate">{log.destination_address}</p>
                          </div>
                       </div>
                    ))}
                  </div>
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}