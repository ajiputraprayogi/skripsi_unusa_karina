import { NextResponse } from "next/server";
import { pool } from "@/lib/sql";

export async function POST(req: Request) {
  try {
    const { namaLengkap, email } = await req.json();

    const conn = await pool.getConnection();
    try {
      const [rows]: any = await conn.query(
        "SELECT * FROM users WHERE namaLengkap = ? AND email = ?",
        [namaLengkap, email]
      );

      if (rows.length === 0) {
        return NextResponse.json({ error: "Nama atau email salah" }, { status: 401 });
      }

      // ambil data user
      const user = rows[0];
      return NextResponse.json({
        message: "Login berhasil ✅",
        user,
      });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Login Error:", err);
    return NextResponse.json({ error: "Gagal login" }, { status: 500 });
  }
}
