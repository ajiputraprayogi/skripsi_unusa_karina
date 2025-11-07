import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        nama: true,
        email: true,
        user_roles: {
          take: 1,
          select: {
            roles: true,
          },
        },
      },
    });


    // Map users agar hanya kirim data user dan role (ambil role pertama)
    const usersWithRole = users.map(user => ({
      id: user.id,
      nama: user.nama,
      email: user.email,
      role: user.user_roles[0]?.roles || null,
    }));

    return NextResponse.json(usersWithRole);
  } catch (error) {
    console.error("Prisma error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
