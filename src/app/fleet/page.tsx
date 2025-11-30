// src/app/fleet/page.tsx
import { query } from '@/src/lib/db';
import { Truck, MapPin, Navigation, Users, Activity } from 'lucide-react';
import ControlPanel from '@/src/components/logistics/ControlPanel';
import MapWrapper from '@/src/components/logistics/MapWrapper'; // Import wrapper yang baru dibuat

async function getFleetStats() {
  try {
    const [driverRes, shipmentRes, activeListRes] = await Promise.all([
      query(`
        SELECT 
          COUNT(*) FILTER (WHERE status = 'busy') as busy,
          COUNT(*) FILTER (WHERE status = 'idle') as idle,
          COUNT(*) as total
        FROM drivers
      `),
      query(`SELECT COUNT(*) as in_transit FROM shipments WHERE status = 'in_transit'`),
      query(`SELECT name, vehicle_type, current_lat, current_lng FROM drivers WHERE status = 'busy' LIMIT 5`)
    ]);

    const drivers = driverRes.rows[0];
    const shipments = shipmentRes.rows[0];

    return {
      active: Number(drivers.busy),
      idle: Number(drivers.idle),
      total: Number(drivers.total),
      inTransit: Number(shipments.in_transit),
      activeList: activeListRes.rows
    };
  } catch (error) {
    console.error("Fleet Data Error:", error);
    return { active: 0, idle: 0, total: 0, inTransit: 0, activeList: [] };
  }
}

function FleetStat({ label, value, icon: Icon, color }: any) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    slate: "bg-slate-50 text-slate-600 border-slate-200"
  };
  const colorClass = colors[color as keyof typeof colors] || colors.slate;

  return (
    <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border ${colorClass} transition-all`}>
       <div className="p-2 bg-white/60 rounded-lg backdrop-blur-sm">
          <Icon size={18} />
       </div>
       <div>
          <p className="text-xl font-bold leading-none">{value}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider opacity-70 mt-1">{label}</p>
       </div>
    </div>
  );
}

export default async function FleetPage() {
  const stats = await getFleetStats();

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-6">
      
      {/* Header Stats */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="text-blue-600" /> Fleet Command
          </h1>
          <p className="text-slate-500 text-sm mt-1">Real-time vehicle tracking & route optimization.</p>
        </div>
        
        <div className="grid grid-cols-2 md:flex gap-3 w-full md:w-auto">
           <FleetStat label="Active Drivers" value={`${stats.active}/${stats.total}`} icon={Truck} color="blue" />
           <FleetStat label="In Transit" value={stats.inTransit} icon={Navigation} color="emerald" />
           <FleetStat label="Idle Units" value={stats.idle} icon={Users} color="amber" />
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        
        {/* Map Container */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm relative overflow-hidden flex flex-col">
          <div className="absolute inset-0 z-0">
             <MapWrapper />
          </div>
          
          <div className="absolute top-4 right-4 z-[400] w-72">
             <ControlPanel />
          </div>
        </div>

        <div className="w-80 hidden xl:flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden shrink-0">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
             <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Personnel
             </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
             {stats.activeList.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <Truck size={32} className="opacity-20" />
                  <p className="text-xs">Tidak ada armada aktif</p>
               </div>
             ) : (
               stats.activeList.map((driver: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer border border-transparent hover:border-slate-100 transition-all group">
                     <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm border border-slate-200 group-hover:bg-white group-hover:shadow-sm">
                        {driver.name.charAt(0)}
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{driver.name}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                           <MapPin size={10} /> 
                           {driver.current_lat ? `${Number(driver.current_lat).toFixed(4)}, ${Number(driver.current_lng).toFixed(4)}` : 'No Signal'}
                        </p>
                     </div>
                     <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">
                        {driver.vehicle_type}
                     </span>
                  </div>
               ))
             )}
          </div>
        </div>

      </div>
    </div>
  );
}