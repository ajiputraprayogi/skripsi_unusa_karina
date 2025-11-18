import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
// Hapus: import bcrypt from "bcrypt";

// Fungsi bantu untuk mengonversi string YYYY-MM-DD ke Date object atau null
const safeDate = (dateString) => {
    if (dateString) {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
    }
    return null;
};

// Fungsi untuk konversi Date object ke string YYYY-MM-DD (untuk input date)
const formatDateToISO = (date) => {
    if (date instanceof Date && !isNaN(date.getTime())) {
        return date.toISOString().split('T')[0]; 
    }
    return null;
};

// ============================
// PUT untuk update user (FINAL TANPA PASSWORD)
// ============================
export async function PUT(request, context) {
    try {
        const id = Number(context.params.id);
        const body = await request.json();
        
        // Hapus 'password' dari destructuring
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
        } = body;

        if (!namalengkap || !email) {
            return NextResponse.json(
                { error: "Nama lengkap dan email wajib diisi" },
                { status: 400 }
            );
        }

        // Data user yang akan diupdate
        const dataToUpdate = { 
            namalengkap, 
            email,
            // Data Pribadi
            tanggallahir: safeDate(tanggallahir),
            pendidikan: pendidikan || null,
            alamat: alamat || null,
            pekerjaan: pekerjaan || null,
            // Data Anak
            namaanak: namaanak || null,
            tanggallahiranak: safeDate(tanggallahiranak),
            jeniskelaminanak: namaanak ? jeniskelaminanak : null,
        };

        // Hapus: Logika hashing dan update password

        // Update data user
        const updatedUser = await prisma.users.update({
            where: { id },
            data: dataToUpdate,
        });

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            { error: "Gagal mengupdate user" },
            { status: 500 }
        );
    }
}

// -------------------------------------------------------------

// ============================
// GET untuk ambil detail user (TIDAK BERUBAH)
// ============================
export async function GET(request, context) {
    try {
        const id = Number(context.params.id);

        const user = await prisma.users.findUnique({
            where: { id },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User tidak ditemukan" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            id: user.id,
            namalengkap: user.namalengkap,
            email: user.email,
            tanggallahir: formatDateToISO(user.tanggallahir),
            pendidikan: user.pendidikan,
            alamat: user.alamat,
            pekerjaan: user.pekerjaan,
            namaanak: user.namaanak,
            tanggallahiranak: formatDateToISO(user.tanggallahiranak),
            jeniskelaminanak: user.jeniskelaminanak,
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { error: "Gagal mengambil data user" },
            { status: 500 }
        );
    }
}