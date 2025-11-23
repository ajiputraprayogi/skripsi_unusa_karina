import { NextResponse } from "next/server";
// Import klien Supabase Anda (asumsi: klien publik)
import { supabase } from "@/lib/supabaseClient"; 

export async function POST(req: Request) {
  try {
    // Mendapatkan kredensial dari body request
    const { namaLengkap, email } = await req.json();

    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not initialized" }, { status: 500 });
    }

    // --- 1. Query Supabase untuk Mencari User ---
    // Menggunakan klien Supabase untuk mencari user berdasarkan namaLengkap dan email.
    // Catatan: Nama kolom di Supabase/PostgreSQL diasumsikan adalah lowercase: 'namalengkap'
    const { data: rows, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('namalengkap', namaLengkap) // Kolom namaLengkap
      .eq('email', email);           // Kolom email

    if (selectError) {
      console.error("Supabase Select Error:", selectError);
      return NextResponse.json({ error: "Gagal memverifikasi user" }, { status: 500 });
    }

    // --- 2. Verifikasi Hasil ---
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "Nama atau email salah" }, { status: 401 });
    }

    // --- 3. Login Berhasil ---
    const user = rows[0];
    return NextResponse.json({
      message: "Login berhasil ✅",
      user,
    });

  } catch (err) {
    console.error("Login Error:", err);
    return NextResponse.json({ error: "Gagal login" }, { status: 500 });
  }
}