import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

async function generateUniqueSlug(name: string) {
  let baseSlug = slugify(name);
  let uniqueSlug = baseSlug;
  let count = 1;

  while (await prisma.portofolio.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${baseSlug}-${count++}`;
  }

  return uniqueSlug;
}

// ✅ GET: ambil semua portofolio
export async function GET() {
  try {
    const portofolio = await prisma.portofolio.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        kategori: true,
        type: true,
        description: true,
        created_by: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(portofolio);
  } catch (error) {
    console.error("Prisma error (GET):", error);
    return NextResponse.json(
      { error: "Failed to fetch portofolio" },
      { status: 500 }
    );
  }
}

// ✅ POST: create portofolio
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
    const kategori = formData.get("kategori") as string;
    const type = formData.get("type") as string;
    const imageFile = formData.get("image") as File | null;

    // ✅ Validasi wajib
    if (!name || !kategori || !type) {
      return NextResponse.json(
        { error: "Nama, Kategori dan Type wajib diisi" },
        { status: 400 }
      );
    }

    // ✅ Validasi file jika ada
    if (imageFile) {
      const MAX_SIZE = 500 * 1024;
      const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

      if (imageFile.size > MAX_SIZE) {
        return NextResponse.json(
          { error: "Ukuran file maksimal 500 KB" },
          { status: 400 }
        );
      }

      if (!ALLOWED_TYPES.includes(imageFile.type)) {
        return NextResponse.json(
          { error: "Format file tidak valid (JPG, PNG, WebP saja)" },
          { status: 400 }
        );
      }
    }

    // ✅ Buat slug unik
    const slug = await generateUniqueSlug(name);

    // ✅ Upload gambar
    let imageUrl: string | null = null;

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${slug}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("portofolio-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error(uploadError);
        return NextResponse.json(
          { error: "Gagal upload gambar" },
          { status: 500 }
        );
      }

      const { data: publicUrl } = supabase.storage
        .from("portofolio-images")
        .getPublicUrl(fileName);

      imageUrl = publicUrl.publicUrl;
    }

    const createdBy = 1; // TODO: ganti saat sudah pakai auth user session

    // ✅ Simpan data
    const newPortofolio = await prisma.portofolio.create({
      data: {
        name,
        slug,
        kategori,
        type,
        image: imageUrl,
        description: description || null,
        created_by: createdBy,
      },
    });

    return NextResponse.json(newPortofolio, { status: 201 });
  } catch (error) {
    console.error("Prisma error (POST):", error);
    return NextResponse.json(
      { error: "Failed to create portofolio" },
      { status: 500 }
    );
  }
}
