'use client';

import { QrCode, Box, MapPin } from 'lucide-react';
import QRCode from "react-qr-code";

export default function Waybill({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="hidden print:flex flex-col w-[100mm] h-[150mm] border-2 border-black p-4 bg-white text-black font-sans">
      
      <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tighter">NEXUS</h1>
          <p className="text-xs font-bold uppercase">Express Logistics</p>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-bold">{data.status === 'pending' ? 'REG' : 'PRIORITY'}</h2>
          <p className="text-xs">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mb-6">
        <QRCode value={data.tracking_id} size={120} />
        <p className="text-xl font-mono font-bold mt-2 tracking-widest">{data.tracking_id}</p>
      </div>

      <div className="space-y-4 mb-6 flex-1">
        <div className="border border-black p-2 rounded">
          <p className="text-[10px] font-bold uppercase mb-1 text-slate-500">Penerima (Destination)</p>
          <p className="text-sm font-bold leading-tight">{data.destination_address}</p>
        </div>
        
        <div className="border border-black p-2 rounded">
          <p className="text-[10px] font-bold uppercase mb-1 text-slate-500">Pengirim (Origin)</p>
          <p className="text-xs font-medium leading-tight">{data.origin_address}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t-2 border-black pt-4">
        <div>
          <p className="text-[10px] font-bold uppercase">Berat</p>
          <p className="text-lg font-bold">{data.weight} Kg</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase">COD / Biaya</p>
          <p className="text-lg font-bold">Rp {Number(data.price).toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-auto text-center pt-4 text-[10px] font-bold border-t border-dashed border-black">
        <p>Terima kasih telah menggunakan NEXUS.</p>
        <p>www.nexus-logistics.com</p>
      </div>
    </div>
  );
}