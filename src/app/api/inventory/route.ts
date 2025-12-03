import { NextResponse } from 'next/server';
import { query } from '@/src/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const sqlData = `
      SELECT id, sku, name, category, stock, price, location, status, image_url
      FROM products 
      WHERE name ILIKE $1 OR sku ILIKE $1 
      ORDER BY id ASC
      LIMIT $2 OFFSET $3
    `;

    const sqlCount = `
      SELECT COUNT(*) as total 
      FROM products 
      WHERE name ILIKE $1 OR sku ILIKE $1
    `;

    const [resData, resCount] = await Promise.all([
      query(sqlData, [`%${search}%`, limit, offset]),
      query(sqlCount, [`%${search}%`])
    ]);

    const totalItems = Number(resCount.rows[0].total);
    const totalPages = Math.ceil(totalItems / limit);

    return NextResponse.json({
      data: resData.rows,
      meta: {
        total: totalItems,
        page,
        totalPages,
        limit
      }
    });

  } catch (error) {
    console.error("Inventory API Error:", error);
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
    console.error("Inbound Error:", error);
    return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 });
  }
}