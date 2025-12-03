'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Printer, MapPin, Truck, Calendar, 
  Package, DollarSign, User, Phone 
} from 'lucide-react';
import { toast } from 'sonner';
import Waybill from '@/src/components/orders/Waybill';

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) throw new Error('Order not found');
        const data = await res.json();
        setOrder(data);
      } catch (error) {
        toast.error("Gagal memuat data order");
        router.push('/orders');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id, router]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Memuat data resi...</div>;
  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <Waybill data={order} />

      <div className="flex items-center justify-between no-print">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={18} /> Kembali
        </button>
        
        <div className="flex gap-2">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
          >
            <Printer size={16} /> Cetak Resi (Waybill)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
        
        <div className="md:col-span-2 space-y-6">
          <div className="card-premium p-8 bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <Package size={120} />
            </div>
            
            <div className="relative z-10">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">
                {order.status.replace('_', ' ')}
              </span>
              <h1 className="text-3xl font-bold text-slate-900 mt-4 font-mono tracking-tight">
                {order.tracking_id}
              </h1>
              <p className="text-slate-500 text-sm mt-1">Dibuat pada {new Date(order.created_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-8 border-t border-slate-100 pt-8">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold mb-1 flex items-center gap-2">
                  <MapPin size={12} /> Asal (Origin)
                </p>
                <p className="text-sm font-bold text-slate-800">{order.origin_address}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold mb-1 flex items-center gap-2">
                  <MapPin size={12} className="text-rose-500" /> Tujuan (Dest)
                </p>
                <p className="text-sm font-bold text-slate-800">{order.destination_address}</p>
              </div>
            </div>
          </div>

          <div className="card-basic p-6 bg-white">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Truck size={18} className="text-emerald-500" /> Informasi Pengantaran
            </h3>
            {order.driver_id ? (
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-600 font-bold border border-slate-200 text-lg">
                  {order.driver_name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{order.driver_name}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className="uppercase bg-white px-1.5 rounded border border-slate-200">{order.vehicle_type}</span> 
                    • {order.driver_phone}
                  </p>
                </div>
                <div className="ml-auto">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Phone size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
                Belum ada driver yang ditugaskan.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-basic p-6 bg-white">
            <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Rincian Biaya</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Berat Barang</span>
                <span className="font-medium">{order.weight} Kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Layanan</span>
                <span className="font-medium">Regular</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between items-center mt-4">
                <span className="font-bold text-slate-800">Total</span>
                <span className="font-bold text-lg text-emerald-600">Rp {Number(order.price).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}