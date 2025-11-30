export interface Driver {
  id: number;
  name: string;
  vehicle_type: 'motor' | 'van' | 'truck';
  status: 'idle' | 'busy' | 'offline';
  current_lat: number;
  current_lng: number;
  phone?: string;
}

export interface Shipment {
  id: number;
  tracking_id: string;
  origin_address: string;
  destination_address: string;
  destination_lat: number;
  destination_lng: number;
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered';
  price: number;
  weight: number;
  driver_id?: number | null;
  route_order?: number;
  updated_at?: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  stock: number;
  price: number;
  location?: string;
  status: 'active' | 'low_stock' | 'out_of_stock';
  image_url?: string;
}

export interface DashboardMetrics {
  valuation: string;
  pendingOrders: number;
  activeFleet: string;
  fleetUtilization: number;
  recentActivities: {
    tracking_id: string;
    status: string;
    updated_at: string;
  }[];
}