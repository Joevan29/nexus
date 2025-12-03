'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Box, Truck, Users, Settings, Package2 } from "lucide-react";
import { motion } from 'framer-motion';

const menuItems = [
  { group: "Main Menu", items: [{ href: "/", icon: LayoutDashboard, label: "Overview" }] },
  { group: "Inventory", items: [
      { href: "/inventory", icon: Box, label: "Warehouse Data" },
      { href: "/inbound", icon: Box, label: "Inbound Stock", rotate: 180 }
    ] 
  },
  { group: "Logistics", items: [
      { href: "/fleet", icon: Truck, label: "Fleet Map" },
      { href: "/drivers", icon: Users, label: "Driver Team" }
    ] 
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col z-30 h-full shrink-0">
      
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100 shrink-0">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm shadow-blue-600/20">
          <Package2 size={20} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight text-slate-900 leading-none">NEXUS</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Enterprise</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar">
        {menuItems.map((section, idx) => (
          <div key={idx}>
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider opacity-80">
              {section.group}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                      isActive ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="active-nav"
                        className="absolute left-0 w-1 h-5 bg-blue-600 rounded-r-full"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      />
                    )}
                    <item.icon 
                      size={18} 
                      className={`transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} ${item.rotate ? 'rotate-180' : ''}`} 
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 shrink-0">
        <Link href="/settings" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group">
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
  );
}