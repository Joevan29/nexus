'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/src/components/ui/Sidebar';
import { CommandMenu } from '@/src/components/ui/CommandMenu';
import NexusCopilot from '@/src/components/ui/NexusCopilot';
import RealtimeListener from '@/src/components/ui/RealtimeListener';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
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

      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        
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