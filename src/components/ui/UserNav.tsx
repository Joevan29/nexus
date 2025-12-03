'use client';

import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserNav() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const userName = session?.user?.name || "Commander";
  const userEmail = session?.user?.email || "admin@nexus.com";

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 outline-none"
      >
        <div className="text-right hidden md:block">
          <p className="text-xs font-bold text-slate-800 leading-none">{userName}</p>
          <p className="text-[10px] text-slate-500 font-medium">Head of Ops</p>
        </div>
        <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-md shadow-blue-500/30">
          <span className="font-bold text-xs">{userName.charAt(0)}</span>
        </div>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <p className="text-sm font-bold text-slate-800">Akun Saya</p>
                <p className="text-xs text-slate-500 truncate">{userEmail}</p>
              </div>
              
              <div className="p-2 space-y-1">
                <Link 
                  href="/settings" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <Settings size={16} /> Pengaturan
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut size={16} /> Keluar (Logout)
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}