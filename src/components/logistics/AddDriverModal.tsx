'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Truck, User, Phone, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function AddDriverModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      vehicle_type: formData.get('vehicle_type'),
    };

    try {
      const res = await fetch('/api/logistics/drivers', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Gagal menyimpan");

      toast.success("Driver Berhasil Didaftarkan", {
        description: `${data.name} siap menerima tugas.`,
      });
      
      setIsOpen(false);
      router.refresh(); 
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2"
      >
        <User size={16} /> Registrasi Driver Baru
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-lg text-slate-800">Tambah Personel</h3>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nama Lengkap</label>
                  <div className="relative">
                    <input name="name" required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Nama Driver..." />
                    <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nomor Telepon</label>
                  <div className="relative">
                    <input name="phone" required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="0812..." />
                    <Phone className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Jenis Kendaraan</label>
                  <div className="relative">
                    <select name="vehicle_type" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer">
                      <option value="motor">Motor (Max 20kg)</option>
                      <option value="van">Blind Van (Max 100kg)</option>
                      <option value="truck">Truck Box (Max 500kg)</option>
                    </select>
                    <Truck className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <>Simpan Data <CheckCircle2 size={18} /></>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}