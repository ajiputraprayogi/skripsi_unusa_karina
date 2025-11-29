// Path: app/api/backend/questions/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // sesuaikan path authOptions

/**
 * @route GET /api/backend/questions
 * @description Mengecek apakah user yang login sudah memiliki PRE_TEST atau belum
 * @return allowed: true  -> jika BELUM ADA PRE_TEST
 * @return allowed: false -> jika SUDAH ADA PRE_TEST
 */
export async function GET() {
  try {
    // ✅ Ambil session user login
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = Number(session.user.id);

    // ✅ Cek apakah sudah ada PRE_TEST untuk user tersebut
    const existingPreTest = await prisma.responses.groupBy({
      by: ["user_id"],
      where: {
        user_id: userId,
        soal: "PRE_TEST",
      },
    });

    // ✅ Jika SUDAH ADA → false
    if (existingPreTest.length > 0) {
      return NextResponse.json({ allowed: false }, { status: 200 });
    }

    // ✅ Jika BELUM ADA → true
    return NextResponse.json({ allowed: true }, { status: 200 });
  } catch (error) {
    console.error("Error cek PRE_TEST:", error);
    return NextResponse.json(
      { error: "Gagal mengecek status PRE_TEST" },
      { status: 500 }
    );
  }
}
