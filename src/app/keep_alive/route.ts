// File: ./src/app/keep_alive/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client"; // Wajib diimpor untuk Prisma.sql

// Tipe data untuk hasil raw query
type PingResult = {
    last_ping: Date;
}

/**
 * ✅ GET: Memicu 'ping' (UPSERT/UPDATE baris tunggal) dan menampilkan waktu ping terbaru.
 * * Catatan: Kode ini dirancang untuk tabel yang memiliki Primary Key (id), 
 * * yang sesuai dengan error 'Key (id)=(1) already exists'.
 */
export async function GET() {
  let newPingTime: Date | null = null;
  
  try {
    // 1. **Memicu 'Ping' (UPSERT Raw Query)**
    // Perintah ini akan:
    // a) Mencoba INSERT (1, NOW()).
    // b) Jika terjadi konflik pada 'id', ia akan menjalankan UPDATE: SET last_ping = NOW().
    await prisma.$executeRaw(
      Prisma.sql`
        INSERT INTO public.keep_alive (id, last_ping) 
        VALUES (1, NOW()) 
        ON CONFLICT (id) DO UPDATE 
        SET last_ping = NOW();
      `
    );
    
    // 2. **Mengambil Waktu Ping Terakhir (SELECT Raw Query)**
    // Ambil data tunggal yang baru saja di-update.
    const latestPingResult = await prisma.$queryRaw<PingResult[]>(
        Prisma.sql`SELECT last_ping FROM public.keep_alive WHERE id = 1;`
    );

    newPingTime = latestPingResult[0]?.last_ping ?? null;

    if (!newPingTime) {
        throw new Error("Ping recorded but failed to retrieve timestamp."); 
    }

    // Mengembalikan status 200 OK
    return NextResponse.json({ 
        message: "Keep-alive ping successful (UPSERT mode).", 
        newPingTime: newPingTime,
    });
  } catch (error) {
    // Jika ada error lain (misalnya koneksi), tetap log detailnya.
    console.error("Prisma error (GET Keep-Alive/UPSERT Failed):", error);
    
    return NextResponse.json(
      { 
        error: "Failed to perform keep-alive UPSERT. Check server logs for database connection details.",
      },
      { status: 500 }
    );
  }
}

/**
 * ❌ POST: Dinonaktifkan (opsional)
 */
export async function POST() {
    return NextResponse.json(
        { error: "POST method is not used for keep-alive. Use GET instead." }, 
        { status: 405 }
    );
}