'use client';

import { usePathname } from 'next/navigation';
import { Search, ChevronRight, Moon, Sun, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import UserNav from '@/src/components/ui/UserNav';
import NotificationNav from '@/src/components/ui/NotificationNav';

interface HeaderProps {
  onSearchClick?: () => void;
  onMenuClick?: () => void;
}

export default function Header({ onSearchClick, onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  const paths = pathname === '/' 
    ? ['Overview'] 
    : pathname.split('/').filter(Boolean).map(p => p.charAt(0).toUpperCase() + p.slice(1));

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (storedTheme === 'dark' || (!storedTheme && systemDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
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

  if (!mounted) return <div className="h-16 bg-background border-b border-border" />;

  return (
    <header className="h-16 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between shrink-0 transition-colors duration-300">
      
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2 text-sm">
          <span className="hidden md:inline font-medium text-muted-foreground/60">Nexus</span>
          {paths.map((path, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <ChevronRight size={14} className="text-muted-foreground/40 hidden md:block" />
              <span className={`font-medium ${
                idx === paths.length - 1 
                  ? 'text-foreground bg-accent px-2 py-0.5 rounded-md' 
                  : 'text-muted-foreground hidden md:block'
              }`}>
                {path}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        
        <button 
          onClick={onSearchClick}
          className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-secondary/50 hover:bg-secondary border border-border rounded-lg text-xs text-muted-foreground transition-all group w-48 lg:w-64"
        >
          <Search size={14} className="group-hover:text-primary transition-colors" />
          <span>Quick Search...</span>
          <kbd className="ml-auto pointer-events-none h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        <button onClick={onSearchClick} className="md:hidden p-2 text-muted-foreground hover:bg-accent rounded-full">
           <Search size={20} />
        </button>

        <div className="h-6 w-px bg-border mx-1"></div>

        <button 
          onClick={toggleTheme}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-all"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <NotificationNav />

        <UserNav />

      </div>
    </header>
  );
}