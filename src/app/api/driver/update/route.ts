import { NextResponse } from 'next/server';
import { query } from '@/src/lib/db';
import { pusherServer } from '@/src/lib/pusher';

export async function POST(req: Request) {
  try {
    const { shipmentId, driverId, status, latitude, longitude } = await req.json();

    if (latitude && longitude) {
      await query(
        'UPDATE drivers SET current_lat = $1, current_lng = $2 WHERE id = $3',
        [latitude, longitude, driverId]
      );
    }

    if (status === 'in_transit') {
      await query("UPDATE shipments SET status = 'in_transit' WHERE id = $1", [shipmentId]);
      await query("UPDATE drivers SET status = 'busy' WHERE id = $1", [driverId]);
    } 
    else if (status === 'delivered') {
      await query("UPDATE shipments SET status = 'delivered' WHERE id = $1", [shipmentId]);
      const checkRes = await query("SELECT count(*) as count FROM shipments WHERE driver_id = $1 AND status != 'delivered'", [driverId]);
      const remainingPackages = Number(checkRes.rows[0].count);
      
      if (remainingPackages === 0) {
         await query("UPDATE drivers SET status = 'idle' WHERE id = $1", [driverId]);
      }
    }

    await pusherServer.trigger('map-channel', 'update-data', {
      message: `Driver #${driverId} status: ${status}`,
      driverId,
      shipmentId,
      status
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Driver Update Error:", error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}