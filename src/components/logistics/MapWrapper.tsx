'use client';

import dynamic from 'next/dynamic';

const LogisticsMap = dynamic(() => import('./Map'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 border border-slate-200 rounded-xl">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
      <p className="text-sm font-medium animate-pulse">Menghubungkan ke Satelit GPS...</p>
    </div>
  )
});

export default function MapWrapper() {
  return <LogisticsMap />;
}