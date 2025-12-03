'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { useEffect, useState } from 'react';
import { Search, Plus, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import FilterPopover from '@/src/components/ui/FilterPopover'; 

export default function InventoryActions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [text, setText] = useState(searchParams.get('q') || '');
  const [query] = useDebounce(text, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('q', query);
      params.set('page', '1');
    } else {
      params.delete('q');
    }
    router.push(`/inventory?${params.toString()}`);
  }, [query, router, searchParams]);

  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Menyiapkan file CSV...',
        success: 'Laporan Inventory berhasil diunduh!',
        error: 'Gagal export data',
      }
    );
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
      <div className="flex gap-2 flex-1 max-w-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Cari SKU, Nama Produk, atau Lokasi..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm dark:text-white dark:placeholder:text-slate-600"
          />
        </div>
        
        <FilterPopover />
      </div>

      <div className="flex gap-2">
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
        >
          <FileSpreadsheet size={16} className="text-emerald-600 dark:text-emerald-500" /> 
          <span className="hidden sm:inline">Export CSV</span>
        </button>
        <Link 
          href="/inbound"
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-lg shadow-slate-900/20 dark:shadow-none"
        >
          <Plus size={16} /> 
          <span className="hidden sm:inline">Stok Baru</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>
    </div>
  );
}