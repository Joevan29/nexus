'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Box, Truck, Users, Settings, Package2, LogOut } from "lucide-react";
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
    <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200 flex flex-col z-30 h-full">
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100/50 shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <Package2 size={20} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight text-slate-900 leading-none font-sans">NEXUS</h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Enterprise</p>
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
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                      isActive ? 'text-blue-600 bg-blue-50/80' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="active-nav"
                        className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full"
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
        <Link href="/settings" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shadow-sm">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-700 truncate group-hover:text-blue-700 transition-colors">Admin User</p>
            <p className="text-[10px] text-slate-500 truncate font-medium">Head of Logistics</p>
          </div>
          <Settings size={16} className="text-slate-400 group-hover:text-slate-600 group-hover:rotate-45 transition-all duration-300" />
        </Link>
      </div>
    </aside>
  );
}