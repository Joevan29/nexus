// src/app/api/copilot/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import { query } from '@/src/lib/db';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const stockRes = await query("SELECT count(*) as low_stock FROM products WHERE stock < 10");
    const driverRes = await query("SELECT count(*) as active FROM drivers WHERE status = 'busy'");
    const pendingRes = await query("SELECT count(*) as pending FROM shipments WHERE status = 'pending'");
    
    const context = `
      CONTEXT REAL-TIME DATA LOGISTIK:
      - Barang Low Stock: ${stockRes.rows[0].low_stock} items.
      - Driver Aktif (Busy): ${driverRes.rows[0].active} orang.
      - Pesanan Pending: ${pendingRes.rows[0].pending} paket.
      
      PERAN: Anda adalah Nexus Copilot, asisten logistik AI yang profesional, singkat, dan berbasis data.
      TUGAS: Jawab pertanyaan user berdasarkan data di atas. Jika user bertanya hal di luar data, jawab dengan sopan bahwa Anda hanya fokus pada operasional logistik.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        { role: "user", parts: [{ text: context }] },
        { role: "user", parts: [{ text: message }] }
      ]
    });

    return NextResponse.json({ reply: response.text });

  } catch (error) {
    console.error("Copilot Error:", error);
    return NextResponse.json({ reply: "Maaf Commander, sistem komunikasi saya sedang gangguan." });
  }
}