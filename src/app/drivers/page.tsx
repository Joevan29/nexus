import { User, Phone, MapPin, MoreHorizontal, Truck } from 'lucide-react';

const drivers = [
  { id: 1, name: "Budi Santoso", status: "Busy", vehicle: "Van (B 1234 XYZ)", phone: "0812-3456-7890", location: "Menteng, Jakpus" },
  { id: 2, name: "Siti Aminah", status: "Idle", vehicle: "Motor (B 4567 ABC)", phone: "0813-4567-8901", location: "Warehouse A" },
  { id: 3, name: "Joko Anwar", status: "Offline", vehicle: "Truck (B 9999 DOG)", phone: "0819-0000-1111", location: "-" },
];

export default function DriversPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Driver Fleet</h1>
          <p className="text-slate-500 text-sm mt-1">Manage personnel and vehicle assignment.</p>
        </div>
        <button className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors">
          Register New Driver
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {drivers.map((driver) => (
          <div key={driver.id} className="card-basic p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{driver.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Truck size={10} /> {driver.vehicle}
                  </p>
                </div>
              </div>
              <StatusBadge status={driver.status} />
            </div>
            
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone size={14} className="text-slate-400" /> {driver.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin size={14} className="text-slate-400" /> {driver.location}
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <button className="flex-1 py-1.5 text-xs font-medium border border-slate-200 rounded text-slate-700 hover:bg-slate-50">View History</button>
              <button className="py-1.5 px-2 border border-slate-200 rounded text-slate-700 hover:bg-slate-50">
                <MoreHorizontal size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    Busy: "bg-blue-50 text-blue-700 border-blue-100",
    Idle: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Offline: "bg-slate-100 text-slate-500 border-slate-200",
  };
  
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${styles[status as keyof typeof styles]}`}>
      {status}
    </span>
  );
}