// src/app/(frontend)/dummyapi/banner/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // ✅ Ambil data banner dari database
    const dbBanner = await prisma.banner.findMany({
      select: {
        id: true,
        image: true,
        is_active: true,
      },
      orderBy: { created_at: "desc" },
    });

    // ✅ Map agar sesuai dengan format frontend
    const banners = dbBanner.map((banner) => ({
      id: banner.id,
      img: banner.image ?? "/images/default-banner.jpg",
      active: banner.is_active,
    }));

    return NextResponse.json(banners);
  } catch (error) {
    console.error("Error mengambil data banner:", error);
    return NextResponse.json(
      { error: "Gagal memuat data banner" },
      { status: 500 }
    );
  }
}
