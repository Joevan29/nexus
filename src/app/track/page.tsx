import { query } from '@/src/lib/db';
import { Search, Package, MapPin, Truck, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function TimelineItem({ active, completed, title, date, icon: Icon, last }: any) {
  return (
    <div className="flex gap-4 relative">
      {!last && (
        <div className={`absolute left-5 top-10 bottom-0 w-0.5 ${completed ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
      )}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-2 ${
        active || completed ? 'bg-white border-blue-600 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-300'
      }`}>
        <Icon size={18} />
      </div>
      <div className={`pb-8 ${active ? 'opacity-100' : completed ? 'opacity-80' : 'opacity-40'}`}>
        <h4 className="font-bold text-slate-900">{title}</h4>
        <p className="text-sm text-slate-500">{date || 'Pending'}</p>
      </div>
    </div>
  );
}


export default async function TrackingPage(
  props: { searchParams: Promise<{ id?: string }> } 
) {
  const searchParams = await props.searchParams;
  const trackingId = searchParams?.id || '';
  let shipment = null;
  let driver = null;

  if (trackingId) {
    const res = await query(
      `SELECT s.*, d.name as driver_name, d.phone as driver_phone, d.vehicle_type 
       FROM shipments s 
       LEFT JOIN drivers d ON s.driver_id = d.id 
       WHERE s.tracking_id = $1`, 
      [trackingId]
    );
    if (res.rows.length > 0) {
      shipment = res.rows[0];
      driver = { name: shipment.driver_name, phone: shipment.driver_phone, vehicle: shipment.vehicle_type };
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar Sederhana */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <Package size={24} /> NEXUS <span className="text-slate-400 font-medium text-sm">TRACKER</span>
        </div>
        <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-blue-600">
          Admin Login
        </Link>
      </div>

      <div className="flex-1 max-w-xl w-full mx-auto p-6">
        
        <div className="text-center mb-8 mt-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Lacak Paket Anda</h1>
          <p className="text-slate-500 text-sm">Masukkan Nomor Resi (Contoh: NEX-004)</p>
        </div>

        <form className="relative mb-10">
          <input 
            name="id" 
            defaultValue={trackingId}
            placeholder="Nomor Resi..." 
            className="w-full pl-5 pr-14 py-4 rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 focus:ring-2 focus:ring-blue-500 outline-none text-lg font-mono font-medium uppercase"
          />
          <button type="submit" className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-4 rounded-xl hover:bg-blue-700 transition-colors">
            <Search size={20} />
          </button>
        </form>

        {trackingId && !shipment && (
          <div className="text-center p-8 bg-white rounded-2xl border border-rose-100 shadow-sm">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package size={24} />
            </div>
            <h3 className="font-bold text-rose-600">Resi Tidak Ditemukan</h3>
            <p className="text-xs text-slate-400 mt-1">Silakan periksa kembali nomor resi Anda.</p>
          </div>
        )}

        {shipment && (
          <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-200 overflow-hidden">
            {/* Header Status */}
            <div className="bg-slate-900 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Status Terkini</p>
                  <h2 className="text-2xl font-bold mt-1 uppercase text-emerald-400">
                    {shipment.status.replace('_', ' ')}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Resi</p>
                  <p className="font-mono font-bold text-lg">{shipment.tracking_id}</p>
                </div>
              </div>
            </div>

            {/* Shipment Details */}
            <div className="p-6">
              <div className="flex gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex-1">
                  <p className="text-xs text-slate-400 uppercase font-bold">Asal</p>
                  <p className="font-bold text-slate-800 text-sm">{shipment.origin_address}</p>
                </div>
                <div className="text-slate-300 flex items-center"><ArrowRight size={16} /></div>
                <div className="flex-1 text-right">
                  <p className="text-xs text-slate-400 uppercase font-bold">Tujuan</p>
                  <p className="font-bold text-slate-800 text-sm">{shipment.destination_address}</p>
                </div>
              </div>

              <div className="pl-2">
                <TimelineItem 
                  title="Pesanan Dibuat" 
                  date={new Date(shipment.created_at).toLocaleDateString()} 
                  icon={Package} 
                  completed={true} 
                />
                <TimelineItem 
                  title="Menunggu Kurir" 
                  date={shipment.status !== 'pending' ? 'Selesai' : null} 
                  icon={Clock} 
                  completed={shipment.status !== 'pending'} 
                  active={shipment.status === 'pending'}
                />
                <TimelineItem 
                  title={driver ? `Diantar oleh ${driver.name} (${driver.vehicle})` : "Dalam Perjalanan"} 
                  date={driver?.phone}
                  icon={Truck} 
                  completed={shipment.status === 'delivered'} 
                  active={shipment.status === 'in_transit'}
                />
                <TimelineItem 
                  title="Paket Diterima" 
                  date={shipment.status === 'delivered' ? 'Terkirim' : null} 
                  icon={CheckCircle2} 
                  active={shipment.status === 'delivered'}
                  last
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}