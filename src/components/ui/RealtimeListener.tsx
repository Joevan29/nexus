'use client';

import { useEffect } from 'react';
import Pusher from 'pusher-js';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Truck, Package, CheckCircle } from 'lucide-react';

export default function RealtimeListener() {
  const router = useRouter();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_APP_KEY) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap1',
    });

    const channel = pusher.subscribe('map-channel');

    channel.bind('update-data', (data: any) => {
      router.refresh();

      if (data.status === 'in_transit') {
        toast.message('Pengiriman Dimulai', {
          description: data.message || 'Driver sedang menuju lokasi.',
          icon: <Truck className="text-blue-500" size={18} />,
        });
      } 
      else if (data.status === 'delivered') {
        toast.success('Paket Terkirim!', {
          description: data.message || 'Paket telah diterima pelanggan.',
          icon: <CheckCircle className="text-emerald-500" size={18} />,
          duration: 5000,
        });
      }
      else if (data.assignments) {
        toast.info('AI Auto-Assign Selesai', {
          description: `${data.assignments.length} paket telah ditugaskan ke armada.`,
          icon: <Package className="text-indigo-500" size={18} />,
        });
      }
    });

    return () => {
      pusher.unsubscribe('map-channel');
    };
  }, [router]);

  return null;
}