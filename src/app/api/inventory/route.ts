import { NextResponse } from 'next/server';
import { query } from '@/src/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '8'); 
    const offset = (page - 1) * limit;
    
    const sqlData = `
      SELECT id, sku, name, stock, price, location, status
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

  } catch (error: any) {
    console.error("Inventory API Error:", error.message);
    return NextResponse.json({ error: error.message || 'Gagal mengambil data' }, { status: 500 });
  }
}