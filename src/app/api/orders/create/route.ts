import { NextResponse } from 'next/server';
import { pool } from '@/src/lib/db';

export async function POST(req: Request) {
  const client = await pool.connect();
  
  try {
    const { items, destination, lat, lng, totalWeight, totalPrice } = await req.json();
    
    await client.query('BEGIN');

    for (const item of items) {
      const checkStock = await client.query('SELECT stock FROM products WHERE id = $1', [item.id]);
      
      if (checkStock.rows.length === 0) throw new Error(`Produk ID ${item.id} tidak ditemukan`);
      if (checkStock.rows[0].stock < item.qty) {
        throw new Error(`Stok tidak cukup untuk produk: ${item.name}`);
      }

      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.qty, item.id]
      );
    }

    const trackingId = `NEX-${Math.floor(10000 + Math.random() * 90000)}`;

    const insertShipment = await client.query(
      `INSERT INTO shipments 
       (tracking_id, origin_address, destination_address, destination_lat, destination_lng, status, price, weight, created_at)
       VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7, NOW())
       RETURNING *`,
      [trackingId, 'Gudang Pusat (Nexus One)', destination, lat, lng, totalPrice, totalWeight]
    );

    await client.query('COMMIT');

    return NextResponse.json({ 
      success: true, 
      shipment: insertShipment.rows[0] 
    });

  } catch (error: any) {
    await client.query('ROLLBACK'); 
    console.error("Order Failed:", error);
    return NextResponse.json({ error: error.message || 'Gagal membuat order' }, { status: 500 });
  } finally {
    client.release();
  }
}