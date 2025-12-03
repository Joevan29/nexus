'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Package2, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
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
      toast.error("Akses Ditolak", { description: "Kredensial tidak valid." });
      setIsLoading(false);
    } else {
      toast.success("Login Berhasil", { description: "Mengalihkan ke Command Center..." });
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      
      <div className="hidden lg:flex w-1/2 bg-slate-950 relative flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 opacity-10" style={{ 
            backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', 
            backgroundSize: '32px 32px' 
        }}></div>
        
        <div className="relative z-10 flex items-center gap-2">
          <div className="p-2 bg-white text-slate-950 rounded-lg">
             <Package2 size={24} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl tracking-tight">NEXUS</span>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-3xl font-medium leading-tight mb-4 text-slate-200">
            "Orchestrate your entire supply chain from a single point of truth."
          </h2>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
             <ShieldCheck size={16} />
             <span>Enterprise-grade Security Protocol</span>
          </div>
        </div>

        {/* Footer Brand */}
        <div className="relative z-10 flex justify-between text-xs text-slate-500 font-mono">
           <p>© 2025 NEXUS LOGISTICS INC.</p>
           <p>SYSTEM V.2.4.0</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center bg-white p-8 sm:p-12">
        <div className="w-full max-w-sm space-y-8">
          
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Masuk ke Dashboard</h1>
            <p className="text-slate-500 text-sm">Masukkan detail akun admin Anda untuk melanjutkan.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-900">Email Kerja</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all"
                placeholder="name@company.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-900">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-transparent transition-all"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Footer Form */}
          <p className="text-center text-xs text-slate-500">
            Dilindungi oleh reCAPTCHA dan <a href="#" className="underline hover:text-slate-900">Kebijakan Privasi</a> Nexus berlaku.
          </p>
        </div>
      </div>

    </div>
  );
}