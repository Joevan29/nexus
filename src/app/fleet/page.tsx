'use client';

import dynamic from 'next/dynamic';
import { Truck, MapPin, Navigation, Users } from 'lucide-react';

const LogisticsMap = dynamic(() => import('@/src/components/logistics/Map'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 border border-slate-200 rounded-xl">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-2"></div>
      <p className="text-sm font-medium">Loading Fleet Data...</p>
    </div>
  )
});

export default function FleetPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Fleet Command</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time vehicle tracking & route optimization.</p>
        </div>
        
        <div className="flex gap-4">
           <FleetStat label="Active Drivers" value="12" icon={Truck} active />
           <FleetStat label="In Transit" value="8" icon={Navigation} />
           <FleetStat label="Idle" value="4" icon={Users} />
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        
        <div className="flex-1 card-basic p-1 relative overflow-hidden">
          <LogisticsMap />
          =
          <div className="absolute top-4 right-4 z-[500] bg-white/95 backdrop-blur border border-slate-200 shadow-lg rounded-lg p-4 w-72">
             <h3 className="text-sm font-bold text-slate-800 mb-3">AI Dispatcher</h3>
             <div className="space-y-2">
                <button className="w-full py-2 px-3 bg-slate-900 text-white text-xs font-bold rounded hover:bg-slate-800 transition-colors flex justify-center items-center gap-2">
                   <Navigation size={14} /> Auto-Assign Pending Orders
                </button>
                <div className="flex gap-2">
                   <button className="flex-1 py-2 px-3 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded hover:bg-slate-50 transition-colors">
                      Reset Map
                   </button>
                   <button className="flex-1 py-2 px-3 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded hover:bg-slate-50 transition-colors">
                      View Heatmap
                   </button>
                </div>
             </div>
             <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex justify-between items-center text-xs">
                   <span className="text-slate-500">Server Status</span>
                   <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Connected
                   </span>
                </div>
             </div>
          </div>
        </div>

        <div className="w-80 hidden xl:flex flex-col card-basic overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
             <h3 className="font-bold text-slate-700 text-sm">Active Personnel</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
             {[1,2,3,4,5].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer border border-transparent hover:border-slate-100 transition-all">
                   <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold border border-slate-200">
                      D{i}
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">Budi Santoso {i}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                         <MapPin size={10} /> Menteng, Jakarta Pusat
                      </p>
                   </div>
                   <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function FleetStat({ label, value, icon: Icon, active }: { label: string, value: string, icon: any, active?: boolean }) {
   return (
      <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${active ? 'bg-white border-slate-200 shadow-sm' : 'bg-transparent border-transparent opacity-60 hover:opacity-100'}`}>
         <div className={`p-1.5 rounded md:block hidden ${active ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
            <Icon size={16} />
         </div>
         <div>
            <p className="text-lg font-bold text-slate-900 leading-none">{value}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{label}</p>
         </div>
      </div>
   )
}