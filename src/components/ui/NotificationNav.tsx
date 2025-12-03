'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Check, Info, AlertTriangle, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification, NotificationItem } from '@/src/components/providers/NotificationProvider';
import { toast } from 'sonner';

export default function NotificationNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, addNotification } = useNotification(); 
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      setTimeout(() => markAsRead(), 1000);
    }
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    toast(notif.title, {
      description: notif.message,
      icon: notif.type === 'success' ? <Check size={16} className="text-emerald-600"/> : <Info size={16} className="text-blue-600"/>
    });
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Trigger Button */}
      <button 
        onClick={handleOpen}
        className="relative p-2 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all outline-none focus:ring-2 focus:ring-blue-500/20"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-950 animate-pulse shadow-sm"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96, transformOrigin: 'top right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden flex flex-col"
          >
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Notifikasi</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full">
                    {unreadCount} Baru
                  </span>
                )}
              </div>
              {notifications.length > 0 && (
                <button 
                  className="text-[10px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex items-center gap-1"
                  onClick={() => markAsRead()}
                >
                  Tandai Dibaca <Check size={12} />
                </button>
              )}
            </div>
            
            <div className="max-h-[320px] overflow-y-auto custom-scrollbar overscroll-contain">
              {notifications.length === 0 ? (
                <div className="py-12 px-8 text-center flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                    <Bell size={20} className="opacity-40" />
                  </div>
                  <p className="text-xs font-medium">Belum ada notifikasi baru</p>
                  <p className="text-[10px] opacity-70 mt-1">Aktivitas sistem akan muncul di sini.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {notifications.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 active:bg-slate-100 dark:active:bg-slate-800 transition-colors flex gap-3 group relative ${
                        !notif.read ? 'bg-blue-50/40 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      {!notif.read && (
                        <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-blue-500 rounded-r-full"></div>
                      )}

                      {/* Icon Type */}
                      <div className={`mt-0.5 p-2 rounded-xl h-fit shrink-0 shadow-sm border ${
                        notif.type === 'success' 
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-900/30 dark:text-emerald-400' 
                          : notif.type === 'alert' 
                          ? 'bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-900/20 dark:border-amber-900/30 dark:text-amber-400'
                          : 'bg-blue-50 border-blue-100 text-blue-600 dark:bg-blue-900/20 dark:border-blue-900/30 dark:text-blue-400'
                      }`}>
                        {notif.type === 'success' ? <Check size={14} strokeWidth={2.5} /> : 
                         notif.type === 'alert' ? <AlertTriangle size={14} strokeWidth={2.5} /> : 
                         <Info size={14} strokeWidth={2.5} />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-0.5">
                          <p className={`text-xs font-bold truncate pr-2 ${!notif.read ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'}`}>
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap font-mono shrink-0">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                          {notif.message}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="p-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-center">
                 <button className="text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors w-full py-1">
                    Lihat Semua Aktivitas
                 </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}