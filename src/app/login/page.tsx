'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Package2, ArrowRight, Loader2, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('admin@nexus.com');
  const [password, setPassword] = useState('password123');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      toast.error("Akses Ditolak", { description: "Email atau password salah." });
      setIsLoading(false);
    } else {
      toast.success("Welcome back, Commander!");
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10"></div>
        {/* Placeholder image background */}
        <div className="absolute inset-0 bg-slate-800 opacity-50"></div> 
        
        <div className="relative z-20 p-12 text-white max-w-lg">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/30">
            <Package2 size={40} />
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-6">Orchestrate your entire supply chain.</h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            NEXUS memberikan visibilitas total dari gudang hingga tangan pelanggan.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-24 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900">Login Command Center</h2>
            <p className="mt-2 text-sm text-slate-500">Masukkan kredensial admin Anda.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email Kerja</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-900" 
                />
                <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-900" 
                />
                <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : (
                <>Masuk Sistem <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}