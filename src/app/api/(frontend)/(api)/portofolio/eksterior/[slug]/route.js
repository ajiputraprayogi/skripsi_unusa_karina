// src/app/(frontend)/dummyapi/data/[slug]/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_, { params }) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug tidak diberikan" },
        { status: 400 }
      );
    }

    // ✅ Cari portofolio berdasarkan slug
    const portofolio = await prisma.portofolio.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        image: true,
        created_at: true,
      },
    });

    if (!portofolio) {
      return NextResponse.json(
        { error: "Portofolio tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(portofolio);
  } catch (error) {
    console.error("Error mengambil portofolio by slug:", error);
    return NextResponse.json(
      { error: "Gagal memuat data portofolio" },
      { status: 500 }
    );
  }
}
