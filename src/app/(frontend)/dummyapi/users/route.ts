import { NextResponse } from "next/server";
// Import klien yang Anda inginkan dari path yang sesuai
import { supabase } from "@/lib/supabaseClient"; 
// ^^^ ASUMSI: Klien diekspor sebagai 'supabase' dan berada di '@/lib/supabaseClient'

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not initialized" }, { status: 500 });
    }

    // --- 1. Cek Duplikasi Email ---
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('email')
      .eq('email', data.email);

    if (selectError) {
      console.error("Supabase Select Error:", selectError);
      return NextResponse.json({ error: "Gagal memeriksa email" }, { status: 500 });
    }

    if (existingUser && existingUser.length > 0) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    // --- 2. Siapkan Data dan Insert ---
    // Menggunakan kunci objek (keys) yang disesuaikan dengan skema PostgreSQL (lowercase)
    const userData = {
      namalengkap: data.namaLengkap,       // <--- Disesuaikan
      email: data.email,
      tanggallahir: data.tanggalLahir,     // <--- Disesuaikan
      pendidikan: data.pendidikan,
      alamat: data.alamat,
      pekerjaan: data.pekerjaan,
      namaanak: data.namaAnak,             // <--- Disesuaikan
      tanggallahiranak: data.tanggalLahirAnak, // <--- Disesuaikan
      jeniskelaminanak: data.jenisKelaminAnak, // <--- Disesuaikan
      beratbadan: data.beratBadan,         // <--- Disesuaikan
      tinggibadan: data.tinggiBadan,       // <--- Disesuaikan
    };
    
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([userData])
      .select();

    if (insertError) {
      console.error("Supabase Insert Error:", insertError);
      return NextResponse.json({ error: "Gagal mendaftarkan user" }, { status: 500 });
    }

    return NextResponse.json({ message: "Registrasi berhasil ✅", user: newUser[0] });

  } catch (err) {
    console.error("Register Error:", err);
    return NextResponse.json({ error: "Gagal memproses pendaftaran" }, { status: 500 });
  }
}