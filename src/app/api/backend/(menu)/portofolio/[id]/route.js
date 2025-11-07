import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";
import slugify from "slugify";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Supabase environment variables are missing");
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ✅ Ambil detail portofolio
export async function GET(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const portofolio = await prisma.portofolio.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        description: true,
        // 🟢 Pastikan Kategori dan Tipe diambil untuk form edit
        kategori: true,
        type: true,
        created_by: true,
        created_at: true,
      },
    });

    if (!portofolio) {
      return NextResponse.json({ error: "Portofolio tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(portofolio, { status: 200 });
  } catch (error) {
    console.error("Prisma error (GET by ID):", error);
    return NextResponse.json({ error: "Gagal mengambil portofolio" }, { status: 500 });
  }
}

async function generateUniqueSlugForUpdate(name, id) {
  const baseSlug = slugify(name, { lower: true, strict: true });
  let uniqueSlug = baseSlug;
  let count = 1;

  while (true) {
    const existing = await prisma.portofolio.findUnique({
      where: { slug: uniqueSlug },
    });

    if (!existing || existing.id === id) {
      break;
    }

    uniqueSlug = `${baseSlug}-${count++}`;
  }

  return uniqueSlug;
}

// ✅ Update portofolio
export async function PUT(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const formData = await req.formData();
    // 🟢 AMBIL: Semua field dari FormData
    const name = formData.get("name")?.toString() || null;
    const description = formData.get("description")?.toString() || null;
    const kategori = formData.get("kategori")?.toString() || null;
    const type = formData.get("type")?.toString() || null;
    const file = formData.get("image");
    
    // Konversi file ke tipe yang bisa diproses
    const imageFile = file instanceof File && file.size > 0 ? file : null;

    const existing = await prisma.portofolio.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Portofolio tidak ditemukan" }, { status: 404 });
    }
    
    // Tentukan nilai baru, gunakan nilai lama jika nilai baru kosong
    const newName = name ?? existing.name;
    const newKategori = kategori ?? existing.kategori;
    const newType = type ?? existing.type;

    // 🟢 VALIDASI SERVER: Wajib diisi
    if (!newName || !newKategori || !newType) {
        return NextResponse.json(
            { error: "Nama, Kategori dan Type wajib diisi" },
            { status: 400 }
        );
    }

    // ✅ Generate slug baru jika name berubah
    const newSlug = await generateUniqueSlugForUpdate(newName, id);

    let imageUrl = existing.image;

    // ✅ Upload file baru jika ada
    if (imageFile) {
      // 🔹 Validasi ukuran & tipe file
      const MAX_SIZE = 500 * 1024; // 500KB
      const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

      if (imageFile.size > MAX_SIZE) {
        return NextResponse.json(
          { error: "Ukuran file maksimal 500 KB" },
          { status: 400 }
        );
      }

      if (!ALLOWED_TYPES.includes(imageFile.type)) {
        return NextResponse.json(
          { error: "Format file tidak valid. Hanya JPG, PNG, atau WebP" },
          { status: 400 }
        );
      }

      // 🔹 Hapus file lama di storage
      if (existing.image) {
        const urlParts = existing.image.split('/');
        const oldFilePath = urlParts.pop(); 
        if (oldFilePath) {
            const { error: removeError } = await supabase.storage.from("portofolio-images").remove([oldFilePath]);
            if (removeError) console.warn("Supabase remove warning:", removeError); 
        }
      }

      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const ext = imageFile.name.split(".").pop();

      // ✅ Nama file menjadi slug-timestamp.ext
      const fileName = `${newSlug}-${Date.now()}.${ext}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from("portofolio-images")
        .upload(filePath, buffer, { contentType: imageFile.type, upsert: true });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        return NextResponse.json({ error: "Gagal upload file ke Supabase" }, { status: 500 });
      }

      const { data } = supabase.storage.from("portofolio-images").getPublicUrl(filePath);
      if (data?.publicUrl) {
        imageUrl = data.publicUrl;
      }
    }

    // 🟢 UPDATE: Simpan semua data
    const updated = await prisma.portofolio.update({
      where: { id },
      data: {
        name: newName,
        slug: newSlug, 
        kategori: newKategori, // Update kategori
        type: newType,         // Update type
        description: description ?? existing.description,
        image: imageUrl,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Prisma error (PUT):", error);
    return NextResponse.json({ error: "Gagal update portofolio" }, { status: 500 });
  }
}

// ✅ Hapus portofolio
export async function DELETE(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const existing = await prisma.portofolio.findUnique({ where: { id } });
    if (existing?.image) {
      const urlParts = existing.image.split('/');
      const oldFilePath = urlParts.pop(); 
      if (oldFilePath) {
        await supabase.storage.from("portofolio-images").remove([oldFilePath]);
      }
    }

    await prisma.portofolio.delete({ where: { id } });

    return NextResponse.json({ message: "Portofolio berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("Prisma error (DELETE):", error);
    return NextResponse.json({ error: "Gagal menghapus portofolio" }, { status: 500 });
  }
}