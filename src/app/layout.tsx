import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { LayoutDashboard, Box, Truck, Users, Settings, Package2 } from "lucide-react";
import { CommandMenu } from '@/src/components/ui/CommandMenu';
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NEXUS | Supply Chain Control",
  description: "Enterprise Logistics Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-screen bg-slate-50 text-slate-900 overflow-hidden`}>
        
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col z-20 shrink-0 h-full">
          
          <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm shadow-blue-600/20">
              <Package2 size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-slate-900 leading-none">NEXUS</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Enterprise</p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
            <div className="px-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Main Menu</div>
            <NavItem href="/" icon={<LayoutDashboard size={18} />} label="Overview" />
            
            <div className="px-2 mt-6 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inventory</div>
            <NavItem href="/inventory" icon={<Box size={18} />} label="Warehouse Data" />
            <NavItem href="/inbound" icon={<Box size={18} className="rotate-180" />} label="Inbound Stock" />

            <div className="px-2 mt-6 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Logistics</div>
            <NavItem href="/fleet" icon={<Truck size={18} />} label="Fleet Map" />
            <NavItem href="/drivers" icon={<Users size={18} />} label="Driver Team" />
          </nav>

          <div className="p-4 border-t border-slate-100 shrink-0">
            <Link href="/settings" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs group-hover:border-blue-200 group-hover:text-blue-600 transition-colors">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-700 truncate group-hover:text-blue-700 transition-colors">Admin User</p>
                <p className="text-xs text-slate-500 truncate">admin@nexus.com</p>
              </div>
              <Settings size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
            </Link>
          </div>
        </aside>

        <main className="flex-1 relative flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
            <div className="max-w-7xl mx-auto pb-20">
              {children}
            </div>
          </div>

          <CommandMenu />
          
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              className: 'bg-white border border-slate-200 shadow-lg text-slate-800 rounded-xl',
              descriptionClassName: 'text-slate-500'
            }} 
          />
        </main>

      </body>
    </html>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100/80 hover:text-blue-600 transition-all group active:scale-[0.98]"
    >
      <span className="text-slate-400 group-hover:text-blue-500 transition-colors">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}