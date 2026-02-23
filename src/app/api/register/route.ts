import { prisma } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { namaLengkap, email } = body;

    // Validasi wajib
    if (!namaLengkap || !email) {
      return NextResponse.json(
        { message: "Nama lengkap dan email wajib diisi" },
        { status: 400 }
      );
    }

    // Cek apakah email sudah ada
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Simpan user baru
    const newUser = await prisma.users.create({
      data: {
        namalengkap: namaLengkap,
        email: email,
      },
    });

    return NextResponse.json(
      {
        message: "Registrasi berhasil",
        user: {
          id: newUser.id,
          namalengkap: newUser.namalengkap,
          email: newUser.email,
        },
      },
      { status: 201 }
    );

  } catch (error) {

    console.error("Error register user:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );

  }
}