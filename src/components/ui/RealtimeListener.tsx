'use client';

import { useEffect } from 'react';
import Pusher from 'pusher-js';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Truck, Package, CheckCircle, AlertCircle } from 'lucide-react';
import { useNotification } from '@/src/components/providers/NotificationProvider';

export default function RealtimeListener() {
  const router = useRouter();
  const { addNotification } = useNotification();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_APP_KEY) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap1',
    });

    const channel = pusher.subscribe('map-channel');

    channel.bind('update-data', (data: any) => {
      router.refresh();

      if (data.status === 'in_transit') {
        const msg = data.message || 'Driver sedang menuju lokasi.';
        toast.message('Pengiriman Dimulai', { description: msg, icon: <Truck className="text-blue-500" size={18} /> });
        
        addNotification({ title: 'Pengiriman Jalan', message: msg, type: 'info' });
      } 
      else if (data.status === 'delivered') {
        const msg = data.message || 'Paket telah diterima pelanggan.';
        toast.success('Paket Terkirim!', { description: msg, icon: <CheckCircle className="text-emerald-500" size={18} /> });
        
        addNotification({ title: 'Sukses Terkirim', message: msg, type: 'success' });
      }
      else if (data.assignments) {
        const msg = `${data.assignments.length} paket telah ditugaskan.`;
        toast.info('AI Auto-Assign', { description: msg, icon: <Package className="text-indigo-500" size={18} /> });
        
        addNotification({ title: 'AI Dispatcher', message: msg, type: 'alert' });
      }
    });

    return () => {
      pusher.unsubscribe('map-channel');
    };
  }, [router, addNotification]);

  return null;
}