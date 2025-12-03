'use client';

import { useState, useEffect } from 'react';
import { Truck, MapPin, Package, Trash2, CheckCircle2, Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  sku: string;
  stock: number;
  price: number;
}

interface CartItem extends Product {
  qty: number;
}

export default function OutboundPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [destination, setDestination] = useState('');
  const [coords] = useState({ lat: -6.200000 + (Math.random() * 0.05), lng: 106.816666 + (Math.random() * 0.05) });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/inventory?limit=100');
        const json = await res.json();
        setProducts(json.data || []);
      } catch (e) {
        toast.error("Gagal memuat produk gudang");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (productId: string) => {
    const product = products.find(p => p.id.toString() === productId);
    if (!product) return;

    if (cart.find(c => c.id === product.id)) {
      toast.warning("Produk ini sudah ada di daftar kirim");
      return;
    }
    setCart([...cart, { ...product, qty: 1 }]);
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, Math.min(item.qty + delta, item.stock));
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const handleSubmit = async () => {
    if (!destination || cart.length === 0) {
      toast.error("Mohon lengkapi tujuan dan pilih barang");
      return;
    }

    setIsSubmitting(true);
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const totalWeight = cart.reduce((sum, item) => sum + item.qty, 0) * 1.5;

    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        body: JSON.stringify({
          items: cart,
          destination,
          lat: coords.lat,
          lng: coords.lng,
          totalPrice,
          totalWeight
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Gagal membuat order");

      toast.success(`Shipment Created: ${data.shipment.tracking_id}`, {
        description: "Stok gudang telah dikurangi otomatis.",
        duration: 5000,
        icon: <Truck className="text-emerald-500" />
      });
      
      setCart([]);
      setDestination('');
      router.refresh(); 
      
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-500/30">
            <Truck size={24} />
          </div>
          Create Shipment
        </h1>
        <p className="text-slate-500 text-sm mt-1 ml-14">Buat pesanan pengiriman baru & alokasikan stok.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          
          <div className="card-premium p-6 bg-white">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Package size={18} className="text-blue-600" /> Pilih Barang
            </h3>
            
            <div className="flex gap-2 mb-6">
              <select 
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                onChange={(e) => addToCart(e.target.value)}
                defaultValue=""
                disabled={loading}
              >
                <option value="" disabled>
                  {loading ? "Memuat stok gudang..." : "-- Pilih Produk dari Gudang --"}
                </option>
                {products.map(p => (
                  <option key={p.id} value={p.id} disabled={p.stock <= 0} className={p.stock <= 0 ? 'text-rose-400' : ''}>
                    {p.sku} — {p.name} (Sisa: {p.stock})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm bg-slate-50/50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center">
                  <Package size={32} className="mb-2 opacity-20" />
                  Belum ada barang dipilih
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-blue-200 transition-colors">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-700">{item.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono">{item.sku}</span>
                        <span className="text-[10px] text-slate-400">@ Rp {item.price.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 h-8">
                        <button onClick={() => updateQty(item.id, -1)} className="px-2.5 h-full text-slate-500 hover:bg-slate-200 rounded-l-lg transition-colors font-bold">-</button>
                        <span className="px-2 text-sm font-bold w-8 text-center tabular-nums">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="px-2.5 h-full text-slate-500 hover:bg-slate-200 rounded-r-lg transition-colors font-bold">+</button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card-premium p-6 bg-white">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-rose-500" /> Lokasi Tujuan
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Alamat Penerima</label>
                <input 
                  type="text" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Contoh: Grand Indonesia, Jakarta Pusat..."
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
              
              <div className="p-3 bg-blue-50/50 text-blue-700 text-xs rounded-lg flex items-start gap-2 border border-blue-100">
                <Info size={14} className="mt-0.5 shrink-0" /> 
                <span>
                  Dalam mode demo, koordinat GPS tujuan akan di-generate otomatis di sekitar Jakarta Pusat ({coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}).
                </span>
              </div>
            </div>
          </div>

        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-2xl shadow-slate-900/20 sticky top-6">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              Ringkasan Order
            </h3>
            
            <div className="space-y-4 mb-8 border-b border-slate-700/50 pb-8">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Item</span>
                <span className="font-bold">{cart.reduce((a, b) => a + b.qty, 0)} unit</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Berat (Est.)</span>
                <span className="font-bold">{(cart.reduce((a, b) => a + b.qty, 0) * 1.5).toFixed(1)} kg</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Subtotal Barang</span>
                <span className="font-bold font-mono">Rp {cart.reduce((a, b) => a + (b.price * b.qty), 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <span className="text-sm text-slate-400 font-medium">Total Estimasi</span>
              <span className="text-2xl font-bold text-emerald-400 font-mono tracking-tight">
                Rp {cart.reduce((a, b) => a + (b.price * b.qty), 0).toLocaleString()}
              </span>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || cart.length === 0 || !destination}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 group"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : (
                <>Proses Pengiriman <CheckCircle2 size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}