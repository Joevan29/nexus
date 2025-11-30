import { NextResponse } from 'next/server';
import { query } from '@/src/lib/db';

export async function GET() {
  try {
    const sql = `
      SELECT 
        TO_CHAR(updated_at, 'Dy') as name, 
        SUM(price) as value 
      FROM shipments 
      WHERE 
        status = 'delivered' AND 
        updated_at >= NOW() - INTERVAL '7 days'
      GROUP BY TO_CHAR(updated_at, 'Dy'), DATE(updated_at)
      ORDER BY DATE(updated_at) ASC
    `;

    const result = await query(sql);
    
    if (result.rows.length === 0) {
       return NextResponse.json([
         { name: 'Sen', value: 0 },
         { name: 'Sel', value: 0 },
         { name: 'Rab', value: 0 },
         { name: 'Kam', value: 0 },
         { name: 'Jum', value: 0 },
         { name: 'Sab', value: 0 },
         { name: 'Min', value: 0 },
       ]);
    }

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Revenue Error:", error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}