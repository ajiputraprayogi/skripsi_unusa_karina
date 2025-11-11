import { NextResponse } from "next/server";
import { db } from "@/lib/sql2";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user, pengetahuan, sikap, motivasi } = body;

    // 1️⃣ Simpan data user
    const [userResult]: any = await db.query(
      `INSERT INTO users 
      (namaLengkap, email, pendidikan, alamat, pekerjaan, namaAnak, tanggalLahirAnak, jenisKelaminAnak, beratBadan, tinggiBadan)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.namaLengkap,
        user.email,
        user.pendidikan,
        user.alamat,
        user.pekerjaan,
        user.namaAnak,
        user.tanggalLahirAnak,
        user.jenisKelaminAnak,
        user.beratBadan,
        user.tinggiBadan,
      ]
    );

    const userId = userResult.insertId;

    // 2️⃣ Simpan jawaban Pengetahuan Ibu
    for (const [i, jawaban] of pengetahuan.entries()) {
      await db.query(
        `INSERT INTO pengetahuan_ibu (user_id, nomor_soal, jawaban)
         VALUES (?, ?, ?)`,
        [userId, i + 1, jawaban]
      );
    }

    // 3️⃣ Simpan jawaban Sikap Ibu
    for (const [i, jawaban] of sikap.entries()) {
      await db.query(
        `INSERT INTO sikap_ibu (user_id, nomor_soal, jawaban)
         VALUES (?, ?, ?)`,
        [userId, i + 1, jawaban]
      );
    }

    // 4️⃣ Simpan jawaban Motivasi Ibu
    for (const [i, jawaban] of motivasi.entries()) {
      await db.query(
        `INSERT INTO motivasi_ibu (user_id, nomor_soal, jawaban)
         VALUES (?, ?, ?)`,
        [userId, i + 1, jawaban]
      );
    }

    // 5️⃣ Hitung total poin (langsung dari database)
    const [[pengetahuanTotal]]: any = await db.query(
      `SELECT SUM(poin) AS total FROM pengetahuan_ibu WHERE user_id = ?`,
      [userId]
    );
    const [[sikapTotal]]: any = await db.query(
      `SELECT SUM(poin) AS total FROM sikap_ibu WHERE user_id = ?`,
      [userId]
    );
    const [[motivasiTotal]]: any = await db.query(
      `SELECT SUM(poin) AS total FROM motivasi_ibu WHERE user_id = ?`,
      [userId]
    );

    // 6️⃣ Simpan ke hasil_total
    await db.query(
      `INSERT INTO hasil_total (user_id, total_pengetahuan, total_sikap, total_motivasi)
       VALUES (?, ?, ?, ?)`,
      [
        userId,
        pengetahuanTotal.total || 0,
        sikapTotal.total || 0,
        motivasiTotal.total || 0,
      ]
    );

    return NextResponse.json({ message: "Jawaban berhasil disimpan!" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: "Gagal menyimpan jawaban", error: err.message },
      { status: 500 }
    );
  }
}
