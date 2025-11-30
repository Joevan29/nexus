import { NextResponse } from 'next/server';
import { query } from '@/src/lib/db';
import { GoogleGenAI } from "@google/genai"; 
import { pusherServer } from '@/src/lib/pusher'; 

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST() {
  try {
    const driversRes = await query("SELECT id, name, vehicle_type, current_lat, current_lng FROM drivers WHERE status = 'idle'");
    const shipmentsRes = await query("SELECT id, weight, destination_lat, destination_lng FROM shipments WHERE status = 'pending'");

    const drivers = driversRes.rows;
    const shipments = shipmentsRes.rows;

    if (drivers.length === 0 || shipments.length === 0) {
      return NextResponse.json({ message: "Tidak ada driver tersedia atau paket pending." }, { status: 400 });
    }

    // 2. Siapkan Prompt untuk Gemini AI
    const promptData = `
      Bertindaklah sebagai AI Logistics Dispatcher.
      
      DATA DRIVER (Idle):
      ${JSON.stringify(drivers)}

      DATA PAKET (Pending):
      ${JSON.stringify(shipments)}

      TUGAS:
      Pasangkan Driver dengan Paket secara efisien menggunakan aturan:
      1. Motor (Max 20kg), Van (Max 100kg), Truck (Max 500kg).
      2. Satu driver bisa membawa max 3 paket jika lokasi berdekatan (Multi-stop).
      3. Prioritaskan jarak terdekat (Euclidean distance sederhana dari koordinat).

      OUTPUT JSON RAW SAJA (Tanpa markdown):
      [
        {"driver_id": 1, "shipment_id": 10, "route_order": 1},
        {"driver_id": 1, "shipment_id": 12, "route_order": 2}
      ]
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", 
      contents: promptData,
      config: { responseMimeType: "application/json" }
    });

    const textOutput = response.text; 
    const assignments = JSON.parse(textOutput || "[]");

    if (assignments.length > 0) {
        for (const item of assignments) {
            if (item.driver_id && item.shipment_id) {
                await query(
                    "UPDATE shipments SET driver_id = $1, status = 'assigned', route_order = $2 WHERE id = $3",
                    [item.driver_id, item.route_order, item.shipment_id]
                );
                await query(
                    "UPDATE drivers SET status = 'busy' WHERE id = $1",
                    [item.driver_id]
                );
            }
        }

        await pusherServer.trigger('map-channel', 'update-data', {
          message: `Optimasi Selesai! ${assignments.length} paket telah ditugaskan.`,
          assignments
        });
    }

    return NextResponse.json({ success: true, count: assignments.length, assignments });

  } catch (error: any) {
    console.error("AI Dispatch Error:", error);
    return NextResponse.json({ error: error?.message || 'Server Error' }, { status: 500 });
  }
}