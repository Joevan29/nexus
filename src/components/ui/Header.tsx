'use client';

import { usePathname } from 'next/navigation';
import { Search, Bell, ChevronRight } from 'lucide-react';
import UserNav from '@/src/components/ui/UserNav';

export default function Header({ onSearchClick }: { onSearchClick: () => void }) {
  const pathname = usePathname();
  
  const paths = pathname === '/' 
    ? ['Overview'] 
    : pathname.split('/').filter(Boolean).map(p => p.charAt(0).toUpperCase() + p.slice(1));

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-6 flex items-center justify-between shrink-0">
      
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span className="font-medium text-slate-400">Nexus</span>
        {paths.map((path, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <ChevronRight size={14} className="text-slate-300" />
            <span className={`font-medium ${idx === paths.length - 1 ? 'text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md' : 'text-slate-500'}`}>
              {path}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        
        <button 
          onClick={onSearchClick}
          className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-500 transition-colors group"
        >
          <Search size={14} className="group-hover:text-blue-600 transition-colors" />
          <span>Quick Search...</span>
          <kbd className="hidden lg:inline-block pointer-events-none h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-slate-400 opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        <div className="h-6 w-px bg-slate-200 mx-2"></div>

        <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <UserNav />

      </div>
    </header>
  );
}