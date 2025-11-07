import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // pakai service role biar bisa upload tanpa auth user
);

// ✅ GET semua banner
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      select: {
        id: true,
        image: true,
        is_active: true,
        created_by: true,
        created_at: true,
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(banners);
  } catch (error) {
    console.error("Prisma error (GET Banner):", error);
    return NextResponse.json(
      { error: "Failed to fetch banner" },
      { status: 500 }
    );
  }
}

// ✅ POST buat banner baru + upload image ke Supabase
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const isActive = formData.get("is_active") === "true";
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json(
        { error: "Banner wajib memiliki gambar" },
        { status: 400 }
      );
    }

    // ✅ Validasi ukuran file (maks 500KB)
    if (imageFile.size > 500 * 1024) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 500KB" },
        { status: 400 }
      );
    }

    // ✅ Validasi format file
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { error: "Format file hanya boleh JPG, PNG, atau WEBP" },
        { status: 400 }
      );
    }

    // Generate nama file unik
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `banner-${Date.now()}.${fileExt}`;

    // Upload ke Supabase
    const { error: uploadError } = await supabase.storage
      .from("banner-images")
      .upload(fileName, imageFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { error: "Gagal upload gambar banner" },
        { status: 500 }
      );
    }

    // Ambil public URL
    const { data: publicUrl } = supabase.storage
      .from("banner-images")
      .getPublicUrl(fileName);

    const createdBy = 1; // TODO: ambil dari session user

    // Simpan ke database
    const newBanner = await prisma.banner.create({
      data: {
        image: publicUrl.publicUrl,
        is_active: isActive,
        created_by: createdBy,
      },
    });

    return NextResponse.json(newBanner, { status: 201 });
  } catch (error) {
    console.error("Prisma error (POST Banner):", error);
    return NextResponse.json(
      { error: "Failed to create banner" },
      { status: 500 }
    );
  }
}
