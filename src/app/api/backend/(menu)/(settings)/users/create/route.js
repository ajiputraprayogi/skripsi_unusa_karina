// src/app/api/backend/users/create/route.js
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
// Hapus: import bcrypt from "bcrypt";

// Fungsi bantu untuk mengonversi string YYYY-MM-DD ke Date object atau null
const safeDate = (dateString) => {
    if (dateString) {
        const date = new Date(dateString);
        // Pastikan Date object valid (bukan 'Invalid Date')
        return isNaN(date.getTime()) ? null : date;
    }
    return null;
};

export async function POST(request) {
    try {
        const body = await request.json();
        
        // 📝 Ambil semua field yang dibutuhkan (termasuk data pribadi)
        const { 
            namalengkap, 
            email, 
            tanggallahir, 
            pendidikan, 
            alamat, 
            pekerjaan, 
            namaanak, 
            tanggallahiranak, 
            jeniskelaminanak 
        } = body; // Hapus: roleId, password

        if (!namalengkap || !email) {
            return NextResponse.json(
                { error: "Nama lengkap dan email wajib diisi" },
                { status: 400 }
            );
        }

        // Cek email unik
        const existingUser = await prisma.users.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json(
                { error: "Email sudah digunakan" },
                { status: 400 }
            );
        }

        // ❌ Hapus: const hashedPassword = await bcrypt.hash(password, 10);

        // Buat user baru dengan data lengkap
        const newUser = await prisma.users.create({
            data: { 
                namalengkap, // Ganti nama
                email, 
                // Data Pribadi (gunakan safeDate)
                tanggallahir: safeDate(tanggallahir),
                pendidikan: pendidikan || null,
                alamat: alamat || null,
                pekerjaan: pekerjaan || null,
                // Data Anak (gunakan safeDate)
                namaanak: namaanak || null,
                tanggallahiranak: safeDate(tanggallahiranak),
                // Jika nama anak kosong, jeniskelaminanak juga disetel null
                jeniskelaminanak: namaanak ? jeniskelaminanak : null,
            },
        });

        // ❌ Hapus: Masukkan role ke tabel pivot user_roles

        // Karena tidak ada password, kita bisa kembalikan objek user secara langsung
        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error("Error create user:", error);
        return NextResponse.json(
            { error: "Gagal membuat user" },
            { status: 500 }
        );
    }
}