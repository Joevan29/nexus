import { LucideIcon, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: LucideIcon;
  description?: string;
}

export default function StatCard({ 
  title, 
  value, 
  trend, 
  trendUp, 
  icon: Icon,
  description 
}: StatCardProps) {
  return (
    <div className="card-premium p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity transform group-hover:scale-110 duration-500">
        <Icon size={80} />
      </div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shadow-sm">
          <Icon size={22} strokeWidth={2} />
        </div>
        
        {trend && (
          <div className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
            trendUp 
              ? 'bg-emerald-50/50 text-emerald-700 border-emerald-100 group-hover:bg-emerald-100' 
              : 'bg-rose-50/50 text-rose-700 border-rose-100 group-hover:bg-rose-100'
          }`}>
            {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend}
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          {value}
        </h3>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
          {title}
        </p>
        {description && (
          <p className="text-xs text-slate-500 mt-3 leading-relaxed line-clamp-2 border-t border-slate-50 pt-3 opacity-80 group-hover:opacity-100 transition-opacity">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}