'use client';

import { useEffect, useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Loader2 } from 'lucide-react';

const data = [
  { name: 'Sen', value: 1200000 },
  { name: 'Sel', value: 1800000 },
  { name: 'Rab', value: 1400000 },
  { name: 'Kam', value: 2400000 },
  { name: 'Jum', value: 3200000 },
  { name: 'Sab', value: 4500000 },
  { name: 'Min', value: 3800000 },
];

export default function RevenueChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-xl">
        <Loader2 className="animate-spin text-slate-300" size={24} />
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Trend Valuasi Aset</h3>
          <p className="text-xs text-slate-500">Grafik pergerakan nilai stok mingguan.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
            <span className="text-[10px] font-bold px-3 py-1 bg-white rounded shadow-sm text-slate-800">7D</span>
            <span className="text-[10px] font-bold px-3 py-1 text-slate-500">30D</span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              tickFormatter={(value) => `${(value/1000000).toFixed(1)}M`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Valuasi']}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}