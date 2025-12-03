import { NextResponse } from 'next/server';
import { query } from '@/src/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM drivers ORDER BY id ASC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch drivers' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, vehicle_type, phone } = await req.json();

    if (!name || !vehicle_type) {
      return NextResponse.json({ error: 'Nama dan Tipe Kendaraan wajib diisi' }, { status: 400 });
    }

    const defaultLat = -6.2000; 
    const defaultLng = 106.8166;

    const sql = `
      INSERT INTO drivers (name, vehicle_type, phone, status, current_lat, current_lng)
      VALUES ($1, $2, $3, 'idle', $4, $5)
      RETURNING *
    `;

    const res = await query(sql, [name, vehicle_type, phone, defaultLat, defaultLng]);
    
    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error("Add Driver Error:", error);
    return NextResponse.json({ error: 'Gagal menambah driver' }, { status: 500 });
  }
}