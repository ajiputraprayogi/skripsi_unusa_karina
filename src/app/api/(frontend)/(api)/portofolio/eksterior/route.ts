import { NextResponse } from "next/server";
// Pastikan path ini benar untuk import Prisma client Anda
import { prisma } from "@/lib/db"; 

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const typeFilter = searchParams.get("type"); // query contoh: ?type=Perumahan atau ?type=Cafe

    // Bangun kondisi filter untuk Prisma
    const whereCondition: any = {
      kategori: "Design Eksterior", // Selalu filter berdasarkan kategori Eksterior
    };
    
    // Jika typeFilter ada dan bukan 'all', tambahkan filter type
    if (typeFilter && typeFilter.toLowerCase() !== "all") {
      // Menggunakan mode insensitive untuk perbandingan string
      whereCondition.type = {
          equals: typeFilter,
          mode: 'insensitive', // Dihapus 'as const' untuk kemudahan runtime
      };
    }

    // Ambil data portofolio dari database
    const dbPortofolio = await prisma.portofolio.findMany({
      where: whereCondition,
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        image: true,
        type: true,
      },
      orderBy: { created_at: "desc" },
    });

    // Format response agar sesuai dengan permintaan Anda: 
    // { id, slug, name, description, image, type }
    const projects = dbPortofolio.map((proj) => ({
      id: proj.id,
      slug: proj.slug,
      name: proj.name,
      description: proj.description || "",
      // Asumsi 'image' di DB adalah path/URL yang valid
      image: proj.image || "/images/default-image.jpg", 
      type: proj.type, 
    }));

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      { error: "Gagal memuat data portofolio dari database" },
      { status: 500 }
    );
  }
}