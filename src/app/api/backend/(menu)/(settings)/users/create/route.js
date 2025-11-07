// src/app/api/backend/users/create/route.js
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const body = await request.json();
    const { nama, email, roleId, password } = body;

    if (!nama || !email || !roleId || !password) {
      return NextResponse.json(
        { error: "Nama, email, role, password wajib diisi" },
        { status: 400 }
      );
    }

    // Cek email unik
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah digunakan" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const newUser = await prisma.users.create({
      data: { nama, email, password: hashedPassword },
    });

    // Masukkan role ke tabel pivot user_roles
    await prisma.user_roles.create({
      data: {
        user_id: newUser.id,
        role_id: Number(roleId),
      },
    });

    // Buang password dari response
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Error create user:", error);
    return NextResponse.json(
      { error: "Gagal membuat user" },
      { status: 500 }
    );
  }
}
