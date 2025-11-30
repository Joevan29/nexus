'use client';

import { useState } from 'react';
import { ArrowDownLeft, Search, ScanLine, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function InboundPage() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInbound = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1000));
    
    toast.success("Stok berhasil ditambahkan", {
      description: "SKU: K-001-ARA (+50 Units)",
    });
    setIsProcessing(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <ArrowDownLeft size={24} />
          </div>
          Inbound Processing
        </h1>
        <p className="text-slate-500 text-sm mt-1 ml-14">Catat barang masuk dari supplier atau retur.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Input */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-basic p-6 bg-white">
            <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Input Data</h3>
            
            <form onSubmit={handleInbound} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase">SKU Code</label>
                  <div className="relative">
                    <input name="sku" required className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono" placeholder="Scan or type..." />
                    <ScanLine size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Quantity</label>
                  <input name="qty" type="number" min="1" required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900" placeholder="0" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase">Product Name</label>
                <input name="name" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Auto-filled if SKU exists..." />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase">Supplier / Source</label>
                <input name="source" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. PT. Kopi Nusantara" />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full bg-slate-900 text-white py-2.5 rounded-md font-medium text-sm hover:bg-slate-800 transition-all flex justify-center items-center gap-2 disabled:opacity-70"
                >
                  {isProcessing ? "Processing..." : <>Confirm Inbound <CheckCircle2 size={16}/></>}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card-basic p-5 bg-slate-50/50 h-full">
            <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <AlertCircle size={16} className="text-blue-500" /> Recent Logs
            </h4>
            <div className="space-y-3 relative before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
              {[1,2,3].map((i) => (
                <div key={i} className="relative pl-6">
                  <div className="absolute left-0 top-1.5 w-3 h-3 bg-white border-2 border-blue-500 rounded-full"></div>
                  <p className="text-xs font-bold text-slate-800">Received +100 Qty</p>
                  <p className="text-[10px] text-slate-500 font-mono">SKU: K-001-ARA</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">2 mins ago by Admin</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}