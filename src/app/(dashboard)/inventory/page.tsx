import InventoryActions from '@/src/components/inventory/InventoryActions';
import InventoryTable from '@/src/components/inventory/InventoryTable';
import EmptyState from '@/src/components/ui/EmptyState';
import { Package, XCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: number;
  sku: string;
  name: string;
  category?: string;
  stock: number;
  price: number;
  status: string;
  location: string;
  image_url?: string;
}

interface InventoryResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

async function getInventory(search: string, page: number): Promise<InventoryResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/inventory?search=${search}&page=${page}&limit=8`, {
      cache: 'no-store',
    });
    if (!res.ok) return { data: [], meta: { total: 0, page: 1, totalPages: 0, limit: 8 } };
    return await res.json();
  } catch (error) {
    return { data: [], meta: { total: 0, page: 1, totalPages: 0, limit: 8 } };
  }
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
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Warehouse Inventory
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Monitoring {meta.total} item aset dalam gudang secara real-time.
          </p>
        </div>
      </div>

      <InventoryActions />

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        
        {products.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState 
              icon={search ? XCircle : Package}
              title={search ? "Tidak ada hasil pencarian" : "Inventory Kosong"}
              description={
                search 
                  ? `Tidak ditemukan produk dengan kata kunci "${search}".` 
                  : "Belum ada data stok di gudang saat ini."
              }
              action={
                !search && (
                  <Link 
                    href="/inbound" 
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20"
                  >
                    + Tambah Stok Awal
                  </Link>
                )
              }
            />
          </div>
        ) : (
          <>
            <div className="flex-1">
              <InventoryTable products={products} />
            </div>

            {meta.totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                <p className="text-xs text-slate-500 font-medium">
                  Halaman {currentPage} dari {meta.totalPages}
                </p>
                
                <div className="flex gap-2">
                  <Link
                    href={`/inventory?q=${search}&page=${Math.max(1, currentPage - 1)}`}
                    className={`p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-slate-600 ${
                      currentPage <= 1 ? 'pointer-events-none opacity-50' : ''
                    }`}
                  >
                    <ArrowLeft size={16} />
                  </Link>
                  <Link
                    href={`/inventory?q=${search}&page=${Math.min(meta.totalPages, currentPage + 1)}`}
                    className={`p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-slate-600 ${
                      currentPage >= meta.totalPages ? 'pointer-events-none opacity-50' : ''
                    }`}
                  >
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}