import { query } from '@/src/lib/db';
import { 
  Phone, MapPin, MoreHorizontal, 
  Truck, Bike, Car, Signal, SignalLow, SignalZero, User 
} from 'lucide-react';
import AddDriverModal from '@/src/components/logistics/AddDriverModal';

interface Driver {
  id: number;
  name: string;
  vehicle_type: 'motor' | 'van' | 'truck';
  status: 'idle' | 'busy' | 'offline';
  phone?: string;
  current_lat?: number;
  current_lng?: number;
}

async function getDrivers(): Promise<Driver[]> {
  try {
    const res = await query(`
      SELECT id, name, vehicle_type, status, phone, current_lat, current_lng 
      FROM drivers 
      ORDER BY 
        CASE status 
          WHEN 'busy' THEN 1 
          WHEN 'idle' THEN 2 
          ELSE 3 
        END ASC, 
        name ASC
    `);
    return res.rows;
  } catch (error) {
    console.error("Gagal memuat driver:", error);
    return [];
  }
}


function StatusBadge({ status }: { status: Driver['status'] }) {
  const styles = {
    busy: "bg-indigo-50 text-indigo-700 border-indigo-100",
    idle: "bg-emerald-50 text-emerald-700 border-emerald-100",
    offline: "bg-slate-100 text-slate-500 border-slate-200",
  };

  const labels = {
    busy: "Sedang Mengantar",
    idle: "Siap (Idle)",
    offline: "Offline",
  };
  
  return (
    <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border ${styles[status]}`}>
      {labels[status] || status}
    </span>
  );
}

function VehicleIcon({ type }: { type: Driver['vehicle_type'] }) {
  if (type === 'motor') return <Bike size={14} />;
  if (type === 'truck') return <Truck size={14} />;
  return <Car size={14} />;
}

function SignalIndicator({ status }: { status: Driver['status'] }) {
  if (status === 'busy') return <Signal size={14} className="text-emerald-500" />;
  if (status === 'idle') return <SignalLow size={14} className="text-amber-500" />;
  return <SignalZero size={14} className="text-slate-300" />;
}


export default async function DriversPage() {
  const drivers = await getDrivers();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Driver Fleet</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manajemen personel dan penugasan kendaraan ({drivers.length} Total).
          </p>
        </div>
        
        <AddDriverModal /> 
        
      </div>

      {drivers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-slate-300" />
          </div>
          <h3 className="text-slate-900 font-bold">Belum ada driver</h3>
          <p className="text-slate-500 text-sm mt-1">Silakan tambahkan data driver ke database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {drivers.map((driver) => (
            <div key={driver.id} className="card-basic p-5 flex flex-col gap-4 hover:border-blue-300 transition-all group bg-white">
              
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 text-lg">
                      {driver.name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
                       <SignalIndicator status={driver.status} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{driver.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded">
                        <VehicleIcon type={driver.vehicle_type} /> {driver.vehicle_type}
                      </span>
                    </div>
                  </div>
                </div>
                <StatusBadge status={driver.status} />
              </div>
              
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-6 flex justify-center"><Phone size={14} className="text-slate-400" /></div>
                  <span className="font-medium font-mono text-xs">{driver.phone || "-"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-6 flex justify-center"><MapPin size={14} className="text-slate-400" /></div>
                  <span className="truncate text-xs text-slate-500">
                    {driver.current_lat && driver.current_lng 
                      ? `${Number(driver.current_lat).toFixed(4)}, ${Number(driver.current_lng).toFixed(4)}` 
                      : "Lokasi tidak diketahui"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-2 pt-2">
                <button className="flex-1 py-2 text-xs font-bold border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                  Lihat Riwayat
                </button>
                <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors">
                  <MoreHorizontal size={16} />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}