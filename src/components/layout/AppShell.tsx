'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Sidebar from '@/src/components/ui/Sidebar';
import Header from '@/src/components/ui/Header';
import { CommandMenu } from '@/src/components/ui/CommandMenu';
import NexusCopilot from '@/src/components/ui/NexusCopilot';
import RealtimeListener from '@/src/components/ui/RealtimeListener';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [openCommand, setOpenCommand] = useState(false);

  const toggleCommand = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  };

  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return (
      <main className="min-h-screen w-full bg-slate-50">
        {children}
        <RealtimeListener />
      </main>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-slate-50 text-slate-900 overflow-hidden">
      
      <Sidebar />

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 md:hidden bg-white shadow-2xl"
            >
              <Sidebar mobile />
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 relative flex flex-col h-full overflow-hidden bg-slate-50/50">
        
        <div className="flex items-center md:hidden h-16 px-4 bg-white border-b border-slate-200 shrink-0 justify-between">
           <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-slate-600">
              <Menu size={24} />
           </button>
           <span className="font-bold text-slate-900">NEXUS</span>
           <div className="w-8"></div> {/* Spacer */}
        </div>

        <div className="hidden md:block">
           <Header onSearchClick={toggleCommand} />
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto pb-20">
            {children}
          </div>
        </div>

        <CommandMenu />
        <NexusCopilot />
        <RealtimeListener />
      </main>
    </div>
  );
}