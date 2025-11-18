import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // 📝 Ambil semua user hanya dengan kolom id, namalengkap, dan email.
    // Relasi user_roles DIHAPUS.
    const users = await prisma.users.findMany({
      select: {
        id: true,
        namalengkap: true, // ⚠️ Pastikan menggunakan 'namalengkap' sesuai model Prisma
        email: true,
      },
      // 💡 Opsional: Tambahkan orderBy jika diperlukan, misalnya orderBy: { id: 'asc' }
    });

    // Karena tidak ada relasi roles lagi, kita langsung kirim array users.
    const usersData = users.map(user => ({
        id: user.id,
        namalengkap: user.namalengkap,
        email: user.email,
        // Role property DIHAPUS
    }));
    
    return NextResponse.json(usersData);
    
  } catch (error) {
    console.error("Prisma error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}