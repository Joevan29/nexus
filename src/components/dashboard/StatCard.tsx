import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

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
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 rounded-lg text-slate-600">
          <Icon size={24} strokeWidth={1.5} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
            trendUp 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
              : 'bg-rose-50 text-rose-700 border-rose-100'
          }`}>
            {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trend}
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mt-1">{title}</p>
        {description && (
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
}