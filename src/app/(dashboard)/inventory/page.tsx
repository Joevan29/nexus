'use client';

import { useState, useEffect } from 'react';
import { 
  Package, Search, Filter, Download, 
  Plus, MoreHorizontal, AlertCircle, Loader2, ImageIcon 
} from 'lucide-react';
import { useDebounce } from 'use-debounce';

interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: string;
  location: string;
  image_url?: string;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  // Fetch Data Function
  const fetchProducts = async (search = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/inventory?search=${search}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load inventory", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Warehouse Inventory</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time stock monitoring database.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={16} /> Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            <Plus size={16} /> New Item
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card-basic p-1.5 flex items-center gap-2 bg-white">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by SKU or Product Name..." 
            className="w-full pl-10 pr-4 py-2.5 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>
        <div className="w-px h-6 bg-slate-200 mx-1"></div>
        <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md text-sm font-medium transition-colors">
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* Data Table */}
      <div className="card-basic overflow-hidden bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2 text-blue-500" />
            <p className="text-sm">Loading inventory data...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No products found matching "{searchTerm}"</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Product Info</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock Level</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.id} className="group hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 overflow-hidden shrink-0">
                          {product.image_url ? (
                            <img 
                              src={product.image_url} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={`${product.image_url ? 'hidden' : 'flex'} w-full h-full items-center justify-center font-bold text-xs`}>
                            {product.name.substring(0, 2).toUpperCase()}
                          </div>
                        </div>
                        
                        <div>
                          <p className="font-bold text-slate-900">{product.name}</p>
                          <p className="text-xs text-slate-500 font-mono">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-md text-xs border border-slate-200 text-slate-600 font-mono">
                        {product.location || 'UNASSIGNED'}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 text-slate-900 font-medium tabular-nums">
                      Rp {Number(product.price).toLocaleString('id-ID')}
                    </td>
                    
                    <td className="px-6 py-4 tabular-nums">
                      <span className="font-bold text-slate-700">{product.stock}</span> <span className="text-slate-400 text-xs">pcs</span>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge stock={product.stock} status={product.status} />
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ stock, status }: { stock: number, status?: string }) {
  if (stock === 0 || status === 'out_of_stock') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
        <AlertCircle size={12} /> Out of Stock
      </span>
    );
  }
  if (stock < 10 || status === 'low_stock') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <AlertCircle size={12} /> Low Stock
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
      Active
    </span>
  );
}