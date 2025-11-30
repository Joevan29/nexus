import { query } from '@/src/lib/db';
import { 
  DollarSign, 
  Box, 
  Truck, 
  Users, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import Link from 'next/link';
import StatCard from '@/src/components/dashboard/StatCard';
import RevenueChart from '@/src/components/dashboard/RevenueChart';

async function getDashboardMetrics() {
  const inventoryRes = await query(`
    SELECT SUM(price * stock) as total_value, COUNT(*) as total_sku 
    FROM products
  `);
  
  const shipmentRes = await query(`
    SELECT 
      COUNT(*) FILTER (WHERE status = 'pending') as pending,
      COUNT(*) FILTER (WHERE status = 'in_transit') as transit,
      COUNT(*) FILTER (WHERE status = 'delivered') as delivered
    FROM shipments
  `);

  const driverRes = await query(`
    SELECT 
      COUNT(*) FILTER (WHERE status = 'busy') as busy_drivers,
      COUNT(*) FILTER (WHERE status = 'idle') as idle_drivers,
      COUNT(*) as total_drivers
    FROM drivers
  `);

  const recentActivitiesRes = await query(`
    SELECT tracking_id, status, updated_at 
    FROM shipments 
    ORDER BY updated_at DESC 
    LIMIT 5
  `);

  const totalValuation = Number(inventoryRes.rows[0].total_value) || 0;
  const shipmentStats = shipmentRes.rows[0];
  const driverStats = driverRes.rows[0];

  return {
    valuation: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalValuation),
    pendingOrders: Number(shipmentStats.pending),
    activeFleet: `${driverStats.busy_drivers}/${driverStats.total_drivers}`,
    fleetUtilization: driverStats.total_drivers > 0 ? Math.round((driverStats.busy_drivers / driverStats.total_drivers) * 100) : 0,
    recentActivities: recentActivitiesRes.rows
  };
}

export default async function Dashboard() {
  const metrics = await getDashboardMetrics();
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-8 pb-12">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2 text-sm">
            <Clock size={14} /> {today} • Real-time Operations Overview
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/inbound" className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-50 transition-colors shadow-sm">
            Input Stock
          </Link>
          <Link href="/fleet" className="px-4 py-2.5 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2">
            <Truck size={16} /> Monitor Fleet
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Valuasi Aset" 
          value={metrics.valuation} 
          trend="+2.4%" 
          trendUp={true} 
          icon={DollarSign} 
          description="Estimasi nilai seluruh stok barang di gudang saat ini."
        />
        <StatCard 
          title="Pesanan Pending" 
          value={metrics.pendingOrders.toString()} 
          trend={metrics.pendingOrders > 10 ? "High Load" : "Normal"} 
          trendUp={metrics.pendingOrders < 10} 
          icon={Box} 
          description="Jumlah pengiriman yang menunggu assign driver."
        />
        <StatCard 
          title="Armada Aktif" 
          value={metrics.activeFleet} 
          trend={`${metrics.fleetUtilization}% Usage`} 
          trendUp={metrics.fleetUtilization > 50} 
          icon={Truck} 
          description="Driver yang sedang dalam perjalanan mengantar paket."
        />
        <StatCard 
          title="Total Personil" 
          value="12" 
          trend="Stable" 
          trendUp={true} 
          icon={Users} 
          description="Total staf gudang dan kurir yang terdaftar."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>

        <div className="space-y-8">
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-full max-h-[400px] flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-emerald-500" size={20} />
              Live Feed
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {metrics.recentActivities.length === 0 ? (
                <p className="text-sm text-slate-400 italic text-center py-8">Belum ada aktivitas tercatat.</p>
              ) : (
                metrics.recentActivities.map((activity: any, index: number) => (
                  <div key={index} className="flex gap-3 group">
                    <div className="flex flex-col items-center">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === 'delivered' ? 'bg-emerald-500' : 
                        activity.status === 'in_transit' ? 'bg-blue-500' : 'bg-amber-500'
                      }`}></div>
                      <div className="w-px h-full bg-slate-100 mt-1 group-last:hidden"></div>
                    </div>
                    <div className="pb-2">
                      <p className="text-sm font-bold text-slate-800">
                        Shipment #{activity.tracking_id}
                      </p>
                      <p className="text-xs text-slate-500 capitalize mb-1">
                        Status updated to <span className="font-bold text-slate-700">{activity.status.replace('_', ' ')}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {new Date(activity.updated_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <AlertTriangle className="text-amber-400" size={20} />
                AI Dispatcher
              </h3>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                {metrics.pendingOrders > 0 
                  ? `${metrics.pendingOrders} pesanan menunggu penugasan. Disarankan untuk menjalankan Auto-Assign sekarang.` 
                  : "Semua pesanan telah ditangani. Sistem berjalan optimal."}
              </p>
              
              <Link 
                href="/fleet" 
                className="inline-flex items-center justify-center w-full py-3 bg-white text-slate-900 rounded-lg font-bold text-sm hover:bg-slate-100 transition-colors"
              >
                Buka Kontrol AI <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-[60px] opacity-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500 rounded-full blur-[50px] opacity-20 pointer-events-none"></div>
          </div>

        </div>
      </div>
    </div>
  );
}