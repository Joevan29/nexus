import { cn } from "@/src/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200/80", className)}
      {...props}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-36 flex flex-col justify-between">
            <div className="flex justify-between">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-4 h-[400px]">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
        <div className="space-y-6">
          <Skeleton className="w-full h-40 rounded-xl bg-slate-800/10" />
          <div className="bg-white border border-slate-200 rounded-xl h-[200px] p-4 space-y-4">
             <Skeleton className="h-5 w-32 mb-4" />
             <div className="space-y-3">
               {[...Array(3)].map((_, i) => (
                 <div key={i} className="flex gap-3">
                   <Skeleton className="h-8 w-8 rounded-full" />
                   <div className="space-y-1 flex-1">
                     <Skeleton className="h-3 w-full" />
                     <Skeleton className="h-2 w-1/2" />
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}