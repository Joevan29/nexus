'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Printer, MoreHorizontal, CheckSquare, Square, 
  MapPin, Truck, Calendar, ArrowRight, CheckCircle2, Clock, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Order {
  id: number;
  tracking_id: string;
  origin_address: string;
  destination_address: string;
  status: string;
  price: number;
  weight: number;
  created_at: string;
  driver_name?: string;
  vehicle_type?: string;
  driver_phone?: string;
}

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === orders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(orders.map(o => o.id));
    }
  };

  const handleBulkPrint = () => {
    toast.success(`Mengirim perintah cetak untuk ${selectedIds.length} resi...`);
    setTimeout(() => setSelectedIds([]), 1500);
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4 w-10">
                <button 
                  onClick={toggleAll} 
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {selectedIds.length === orders.length && orders.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
                </button>
              </th>
              <th className="px-6 py-4">Tracking Info</th>
              <th className="px-6 py-4">Rute Pengiriman</th>
              <th className="px-6 py-4">Status & Driver</th>
              <th className="px-6 py-4 text-right">Biaya</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-100 bg-white">
            {orders.map((order) => {
              const isSelected = selectedIds.includes(order.id);
              return (
                <tr 
                  key={order.id} 
                  className={`group transition-colors ${
                    isSelected 
                      ? 'bg-blue-50' 
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleSelect(order.id)} 
                      className={`${isSelected ? 'text-blue-600' : 'text-slate-300 group-hover:text-slate-400'}`}
                    >
                      {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                    </button>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <Link 
                        href={`/orders/${order.tracking_id}`} 
                        className="font-bold text-blue-600 hover:text-blue-800 hover:underline font-mono text-xs transition-colors"
                      >
                        {order.tracking_id}
                      </Link>
                      <span className="text-[10px] text-slate-500 mt-1.5 bg-slate-100 px-1.5 py-0.5 rounded w-fit border border-slate-200">
                        {order.weight} Kg
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 max-w-[200px]">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                        <span className="truncate">{order.origin_address.split(',')[0]}</span>
                      </div>
                      
                      <div className="pl-0.5 ml-[2px] border-l border-slate-200 h-3"></div>
                      
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                        <MapPin size={12} className="text-rose-500 shrink-0" />
                        <span className="truncate" title={order.destination_address}>
                          {order.destination_address.split(',')[0]}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <StatusBadge status={order.status} />
                      
                      {order.driver_name ? (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                           <Truck size={12} className="text-slate-400" /> 
                           <span className="truncate max-w-[120px] font-medium">{order.driver_name}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 w-fit">
                          <Clock size={10} />
                          <span>Menunggu Kurir</span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-bold text-slate-900">
                        Rp {Number(order.price).toLocaleString('id-ID')}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <Calendar size={10} />
                        {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                  </td>

                  {/* Action Button */}
                  <td className="px-6 py-4 text-right">
                    <Link href={`/orders/${order.tracking_id}`}>
                      <button className="text-slate-400 hover:text-blue-600 p-2 hover:bg-slate-100 rounded-lg transition-all">
                        <MoreHorizontal size={18} />
                      </button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 z-50 border border-slate-700/50 backdrop-blur-md min-w-[320px]"
          >
            <span className="text-sm font-bold border-r border-slate-700 pr-6 mr-2 whitespace-nowrap">
              {selectedIds.length} terpilih
            </span>
            
            <div className="flex items-center gap-3 w-full justify-end">
              <button 
                onClick={handleBulkPrint}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors"
              >
                <Printer size={14} /> Cetak Resi
              </button>
              
              <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold transition-colors shadow-lg shadow-blue-500/30">
                <CheckCircle2 size={14} /> Update Status
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-slate-100 text-slate-600 border-slate-200",
    assigned: "bg-blue-50 text-blue-700 border-blue-200",
    in_transit: "bg-amber-50 text-amber-700 border-amber-200",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  
  const icons: any = {
    pending: Clock,
    assigned: ArrowRight,
    in_transit: Truck,
    delivered: CheckCircle2
  };

  const Icon = icons[status] || AlertCircle;
  const style = styles[status] || styles.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${style}`}>
      <Icon size={10} strokeWidth={2.5} /> 
      {status.replace('_', ' ')}
    </span>
  );
}