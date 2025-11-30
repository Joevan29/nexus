import { NextResponse } from 'next/server';
import { query } from '@/src/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';

    let sql = `
      SELECT id, sku, name, stock, price, location, status 
      FROM products 
      WHERE name ILIKE $1 OR sku ILIKE $1 
      ORDER BY id ASC
    `;

    const result = await query(sql, [`%${search}%`]);
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sku, name, stock, price, location, category } = body;

    let status = 'active';
    if (stock == 0) status = 'out_of_stock';
    else if (stock < 10) status = 'low_stock';

    const sql = `
      INSERT INTO products (sku, name, stock, price, location, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (sku) DO UPDATE 
      SET stock = products.stock + $3, status = $6
      RETURNING *
    `;

    const result = await query(sql, [sku, name, stock, price, location, status]);
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 });
  }
}