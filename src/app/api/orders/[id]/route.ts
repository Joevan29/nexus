import { NextResponse } from 'next/server';
import { query } from '@/src/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; 
    
    const sql = `
      SELECT s.*, d.name as driver_name, d.phone as driver_phone, d.vehicle_type 
      FROM shipments s 
      LEFT JOIN drivers d ON s.driver_id = d.id 
      WHERE s.tracking_id = $1
    `;

    const result = await query(sql, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}