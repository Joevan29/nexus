'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Box, Truck, Users, Package2, LifeBuoy, FileText } from "lucide-react";
import { motion } from 'framer-motion';

const menuItems = [
  { group: "Main Menu", items: [{ href: "/", icon: LayoutDashboard, label: "Overview" }] },
  { group: "Operations", items: [
      { href: "/inventory", icon: Box, label: "Inventory" },
      { href: "/orders", icon: FileText, label: "Shipments" },
      { href: "/inbound", icon: Box, label: "Inbound Stock", rotate: 180 },
      { href: "/outbound", icon: Truck, label: "Create Order" },
      { href: "/fleet", icon: Truck, label: "Fleet Command" },
      { href: "/drivers", icon: Users, label: "Personnel" }
    ] 
  },
];

export default function Sidebar({ mobile }: { mobile?: boolean }) {
  const pathname = usePathname();

  const baseClass = mobile 
    ? "w-full h-full bg-white flex flex-col" 
    : "hidden md:flex w-64 bg-white border-r border-slate-200 flex-col z-30 h-full shrink-0";

  return (
    <aside className={baseClass}>
      
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100 shrink-0">
        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
          <Package2 size={18} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight text-slate-900 leading-none">NEXUS</h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Logistics</p>
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
                      isActive 
                        ? 'text-slate-900 bg-slate-100 shadow-sm' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="active-nav"
                        className="absolute left-0 w-1 h-5 bg-slate-900 rounded-r-full"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      />
                    )}
                    <item.icon 
                      size={18} 
                      className={`transition-colors ${isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'} ${item.rotate ? 'rotate-180' : ''}`} 
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
        <button className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors">
          <LifeBuoy size={18} />
          <span>Help & Support</span>
        </button>
      </div>
    </aside>
  );
}