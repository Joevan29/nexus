import { query } from '@/src/lib/db';
import OrderTabs from '@/src/components/orders/OrderTabs';
import OrdersTable from '@/src/components/orders/OrdersTable';
import EmptyState from '@/src/components/ui/EmptyState';
import { Search, FileText, ArrowLeft, ArrowRight, PackageX } from 'lucide-react';
import Link from 'next/link';

async function getOrders(status: string, search: string, page: number) {
  const limit = 10;
  const offset = (page - 1) * limit;
  let sql = `
    SELECT s.*, d.name as driver_name, d.vehicle_type 
    FROM shipments s 
    LEFT JOIN drivers d ON s.driver_id = d.id 
    WHERE (s.tracking_id ILIKE $1 OR s.destination_address ILIKE $1)
  `;
  const params: any[] = [`%${search}%`];
  if (status && status !== 'all') {
    sql += ` AND s.status = $${params.length + 1}`;
    params.push(status);
  }
  sql += ` ORDER BY s.created_at DESC LIMIT ${limit} OFFSET ${offset}`;
  let countSql = `
    SELECT COUNT(*) as total FROM shipments s 
    WHERE (s.tracking_id ILIKE $1 OR s.destination_address ILIKE $1)
  `;
  const countParams = [`%${search}%`];
  if (status && status !== 'all') {
    countSql += ` AND s.status = $${countParams.length + 1}`;
    countParams.push(status);
  }
  const [resData, resCount] = await Promise.all([
    query(sql, params),
    query(countSql, countParams)
  ]);
  return {
    data: resData.rows,
    total: Number(resCount.rows[0].total),
    totalPages: Math.ceil(Number(resCount.rows[0].total) / limit)
  };
}

export default async function OrdersPage(
  props: { searchParams: Promise<{ status?: string, q?: string, page?: string }> } 
) {
  const params = await props.searchParams;
  const status = params.status || 'all';
  const search = params.q || '';
  const page = Number(params.page) || 1;

  const { data: orders, total, totalPages } = await getOrders(status, search, page);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shipment History</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola dan lacak {total} pergerakan logistik.</p>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl flex items-center px-3 py-2 shadow-sm w-full sm:w-72 transition-colors focus-within:ring-2 focus-within:ring-blue-500/20">
          <Search size={16} className="text-slate-400 mr-2" />
          <form action="/orders" method="GET" className="flex-1">
             {status !== 'all' && <input type="hidden" name="status" value={status} />}
             <input 
               name="q" 
               defaultValue={search}
               placeholder="Cari Resi atau Alamat..." 
               className="w-full text-sm outline-none bg-transparent placeholder:text-slate-400 text-slate-900"
             />
          </form>
        </div>
      </div>

      <OrderTabs />

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        
        {orders.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState 
              icon={search ? PackageX : FileText}
              title={search ? "Pencarian Tidak Ditemukan" : "Belum Ada Pesanan"}
              description={search ? `Tidak ada pesanan dengan kata kunci "${search}"` : "Daftar pesanan masih kosong. Buat pesanan baru untuk memulai."}
              action={
                !search && (
                  <Link href="/outbound" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                    Buat Pesanan Baru
                  </Link>
                )
              }
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <OrdersTable orders={orders} />
            
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between mt-auto">
                 <p className="text-xs text-slate-500">
                    Halaman {page} dari {totalPages}
                 </p>
                 <div className="flex gap-2">
                    <Link 
                      href={`/orders?status=${status}&q=${search}&page=${Math.max(1, page - 1)}`}
                      className={`p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors ${page <= 1 ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                       <ArrowLeft size={16} className="text-slate-600" />
                    </Link>
                    <Link 
                      href={`/orders?status=${status}&q=${search}&page=${Math.min(totalPages, page + 1)}`}
                      className={`p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors ${page >= totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                       <ArrowRight size={16} className="text-slate-600" />
                    </Link>
                 </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}