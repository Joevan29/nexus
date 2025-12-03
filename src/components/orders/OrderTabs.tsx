'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Package, Truck, CheckCircle2, Clock } from 'lucide-react';

const tabs = [
  { id: 'all', label: 'Semua Order', icon: Package },
  { id: 'pending', label: 'Menunggu', icon: Clock },
  { id: 'in_transit', label: 'Sedang Jalan', icon: Truck },
  { id: 'delivered', label: 'Selesai', icon: CheckCircle2 },
];

export default function OrderTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('status') || 'all';

  const handleTabChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status === 'all') params.delete('status');
    else params.set('status', status);
    
    params.set('page', '1'); 
    router.push(`/orders?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${
              isActive 
                ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/20' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <Icon size={16} className={isActive ? 'text-blue-400' : 'text-slate-400'} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}