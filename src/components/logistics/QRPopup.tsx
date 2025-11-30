'use client';

import QRCode from "react-qr-code";
import { X, Printer } from "lucide-react";

interface QRPopupProps {
  trackingId: string;
  address: string;
  onClose: () => void;
}

export default function QRPopup({ trackingId, address, onClose }: QRPopupProps) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Digital Handover</h3>
            <p className="text-xs text-slate-500">Scan untuk konfirmasi serah terima</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200 dashed-border">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <QRCode 
              value={JSON.stringify({ id: trackingId, action: "handover" })} 
              size={200} 
              level="H"
            />
          </div>
          <p className="mt-4 font-mono font-bold text-xl text-slate-800 tracking-widest">{trackingId}</p>
        </div>

        <div className="mt-6 space-y-3">
          <div className="text-center">
            <p className="text-xs font-bold text-slate-500 uppercase">Tujuan</p>
            <p className="text-sm font-medium text-slate-800 line-clamp-2">{address}</p>
          </div>

          <button 
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
          >
            <Printer size={16} /> Print Label
          </button>
        </div>

      </div>
    </div>
  );
}