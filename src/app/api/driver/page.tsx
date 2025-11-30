'use client';

import { useState, useEffect } from 'react';
import { Truck, MapPin, Box, CheckCircle, Navigation, RefreshCw, QrCode, X, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { Scanner } from '@yudiel/react-qr-scanner';

interface Task {
  id: number;
  tracking_id: string;
  destination_address: string;
  status: string;
  weight: number;
  price: number;
  driver_id: number;
}

interface DriverProfile {
  id: number;
  name: string;
  vehicle_type: string;
}

export default function DriverApp() {
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);
  const [drivers, setDrivers] = useState<DriverProfile[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false); 

  useEffect(() => {
    fetch('/api/logistics/drivers').then(res => res.json()).then(setDrivers);
  }, []);

  const fetchTasks = async (driverId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/logistics/shipments`); 
      const allShipments = await res.json();
      
      const myTasks = allShipments.filter((s: Task) => 
        s.driver_id === driverId && s.status !== 'delivered'
      );
      setTasks(myTasks);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat tugas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDriver) fetchTasks(selectedDriver);
  }, [selectedDriver]);

  // 3. Handle Update Status
  const updateStatus = async (shipmentId: number, newStatus: 'in_transit' | 'delivered') => {
    setTasks(prev => prev.map(t => t.id === shipmentId ? { ...t, status: newStatus } : t));
    
    try {
       await fetch('/api/driver/update', {
         method: 'POST',
         body: JSON.stringify({
           driverId: selectedDriver,
           shipmentId,
           status: newStatus,
           latitude: -6.2000 + (Math.random() * 0.01),
           longitude: 106.8166 + (Math.random() * 0.01)
         })
       });
       
       toast.success(newStatus === 'in_transit' ? 'Pengiriman Dimulai!' : 'Paket Selesai!');
       
       if(newStatus === 'delivered') {
          setTimeout(() => setTasks(prev => prev.filter(t => t.id !== shipmentId)), 1000);
       }
    } catch (err) {
       toast.error("Gagal menghubungi server");
       fetchTasks(selectedDriver!); 
    }
  };

  const handleScan = (text: string) => {
      if (text) {
          try {
              const data = JSON.parse(text);
              
              const targetTask = tasks.find(t => t.tracking_id === data.id);
              
              if (targetTask) {
                  updateStatus(targetTask.id, 'in_transit');
                  setIsScanning(false);
                  toast.success(`QR Valid! Paket ${data.id} diterima.`);
              } else {
                  if(!toast.getHistory().length) toast.error("Paket tidak ditemukan di daftar tugas Anda.");
              }
          } catch (e) {
              console.log("QR Format Invalid");
          }
      }
  };

  if (!selectedDriver) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white">
        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-600/50 animate-bounce">
          <Truck size={40} />
        </div>
        <h1 className="text-3xl font-bold mb-2 tracking-tight">NEXUS Driver</h1>
        <p className="text-slate-400 mb-8 text-center text-sm">Pilih akun untuk memulai simulasi</p>
        
        <div className="w-full max-w-sm space-y-3">
          {drivers.map(d => (
            <button 
              key={d.id}
              onClick={() => setSelectedDriver(d.id)}
              className="w-full p-4 bg-slate-800 hover:bg-slate-700 hover:scale-[1.02] rounded-xl flex items-center justify-between border border-slate-700 transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {d.name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-200">{d.name}</p>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{d.vehicle_type}</p>
                </div>
              </div>
              <Navigation size={18} className="text-slate-600 group-hover:text-blue-400" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-20 max-w-md mx-auto border-x border-slate-200 shadow-2xl relative overflow-hidden">
      
      {isScanning && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col max-w-md mx-auto">
            <div className="p-4 flex justify-between items-center text-white bg-black/50 absolute top-0 w-full z-10 backdrop-blur-sm">
                <h3 className="font-bold text-lg">Scan Handover</h3>
                <button onClick={() => setIsScanning(false)} className="p-2 bg-white/10 rounded-full"><X size={20} /></button>
            </div>
            <div className="flex-1 relative">
                <Scanner 
                    onScan={(result) => {
                        if (result[0]?.rawValue) handleScan(result[0].rawValue);
                    }}
                    components={{ audio: false, torch: true }}
                    styles={{ container: { width: '100%', height: '100%' } }}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="w-64 h-64 border-2 border-blue-500 rounded-xl bg-blue-500/10 relative">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-blue-500 -mt-1 -ml-1"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-blue-500 -mt-1 -mr-1"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-blue-500 -mb-1 -ml-1"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-blue-500 -mb-1 -mr-1"></div>
                   </div>
                </div>
            </div>
            <div className="p-6 bg-black text-center">
                <p className="text-white font-bold mb-1">Arahkan ke QR Code Paket</p>
                <p className="text-white/50 text-xs">Otomatis mengubah status ke "In Transit"</p>
            </div>
        </div>
      )}

      <div className="bg-slate-900 text-white p-6 pb-12 rounded-b-[2.5rem] shadow-xl z-10 relative">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold shadow-lg shadow-blue-600/40">
                {drivers.find(d => d.id === selectedDriver)?.name.charAt(0)}
             </div>
             <div>
                <h2 className="text-sm font-bold text-slate-200">Selamat Bertugas,</h2>
                <p className="text-lg font-bold leading-none">{drivers.find(d => d.id === selectedDriver)?.name}</p>
             </div>
          </div>
          <button onClick={() => setSelectedDriver(null)} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-red-500/20 hover:text-red-400 transition-colors">
             <LogOut size={18} />
          </button>
        </div>
        
        <div className="flex gap-3">
           <div className="flex-1 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-md">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Sisa Tugas</p>
              <p className="text-3xl font-bold">{tasks.length}</p>
           </div>
           <div className="flex-1 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-md">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Status GPS</p>
              <p className="text-sm font-bold text-emerald-400 flex items-center gap-2 mt-2">
                 <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#34d399]"></span>
                 ONLINE
              </p>
           </div>
        </div>
      </div>

      <div className="px-4 -mt-6 relative z-20 space-y-4">
        
        <div className="flex justify-between items-center px-2">
           <h3 className="font-bold text-slate-700 text-sm">Daftar Pengiriman</h3>
           
           <div className="flex gap-2">
             <button 
                onClick={() => setIsScanning(true)} 
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold shadow-lg shadow-slate-900/20 active:scale-95 transition-all hover:bg-slate-800"
             >
               <QrCode size={16} /> Scan QR
             </button>
             <button 
               onClick={() => fetchTasks(selectedDriver)} 
               className="p-2 bg-white rounded-full shadow-sm text-slate-600 border border-slate-200 hover:bg-slate-50"
             >
               <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
             </button>
           </div>
        </div>

        {tasks.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-slate-100 flex flex-col items-center gap-4 mt-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
               <Box size={32} className="text-slate-300" />
            </div>
            <div>
               <p className="font-bold text-slate-800">Tidak ada tugas aktif</p>
               <p className="text-xs text-slate-400 mt-1">Istirahatlah sejenak sambil menunggu order.</p>
            </div>
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
              <div className={`absolute top-0 left-0 w-2 h-full ${task.status === 'in_transit' ? 'bg-blue-500' : 'bg-slate-200'}`} />
              
              <div className="pl-4">
                 <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase tracking-widest">
                       {task.tracking_id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                       task.status === 'in_transit' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'
                    }`}>
                       {task.status.replace('_', ' ')}
                    </span>
                 </div>

                 <h4 className="font-bold text-slate-800 text-lg leading-tight mb-4">{task.destination_address}</h4>

                 <div className="flex gap-4 text-xs text-slate-500 mb-5 pb-4 border-b border-slate-50">
                    <span className="flex items-center gap-1.5 font-medium"><Box size={14}/> {task.weight} kg</span>
                    <span className="flex items-center gap-1.5 font-medium">Rp {task.price.toLocaleString()}</span>
                 </div>

                 {task.status === 'pending' || task.status === 'assigned' ? (
                    <button 
                      onClick={() => updateStatus(task.id, 'in_transit')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <Navigation size={18} /> Mulai Jalan (Manual)
                    </button>
                  ) : (
                    <button 
                      onClick={() => updateStatus(task.id, 'delivered')}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} /> Selesaikan Order
                    </button>
                  )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur p-2 text-center text-[10px] text-slate-400 border-t border-slate-200 z-50">
         NEXUS Driver System v2.1 • GPS Emulated
      </div>
    </div>
  );
}