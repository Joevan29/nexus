'use client';

import { useState } from 'react';
import { ArrowDownLeft, ScanLine, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function InboundPage() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInbound = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      sku: formData.get('sku'),
      name: formData.get('name'),
      qty: Number(formData.get('qty')),
      price: 0, 
      location: 'GUDANG-A',
      category: 'General'
    };

    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        body: JSON.stringify({
            sku: data.sku,
            name: data.name,
            stock: data.qty,
            price: 50000,
            location: 'Warehouse A',
            category: 'Uncategorized'
        }),
      });

      if (!res.ok) throw new Error('Gagal menyimpan');

      toast.success("Stok berhasil ditambahkan", {
        description: `SKU: ${data.sku} (+${data.qty} Units)`,
      });
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsProcessing(false);
    }
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
        <p className="text-slate-500 text-sm mt-1 ml-14">Catat barang masuk ke gudang utama.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card-basic p-6 bg-white">
            <form onSubmit={handleInbound} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">SKU Code</label>
                  <div className="relative">
                    <input name="sku" required className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono" placeholder="Scan..." />
                    <ScanLine size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Quantity</label>
                  <input name="qty" type="number" min="1" required className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900" placeholder="0" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Product Name</label>
                <input name="name" required className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nama Produk..." />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex justify-center items-center gap-2 disabled:opacity-70 shadow-lg shadow-slate-900/20"
                >
                  {isProcessing ? <Loader2 className="animate-spin" /> : <>Confirm Inbound <CheckCircle2 size={18}/></>}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="card-basic p-5 bg-slate-50/80 h-full">
            <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <AlertCircle size={16} className="text-blue-500" /> Recent Logs
            </h4>
            <div className="space-y-4 relative before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
              <div className="relative pl-6">
                  <div className="absolute left-0 top-1.5 w-3 h-3 bg-white border-2 border-emerald-500 rounded-full"></div>
                  <p className="text-xs font-bold text-slate-800">System Ready</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Waiting for input...</p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}