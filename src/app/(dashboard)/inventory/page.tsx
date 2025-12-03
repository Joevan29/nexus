import { query } from '@/src/lib/db'; // Direct DB access (Server Component)
import InventoryActions from '@/src/components/inventory/InventoryActions';
import { Package, AlertCircle, ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import Link from 'next/link';

// Definisi Tipe Data
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

async function getInventory(search: string, page: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/inventory?search=${search}&page=${page}&limit=8`, {
    cache: 'no-store' 
  });
  
  if (!res.ok) return { data: [], meta: { total: 0, totalPages: 0 } };
  return res.json();
}

export default async function InventoryPage(
  props: { searchParams: Promise<{ q?: string; page?: string }> } 
) {
  const searchParams = await props.searchParams;
  const search = searchParams?.q || '';
  const currentPage = Number(searchParams?.page) || 1;

  const { data: products, meta } = await getInventory(search, currentPage);

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Warehouse Inventory</h1>
        <p className="text-slate-500 text-sm mt-1">
          Monitoring {meta.total} item aset dalam gudang secara real-time.
        </p>
      </div>

      <InventoryActions />

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Package className="w-16 h-16 mb-4 text-slate-200" />
            <p className="font-medium text-slate-900">Data tidak ditemukan</p>
            <p className="text-sm">Coba kata kunci lain atau tambahkan stok baru.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Product Info</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Price / Unit</th>
                  <th className="px-6 py-4">Stock Level</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map((product: Product) => (
                  <tr key={product.id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs shrink-0 overflow-hidden">
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
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin size={14} className="text-slate-400" />
                        <span className="font-medium">{product.location || 'UNASSIGNED'}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 font-mono text-slate-600">
                      Rp {Number(product.price).toLocaleString('id-ID')}
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{product.stock}</span>
                        <span className="text-xs text-slate-400">pcs</span>
                      </div>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            product.stock < 10 ? 'bg-rose-500' : 'bg-emerald-500'
                          }`} 
                          style={{ width: `${Math.min(product.stock, 100)}%` }}
                        ></div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge stock={product.stock} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {meta.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <p className="text-xs text-slate-500 font-medium">
              Page {currentPage} of {meta.totalPages}
            </p>
            <div className="flex gap-2">
              <Link
                href={`/inventory?q=${search}&page=${currentPage - 1}`}
                className={`p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors ${currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}`}
              >
                <ArrowLeft size={16} className="text-slate-600" />
              </Link>
              <Link
                href={`/inventory?q=${search}&page=${currentPage + 1}`}
                className={`p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors ${currentPage >= meta.totalPages ? 'pointer-events-none opacity-50' : ''}`}
              >
                <ArrowRight size={16} className="text-slate-600" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wide">
        <AlertCircle size={12} /> Empty
      </span>
    );
  }
  if (stock < 10) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wide">
        <AlertCircle size={12} /> Low Stock
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
      In Stock
    </span>
  );
}