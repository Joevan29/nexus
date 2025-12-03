'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Printer, Archive, MoreHorizontal, CheckSquare, Square, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: number;
  sku: string;
  name: string;
  stock: number;
  price: number;
  location: string;
  status: string;
}

export default function InventoryTable({ products }: { products: Product[] }) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

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
          <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4 w-10">
                <button onClick={toggleAll} className="text-slate-400 hover:text-slate-600">
                  {selectedIds.length === products.length && products.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
                </button>
              </th>
              <th className="px-6 py-4">Product Info</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {products.map((product) => {
              const isSelected = selectedIds.includes(product.id);
              return (
                <tr 
                  key={product.id} 
                  className={`group transition-colors ${isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50/80'}`}
                >
                  <td className="px-6 py-4">
                    <button onClick={() => toggleSelect(product.id)} className={`${isSelected ? 'text-blue-600' : 'text-slate-300 group-hover:text-slate-400'}`}>
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
                      <MapPin size={14} className="text-slate-400" /> {product.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-medium text-slate-700">
                    {product.stock} pcs
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-all">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 z-50 border border-slate-700/50 backdrop-blur-md"
          >
            <span className="text-sm font-bold border-r border-slate-700 pr-6 mr-2">
              {selectedIds.length} terpilih
            </span>
            
            <div className="flex items-center gap-2">
              <button onClick={() => handleBulkAction('Arsipkan')} className="p-2 hover:bg-slate-700 rounded-lg tooltip" title="Arsipkan">
                <Archive size={18} />
              </button>
              <button onClick={() => handleBulkAction('Cetak Label')} className="p-2 hover:bg-slate-700 rounded-lg" title="Cetak Label">
                <Printer size={18} />
              </button>
              <button onClick={() => handleBulkAction('Hapus')} className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-red-200" title="Hapus Permanen">
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}