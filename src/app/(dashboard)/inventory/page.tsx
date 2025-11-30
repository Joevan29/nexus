import { 
  Package, Search, Filter, Download, 
  Plus, MoreHorizontal, AlertCircle 
} from 'lucide-react';

const products = [
  { id: 1, name: "Premium Arabica Coffee", sku: "K-001-ARA", stock: 45, category: "Beverage", status: "In Stock", price: "Rp 150.000" },
  { id: 2, name: "Robusta Gold Blend", sku: "K-002-ROB", stock: 8, category: "Beverage", status: "Low Stock", price: "Rp 120.000" },
  { id: 3, name: "Vanilla Syrup 1L", sku: "S-005-VAN", stock: 0, category: "Add-on", status: "Out of Stock", price: "Rp 85.000" },
  { id: 4, name: "Paper Cup 12oz", sku: "P-102-CUP", stock: 500, category: "Packaging", status: "In Stock", price: "Rp 1.200" },
];

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage products, stock levels, and warehouse organization.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      <div className="card-basic p-1.5 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by SKU, Name, or Category..." 
            className="w-full pl-10 pr-4 py-2.5 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>
        <div className="w-px h-6 bg-slate-200 mx-1"></div>
        <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md text-sm font-medium transition-colors">
          <Filter size={16} /> Filters
        </button>
      </div>

      <div className="card-basic overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock Level</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product.id} className="group table-row-hover">
                <td className="px-6 py-4 font-medium text-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                      <Package size={16} />
                    </div>
                    {product.name}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 font-mono">{product.sku}</td>
                <td className="px-6 py-4 text-slate-600">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-900">{product.price}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={product.status} stock={product.stock} />
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
    </div>
  );
}

function StatusBadge({ status, stock }: { status: string, stock: number }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-100">
        <AlertCircle size={12} /> Out of Stock
      </span>
    );
  }
  if (stock < 10) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
        <AlertCircle size={12} /> Low Stock ({stock})
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
      {stock} Units Available
    </span>
  );
}