'use client';

import { usePathname } from 'next/navigation';
import { Search, Bell, ChevronRight, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import UserNav from '@/src/components/ui/UserNav';

export default function Header({ onSearchClick }: { onSearchClick: () => void }) {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  
  const paths = pathname === '/' 
    ? ['Overview'] 
    : pathname.split('/').filter(Boolean).map(p => p.charAt(0).toUpperCase() + p.slice(1));

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (storedTheme === 'dark' || (!storedTheme && systemDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 px-6 flex items-center justify-between shrink-0 transition-colors duration-300">
      
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 transition-colors">
        <span className="font-medium text-slate-400 dark:text-slate-500">Nexus</span>
        {paths.map((path, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <ChevronRight size={14} className="text-slate-300 dark:text-slate-600" />
            <span className={`font-medium ${
              idx === paths.length - 1 
                ? 'text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md' 
                : 'text-slate-500 dark:text-slate-400'
            }`}>
              {path}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        
        <button 
          onClick={onSearchClick}
          className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-500 dark:text-slate-400 transition-colors group"
        >
          <Search size={14} className="group-hover:text-blue-600 transition-colors" />
          <span>Quick Search...</span>
          <kbd className="hidden lg:inline-block pointer-events-none h-5 select-none items-center gap-1 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-1.5 font-mono text-[10px] font-medium text-slate-400 opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

        <button 
          onClick={toggleTheme}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>

        <UserNav />

      </div>
    </header>
  );
}