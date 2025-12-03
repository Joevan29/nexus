'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, Printer, Archive, MoreHorizontal, CheckSquare, 
  Square, MapPin, Box, DollarSign, Activity, Edit 
} from 'lucide-react';
import { toast } from 'sonner';
import DetailPanel from '@/src/components/ui/DetailPanel';

interface Product {
  id: number;
  sku: string;
  name: string;
  stock: number;
  price: number;
  location: string;
  status: string;
  category?: string;
}

export default function InventoryTable({ products }: { products: Product[] }) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map(p => p.id));
    }
  };

  const handleBulkAction = (action: string) => {
    toast.success(`${action} pada ${selectedIds.length} item berhasil!`);
    setSelectedIds([]);
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4 w-10">
                <button onClick={toggleAll} className="text-slate-400 hover:text-slate-600 transition-colors">
                  {selectedIds.length === products.length && products.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
                </button>
              </th>
              <th className="px-6 py-4">Product Info</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-100 bg-white">
            {products.map((product) => {
              const isSelected = selectedIds.includes(product.id);
              return (
                <tr 
                  key={product.id} 
                  onClick={() => setSelectedItem(product)} 
                  className={`group transition-colors cursor-pointer ${
                    isSelected 
                      ? 'bg-blue-50' 
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="px-6 py-4">
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        toggleSelect(product.id); 
                      }} 
                      className={`${isSelected ? 'text-blue-600' : 'text-slate-300 group-hover:text-slate-400'}`}
                    >
                      {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                    </button>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs shrink-0">
                          {product.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{product.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded w-fit mt-1">
                          {product.sku}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-slate-400" /> 
                      <span className="font-medium">{product.location || 'UNASSIGNED'}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 font-mono">{product.stock}</span>
                      <span className="text-xs text-slate-400">unit</span>
                    </div>
                    <div className="w-20 h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            product.stock === 0 ? 'bg-rose-500' : 
                            product.stock < 10 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(product.stock, 100)}%` }}
                        />
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation(); }}
                      className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-all"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <DetailPanel 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        title="Detail Produk"
        onEdit={() => toast.info(`Edit mode: ${selectedItem?.sku}`)}
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center text-2xl font-bold text-slate-300 border border-slate-200 shadow-sm">
                {selectedItem.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-lg text-slate-900 leading-tight">{selectedItem.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600">
                    {selectedItem.sku}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    selectedItem.stock > 0 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                      : 'bg-rose-50 text-rose-700 border border-rose-100'
                  }`}>
                    {selectedItem.stock > 0 ? 'Active' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 border border-slate-100 rounded-xl bg-white shadow-sm">
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-1 font-medium uppercase tracking-wide">
                  <Box size={12} /> Total Stok
                </p>
                <p className="font-bold text-2xl text-slate-900">{selectedItem.stock}</p>
              </div>
              <div className="p-4 border border-slate-100 rounded-xl bg-white shadow-sm">
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-1 font-medium uppercase tracking-wide">
                  <DollarSign size={12} /> Harga Jual
                </p>
                <p className="font-bold text-2xl text-emerald-600 tracking-tight">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(selectedItem.price)}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h5 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Informasi Logistik</h5>
              
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500 flex items-center gap-2"><MapPin size={14}/> Lokasi Gudang</span>
                <span className="text-sm font-medium text-slate-900">{selectedItem.location || "-"}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500 flex items-center gap-2"><Activity size={14}/> Status Sistem</span>
                <span className="text-sm font-medium text-slate-900">Sync Active</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500 flex items-center gap-2"><Edit size={14}/> Terakhir Diupdate</span>
                <span className="text-sm font-medium text-slate-900">Hari ini, 10:30</span>
              </div>
            </div>
          </div>
        )}
      </DetailPanel>

      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 z-50 border border-slate-700/50 backdrop-blur-md"
          >
            <span className="text-sm font-bold border-r border-slate-700 pr-6 mr-2">
              {selectedIds.length} item terpilih
            </span>
            
            <div className="flex items-center gap-2">
              <button onClick={() => handleBulkAction('Arsipkan')} className="p-2 hover:bg-slate-700 rounded-lg transition-colors tooltip" title="Arsipkan">
                <Archive size={18} />
              </button>
              <button onClick={() => handleBulkAction('Cetak Label')} className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="Cetak Label">
                <Printer size={18} />
              </button>
              <button onClick={() => handleBulkAction('Hapus')} className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-red-200 transition-colors" title="Hapus">
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}