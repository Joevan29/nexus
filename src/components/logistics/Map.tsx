"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Pusher from 'pusher-js';
import { Driver, Shipment } from '@/src/types';

const getDriverColor = (id: number) => {
  const colors = ['#2563eb', '#dc2626', '#16a34a', '#d97706', '#9333ea', '#db2777'];
  return colors[id % colors.length];
};

// Custom Icon Maker
const createIcon = (emoji: string, color: string) => L.divIcon({
  className: 'custom-map-icon',
  html: `
    <div style="
      background-color: ${color};
      width: 36px; height: 36px;
      border-radius: 50% 50% 0 50%;
      transform: rotate(45deg);
      display: flex; align-items: center; justify-content: center;
      border: 3px solid white;
      box-shadow: 0 4px 8px rgba(0,0,0,0.4);
    ">
      <div style="transform: rotate(-45deg); font-size: 18px;">${emoji}</div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -30]
});

export default function LogisticsMap() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [driverRoutes, setDriverRoutes] = useState<Record<number, [number, number][]>>({});

  const fetchData = async () => {
    try {
      const [resDrivers, resShipments] = await Promise.all([
        fetch('/api/logistics/drivers'),
        fetch('/api/logistics/shipments')
      ]);
      
      if (resDrivers.ok) setDrivers(await resDrivers.json());
      if (resShipments.ok) setShipments(await resShipments.json());
    } catch (err) {
      console.error("Error fetching map data:", err);
    }
  };

  const calculateRoutes = async (currentDrivers: Driver[], currentShipments: Shipment[]) => {
    const newRoutes: Record<number, [number, number][]> = {};
    const assignedShipments: Record<number, Shipment[]> = {};
    
    currentShipments.forEach(pkg => {
        if (pkg.status === 'assigned' && pkg.driver_id) {
            if (!assignedShipments[pkg.driver_id]) assignedShipments[pkg.driver_id] = [];
            assignedShipments[pkg.driver_id].push(pkg);
        }
    });

    for (const [driverId, packages] of Object.entries(assignedShipments)) {
        const dId = Number(driverId);
        const driver = currentDrivers.find(d => d.id === dId);
        
        if (driver) {
            packages.sort((a, b) => (a.route_order || 0) - (b.route_order || 0));
            
            let coordsString = `${driver.current_lng},${driver.current_lat}`;
            packages.forEach(pkg => coordsString += `;${pkg.destination_lng},${pkg.destination_lat}`);

            try {
                const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;
                const res = await fetch(url);
                const data = await res.json();
                if (data.routes?.[0]) {
                    newRoutes[dId] = data.routes[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]]);
                }
            } catch (error) { console.error("Routing error", error); }
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
        
        return () => { 
          pusher.unsubscribe('map-channel'); 
        };
    }
  }, []);

  useEffect(() => {
    if (drivers.length && shipments.length) calculateRoutes(drivers, shipments);
  }, [shipments, drivers]);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-slate-100 relative z-0">
      <MapContainer 
        center={[-6.2000, 106.8166]}
        zoom={12} 
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {drivers.map((driver) => (
           <Marker 
              key={`driver-${driver.id}`}
              position={[Number(driver.current_lat), Number(driver.current_lng)]} 
              icon={createIcon(driver.vehicle_type === 'motor' ? '🛵' : driver.vehicle_type === 'truck' ? '🚚' : '🚐', getDriverColor(driver.id))}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-sm">{driver.name}</h3>
                  <p className="text-xs uppercase text-slate-500">{driver.vehicle_type} • {driver.status}</p>
                </div>
              </Popup>
            </Marker>
        ))}

        {shipments.map((pkg) => (
            <Marker 
              key={`shipment-${pkg.id}`}
              position={[Number(pkg.destination_lat), Number(pkg.destination_lng)]} 
              icon={createIcon('📦', pkg.status === 'assigned' ? getDriverColor(pkg.driver_id || 0) : '#64748b')}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-sm">Order #{pkg.tracking_id}</h3>
                  <p className="text-xs">{pkg.destination_address}</p>
                  <span className="text-[10px] font-bold bg-slate-100 px-1 rounded">{pkg.status}</span>
                </div>
              </Popup>
            </Marker>
        ))}

        {Object.entries(driverRoutes).map(([driverId, positions]) => (
            <Polyline 
                key={`route-driver-${driverId}`}
                positions={positions}
                pathOptions={{ 
                    color: getDriverColor(Number(driverId)), 
                    weight: 4, 
                    opacity: 0.8, 
                    dashArray: '10, 10' 
                }}
            />
        ))}

      </MapContainer>
    </div>
  );
}