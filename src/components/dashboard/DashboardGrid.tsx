'use client';

import { motion } from 'framer-motion';
import { 
  DollarSign, Box, Truck, Users, ArrowRight, 
  AlertTriangle, Activity, MapPin 
} from 'lucide-react';
import Link from 'next/link';
import RevenueChart from '@/src/components/dashboard/RevenueChart';

interface DashboardProps {
  metrics: {
    valuation: string;
    pendingOrders: number;
    activeFleet: string;
    fleetUtilization: number;
    recentActivities: any[];
  };
}

export default function DashboardGrid({ metrics }: DashboardProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(140px,auto)]"
    >
      
      <motion.div variants={item} className="md:col-span-2 lg:col-span-2 row-span-2 card-basic p-1 min-h-[300px]">
         <RevenueChart /> 
      </motion.div>

      <motion.div variants={item} className="card-basic p-5 flex flex-col justify-between hover:border-blue-400 transition-colors group cursor-pointer relative overflow-hidden">
         <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Box size={64} />
         </div>
         <div className="flex justify-between items-start z-10">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
               <Box size={20} />
            </div>
            {metrics.pendingOrders > 0 && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
         </div>
         <div className="z-10">
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{metrics.pendingOrders}</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Pending Orders</p>
         </div>
      </motion.div>

      <motion.div variants={item} className="card-basic p-5 flex flex-col justify-between hover:border-emerald-400 transition-colors group">
         <div className="flex justify-between items-start">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
               <Truck size={20} />
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
               metrics.fleetUtilization > 80 
                 ? 'bg-rose-50 text-rose-600 border-rose-100' 
                 : 'bg-emerald-50 text-emerald-600 border-emerald-100'
            }`}>
               {metrics.fleetUtilization}% Util
            </span>
         </div>
         <div>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{metrics.activeFleet}</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Active Drivers</p>
         </div>
      </motion.div>

      <motion.div variants={item} className="md:col-span-2 lg:col-span-1 row-span-2 bg-slate-900 rounded-xl p-6 text-white relative overflow-hidden flex flex-col justify-between group shadow-xl shadow-slate-900/10">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
               <div className={`w-2 h-2 rounded-full ${metrics.pendingOrders > 5 ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">System Intelligence</span>
            </div>
            <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
               AI Dispatcher <AlertTriangle size={16} className={metrics.pendingOrders > 5 ? 'text-amber-400' : 'text-slate-600'} />
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-[200px]">
               {metrics.pendingOrders > 0 
                 ? `${metrics.pendingOrders} orderan menunggu rute optimal.` 
                 : "Semua armada berjalan optimal."}
            </p>
          </div>

          <Link href="/fleet" className="relative z-10 w-full py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all group-hover:translate-y-[-2px]">
             Open Control Center <ArrowRight size={14} />
          </Link>

          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-600 rounded-full blur-[50px] opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
      </motion.div>

      <motion.div variants={item} className="md:col-span-1 lg:col-span-1 row-span-2 card-basic p-0 overflow-hidden flex flex-col">
         <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-2">
               <Activity size={14} className="text-blue-500" /> Live Feed
            </h3>
         </div>
         <div className="flex-1 overflow-y-auto p-0 scrollbar-hide">
            {metrics.recentActivities.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                  <Activity size={24} className="opacity-20" />
                  <p className="text-xs">No activity yet</p>
               </div>
            ) : (
               <div className="divide-y divide-slate-50">
                  {metrics.recentActivities.map((activity, i) => (
                     <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex gap-3 group">
                        <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                           activity.status === 'delivered' ? 'bg-emerald-500' : 
                           activity.status === 'in_transit' ? 'bg-blue-500' : 'bg-amber-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-bold text-slate-800 truncate">#{activity.tracking_id}</p>
                           <p className="text-[10px] text-slate-500 uppercase font-semibold mt-0.5">
                              {activity.status.replace('_', ' ')}
                           </p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                           {new Date(activity.updated_at).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}
                        </span>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </motion.div>

      <motion.div variants={item} className="card-basic p-5 flex items-center gap-4 border-l-4 border-l-indigo-500">
         <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full">
            <DollarSign size={20} />
         </div>
         <div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Total Valuation</p>
            <p className="text-lg font-bold text-slate-900">{metrics.valuation}</p>
         </div>
      </motion.div>

      <motion.div variants={item} className="card-basic p-5 flex items-center gap-4">
         <div className="p-3 bg-slate-100 text-slate-600 rounded-full">
            <Users size={20} />
         </div>
         <div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Total Personnel</p>
            <p className="text-lg font-bold text-slate-900">12 <span className="text-xs text-slate-400 font-normal">Active</span></p>
         </div>
      </motion.div>

    </motion.div>
  );
}