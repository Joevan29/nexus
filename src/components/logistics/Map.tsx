"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Pusher from 'pusher-js';
import { QrCode, Truck, Package } from 'lucide-react'; 
import QRPopup from './QRPopup';
import { Driver, Shipment } from '@/src/types';

const getDriverColor = (id: number) => {
  const colors = ['#2563eb', '#dc2626', '#16a34a', '#d97706', '#9333ea', '#db2777'];
  return colors[id % colors.length];
};

const createIcon = (emoji: string, color: string) => L.divIcon({
  className: 'custom-map-icon',
  html: `
    <div style="
      background-color: ${color};
      width: 40px; height: 40px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex; align-items: center; justify-content: center;
      border: 3px solid white;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    ">
      <div style="transform: rotate(45deg); font-size: 20px;">${emoji}</div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

export default function LogisticsMap() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [driverRoutes, setDriverRoutes] = useState<Record<number, [number, number][]>>({});
  const [selectedQR, setSelectedQR] = useState<{id: string, addr: string} | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const fetchData = async () => {
    try {
      const [resDrivers, resShipments] = await Promise.all([
        fetch('/api/logistics/drivers'),
        fetch('/api/logistics/shipments')
      ]);
      
      if (resDrivers.ok) setDrivers(await resDrivers.json());
      if (resShipments.ok) setShipments(await resShipments.json());
    } catch (err) {
      console.error("Gagal memuat data peta:", err);
    }
  };

  const calculateRoutes = async (currentDrivers: Driver[], currentShipments: Shipment[]) => {
    const newRoutes: Record<number, [number, number][]> = {};
    
    for (const driver of currentDrivers) {
        if (driver.status === 'busy') {
            const myPackages = currentShipments
                .filter(s => s.driver_id === driver.id && (s.status === 'assigned' || s.status === 'in_transit'))
                .sort((a, b) => (a.route_order || 0) - (b.route_order || 0));

            if (myPackages.length > 0) {
                let coordsString = `${driver.current_lng},${driver.current_lat}`;
                myPackages.forEach(pkg => coordsString += `;${pkg.destination_lng},${pkg.destination_lat}`);

                try {
                    const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;
                    const res = await fetch(url);
                    const data = await res.json();
                    if (data.routes?.[0]) {
                        newRoutes[driver.id] = data.routes[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]]);
                    }
                } catch (e) {
                    console.error("Failed to fetch route from OSRM:", e);
                }
            }
        }
    }
    setDriverRoutes(newRoutes);
  };

  useEffect(() => {
    fetchData();
    
    if (process.env.NEXT_PUBLIC_PUSHER_APP_KEY) {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
          cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap1',
        });
        const channel = pusher.subscribe('map-channel');
        channel.bind('update-data', () => { fetchData(); });
        return () => { pusher.unsubscribe('map-channel'); };
    }
  }, []);

  useEffect(() => {
    if (drivers.length > 0 && shipments.length > 0) {
        calculateRoutes(drivers, shipments);
    }
  }, [drivers, shipments]);

  if (!isMounted) return <div className="w-full h-full bg-slate-100 animate-pulse rounded-xl" />;

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-slate-100 relative shadow-inner border border-slate-200 z-0">
      
      {selectedQR && (
        <QRPopup 
          trackingId={selectedQR.id} 
          address={selectedQR.addr} 
          onClose={() => setSelectedQR(null)} 
        />
      )}

      <MapContainer 
        center={[-6.2000, 106.8166]} 
        zoom={13} 
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; CartoDB'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {drivers.map((driver) => (
           <Marker 
              key={`driver-${driver.id}`}
              position={[Number(driver.current_lat), Number(driver.current_lng)]} 
              icon={createIcon(driver.vehicle_type === 'motor' ? '🛵' : driver.vehicle_type === 'truck' ? '🚚' : '🚐', getDriverColor(driver.id))}
            >
              <Popup className="custom-popup">
                <div className="p-1 min-w-[120px]">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1">
                    <Truck size={14}/> {driver.name}
                  </h3>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">{driver.vehicle_type}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold text-white ${driver.status === 'busy' ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
                        {driver.status}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
        ))}

        {shipments.map((pkg) => (
            <Marker 
              key={`shipment-${pkg.id}`}
              position={[Number(pkg.destination_lat), Number(pkg.destination_lng)]} 
              icon={createIcon('📦', pkg.status === 'assigned' || pkg.status === 'in_transit' ? getDriverColor(pkg.driver_id || 0) : '#94a3b8')}
            >
              <Popup>
                <div className="p-1 min-w-[160px]">
                  <div className="flex justify-between items-start mb-1">
                     <h3 className="font-bold text-slate-900 text-sm">#{pkg.tracking_id}</h3>
                     <span className="text-[10px] font-mono bg-slate-100 px-1 rounded">{pkg.weight}kg</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2 line-clamp-2">{pkg.destination_address}</p>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        pkg.status === 'pending' ? 'bg-slate-200 text-slate-600' : 
                        'bg-blue-100 text-blue-600'
                     }`}>
                        {pkg.status.replace('_', ' ')}
                     </span>
                     <button 
                       onClick={() => setSelectedQR({ id: pkg.tracking_id, addr: pkg.destination_address })}
                       className="text-slate-700 hover:text-blue-600 p-1 hover:bg-slate-100 rounded transition-colors"
                       title="QR Code"
                     >
                       <QrCode size={16} />
                     </button>
                  </div>
                </div>
              </Popup>
            </Marker>
        ))}

        {Object.entries(driverRoutes).map(([driverId, positions]) => (
            <Polyline 
                key={`route-${driverId}`}
                positions={positions}
                pathOptions={{ 
                    color: getDriverColor(Number(driverId)), 
                    weight: 4, 
                    opacity: 0.8, 
                    dashArray: '8, 8',
                    lineCap: 'round'
                }}
            />
        ))}
      </MapContainer>
    </div>
  );
}