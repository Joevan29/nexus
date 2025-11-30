'use client';

import { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';

export default function RevenueChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/analytics/revenue');
      
      if (!res.ok) throw new Error("Gagal mengambil data");
      
      const json = await res.json();

      if (Array.isArray(json)) {
        setData(json);
      } else {
        console.error("Format data salah:", json);
        setData([]);
      }
    } catch (e) {
      console.error(e);
      setError(true);
      setData([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-xl">
        <Loader2 className="animate-spin text-slate-300 mb-2" size={24} />
        <p className="text-xs text-slate-400">Memuat analitik...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-xl text-rose-500">
        <AlertCircle size={24} className="mb-2" />
        <p className="text-xs font-bold">Gagal memuat grafik</p>
        <button onClick={fetchData} className="mt-2 text-[10px] underline hover:text-rose-700">
          Coba lagi
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col bg-white rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Trend Nilai Pengiriman</h3>
          <p className="text-xs text-slate-500">Total nilai barang terkirim (7 Hari Terakhir).</p>
        </div>
        <button onClick={fetchData} className="p-2 hover:bg-slate-50 rounded-full transition-colors group">
            <RefreshCw size={14} className="text-slate-400 group-hover:text-blue-500" />
        </button>
      </div>

      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11 }} 
              tickFormatter={(value) => `${(value/1000000).toFixed(0)}M`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
              formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Total Nilai']}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorValue)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}