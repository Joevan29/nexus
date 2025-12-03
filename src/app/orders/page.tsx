import { query } from '@/src/lib/db';
import OrderTabs from '@/src/components/orders/OrderTabs';
import { 
  Search, FileText, MapPin, Calendar, MoreHorizontal, 
  ArrowLeft, ArrowRight, Truck, CheckCircle2, Clock 
} from 'lucide-react';
import Link from 'next/link';

async function getOrders(status: string, search: string, page: number) {
  const limit = 10;
  const offset = (page - 1) * limit;
  
  let sql = `
    SELECT s.*, d.name as driver_name 
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
          <p className="text-slate-500 text-sm mt-1">Kelola dan lacak semua pergerakan logistik.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl flex items-center px-3 py-2 shadow-sm w-full sm:w-64">
          <Search size={16} className="text-slate-400 mr-2" />
          <form action="/orders" method="GET" className="flex-1">
             {status !== 'all' && <input type="hidden" name="status" value={status} />}
             <input 
               name="q" 
               defaultValue={search}
               placeholder="Cari Resi / Alamat..." 
               className="w-full text-sm outline-none placeholder:text-slate-400"
             />
          </form>
        </div>
      </div>

      <OrderTabs />

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        {orders.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center text-slate-400">
            <FileText size={48} className="mb-4 text-slate-200" />
            <p className="font-medium text-slate-900">Tidak ada data ditemukan</p>
            <p className="text-xs">Coba ubah filter atau kata kunci pencarian.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Tracking ID</th>
                  <th className="px-6 py-4">Tujuan & Driver</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4 text-right">Biaya</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map((order: any) => (
                  <tr key={order.id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <Link 
                          href={`/orders/${order.tracking_id}`} 
                          className="font-bold text-blue-600 hover:text-blue-800 hover:underline font-mono transition-colors"
                        >
                          {order.tracking_id}
                        </Link>
                        <span className="text-[10px] text-slate-500">{order.origin_address}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="max-w-[200px]">
                        <div className="flex items-start gap-1.5 mb-1">
                           <MapPin size={14} className="text-rose-500 shrink-0 mt-0.5" />
                           <p className="text-slate-700 font-medium truncate">{order.destination_address}</p>
                        </div>
                        {order.driver_name ? (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-5">
                             <Truck size={12} /> {order.driver_name}
                          </div>
                        ) : (
                          <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded ml-5 border border-amber-100">Butuh Driver</span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar size={14} />
                        <span className="text-xs">
                          {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right font-medium text-slate-900">
                      Rp {Number(order.price).toLocaleString('id-ID')}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link href={`/orders/${order.tracking_id}`}>
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <MoreHorizontal size={18} />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
           <p className="text-xs text-slate-500">
              Menampilkan <span className="font-bold">{orders.length}</span> dari {total} pesanan
           </p>
           <div className="flex gap-2">
              <Link 
                href={`/orders?status=${status}&q=${search}&page=${page - 1}`}
                className={`p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors ${page <= 1 ? 'opacity-50 pointer-events-none' : ''}`}
              >
                 <ArrowLeft size={16} className="text-slate-600" />
              </Link>
              <Link 
                href={`/orders?status=${status}&q=${search}&page=${page + 1}`}
                className={`p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors ${page >= totalPages ? 'opacity-50 pointer-events-none' : ''}`}
              >
                 <ArrowRight size={16} className="text-slate-600" />
              </Link>
           </div>
        </div>

      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: "bg-slate-100 text-slate-600 border-slate-200",
    assigned: "bg-blue-50 text-blue-700 border-blue-100",
    in_transit: "bg-amber-50 text-amber-700 border-amber-100",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
  };
  
  const icons: any = {
    pending: Clock,
    assigned: Truck,
    in_transit: Truck,
    delivered: CheckCircle2
  };

  const Icon = icons[status] || Clock;
  const style = styles[status as keyof typeof styles] || styles.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${style}`}>
      <Icon size={12} /> {status.replace('_', ' ')}
    </span>
  );
}