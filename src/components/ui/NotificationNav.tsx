'use client';

import { useState } from 'react';
import { Bell, Check, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '@/src/components/providers/NotificationProvider';

export default function NotificationNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead } = useNotification();

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      setTimeout(() => markAsRead(), 1000);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={handleOpen}
        className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all outline-none"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <p className="text-sm font-bold text-slate-800">Notifikasi</p>
                <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full text-slate-600">{notifications.length} Baru</span>
              </div>
              
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    Tidak ada notifikasi baru
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {notifications.map((notif) => (
                      <div key={notif.id} className={`p-4 hover:bg-slate-50 transition-colors flex gap-3 ${!notif.read ? 'bg-blue-50/30' : ''}`}>
                        <div className={`mt-0.5 p-1.5 rounded-full h-fit shrink-0 ${
                          notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                          notif.type === 'alert' ? 'bg-amber-100 text-amber-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {notif.type === 'success' ? <Check size={12} /> : notif.type === 'alert' ? <AlertTriangle size={12} /> : <Info size={12} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="text-xs font-bold text-slate-800">{notif.title}</p>
                            <span className="text-[9px] text-slate-400">{notif.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{notif.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}