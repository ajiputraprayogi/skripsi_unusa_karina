import { NextResponse } from "next/server";
import { pool } from "@/lib/sql";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const conn = await pool.getConnection();
    try {
      const [existing]: any = await conn.query(
        "SELECT * FROM users WHERE email = ?",
        [data.email]
      );

      if (existing.length > 0) {
        return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
      }

      const query = `
        INSERT INTO users 
        (namaLengkap, email, tanggalLahir, pendidikan, alamat, pekerjaan, namaAnak, tanggalLahirAnak, jenisKelaminAnak, beratBadan, tinggiBadan)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        data.namaLengkap,
        data.email,
        data.tanggalLahir,
        data.pendidikan,
        data.alamat,
        data.pekerjaan,
        data.namaAnak,
        data.tanggalLahirAnak,
        data.jenisKelaminAnak,
        data.beratBadan,
        data.tinggiBadan,
      ];

      await conn.query(query, values);

      return NextResponse.json({ message: "Registrasi berhasil ✅" });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Register Error:", err);
    return NextResponse.json({ error: "Gagal mendaftarkan user" }, { status: 500 });
  }
}
