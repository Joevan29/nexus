'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package2, ArrowRight, Loader2, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      toast.success("Welcome back, Commander!");
      router.push('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        
        <div className="relative z-10 p-12 text-white max-w-lg">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/30">
            <Package2 size={40} />
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-6">Orchestrate your entire supply chain.</h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            NEXUS memberikan visibilitas total dari gudang hingga tangan pelanggan. Kelola inventaris, armada, dan analitik dalam satu komando.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-24 bg-white">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900">Login ke Command Center</h2>
            <p className="mt-2 text-sm text-slate-500">Masukkan kredensial admin Anda untuk melanjutkan.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email Kerja</label>
              <div className="relative">
                <input 
                  type="email" 
                  defaultValue="admin@nexus.com" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-900" 
                  placeholder="name@company.com"
                />
                <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex justify-between">
                Password
                <span className="text-blue-600 text-xs font-medium cursor-pointer hover:underline">Lupa Password?</span>
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  defaultValue="password123" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-900" 
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : (
                <>
                  Masuk Sistem <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

          </form>

          <p className="text-center text-xs text-slate-400 mt-8">
            Dilindungi oleh NEXUS Enterprise Security. <br/>
            Versi v2.4.0 (Stable)
          </p>
        </div>
      </div>
    </div>
  );
}