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
    const res = await signIn('credentials', { redirect: false, email, password });
    
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
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-950">
      
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/30 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      
      <div className="relative z-10 w-full max-w-md p-8 m-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
            <Package2 size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">NEXUS COMMAND</h1>
          <p className="text-slate-400 text-sm mt-2">Masuk untuk mengelola logistik global.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase ml-1">Email</label>
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <Mail className="absolute left-3 top-3.5 text-slate-500" size={18} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <Lock className="absolute left-3 top-3.5 text-slate-500" size={18} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 mt-2 group"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : (
              <>Access Terminal <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </form>
      </div>

      <div className="absolute bottom-6 text-center w-full">
        <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Secured by Nexus Enterprise Protocol</p>
      </div>
    </div>
  );
}