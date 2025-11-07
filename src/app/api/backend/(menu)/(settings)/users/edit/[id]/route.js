import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

// ============================
// PUT untuk update user
// ============================
export async function PUT(request, context) {
  try {
    const id = Number(context.params.id);
    const body = await request.json();
    const { nama, email, roleId, password } = body;

    if (!nama || !email || !roleId) {
      return NextResponse.json(
        { error: "Nama, email dan roleId wajib diisi" },
        { status: 400 }
      );
    }

    // Data user yang akan diupdate
    const dataToUpdate = { nama, email };

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      dataToUpdate.password = hashedPassword;
    }

    // Update data user
    const updatedUser = await prisma.users.update({
      where: { id },
      data: dataToUpdate,
    });

    // Update role user di tabel pivot user_roles
    await prisma.user_roles.deleteMany({
      where: { user_id: id },
    });

    await prisma.user_roles.create({
      data: {
        user_id: id,
        role_id: Number(roleId),
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate user" },
      { status: 500 }
    );
  }
}

// ============================
// GET untuk ambil detail user
// ============================
export async function GET(request, context) {
  try {
    const id = Number(context.params.id);

    const user = await prisma.users.findUnique({
      where: { id },
      include: {
        user_roles: {
          include: {
            roles: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    const roleId = user.user_roles[0]?.role_id ?? null;
    console.log(`Role ID untuk user ${id}:`, roleId);

    return NextResponse.json({
      id: user.id,
      nama: user.nama,
      email: user.email,
      roleId, // single role
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data user" },
      { status: 500 }
    );
  }
}
