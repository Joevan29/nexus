import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center p-4">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <FileQuestion size={40} className="text-slate-400" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900">Halaman Tidak Ditemukan</h2>
      <p className="text-slate-500 mt-2 mb-8 max-w-sm">
        Maaf Commander, koordinat yang Anda tuju tidak ada dalam peta sistem kami.
      </p>
      <Link 
        href="/"
        className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
      >
        Kembali ke Markas
      </Link>
    </div>
  );
}