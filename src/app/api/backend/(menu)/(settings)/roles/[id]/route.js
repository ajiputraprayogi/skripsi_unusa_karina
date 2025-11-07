import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ============================
// Route handlers
// ============================

export async function GET(request, context) {
  try {
    
    const { id } = await context.params; 
    const roleID = Number(id);

    // Ambil role beserta relasi role_has_permissions dan permission-nya
    const role = await prisma.roles.findUnique({
      where: { id: roleID },
      include: {
        role_has_permissions: {
          select: {
            permission_id: true,
          },
        },
      },
    });

    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    return NextResponse.json(role);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch role" }, { status: 500 });
  }
}

export async function PUT(request, context) {
  try {
    const id = Number(context.params.id);
    const body = await request.json();
    const { name, permissionIds } = body;

    if (!name) {
      return NextResponse.json({ error: "Role name is required" }, { status: 400 });
    }
    if (!Array.isArray(permissionIds)) {
      return NextResponse.json({ error: "permissionIds harus array" }, { status: 400 });
    }

    // Update nama role dulu
    await prisma.roles.update({
      where: { id },
      data: { name },
    });

    // Sinkronisasi role_has_permissions
    // Hapus semua yang lama
    await prisma.role_has_permissions.deleteMany({
      where: { role_id: id },
    });

    // Tambahkan yang baru jika ada
    if (permissionIds.length > 0) {
      const newRelations = permissionIds.map((permissionId) => ({
        role_id: id,
        permission_id: Number(permissionId), // pastikan number
      }));
      await prisma.role_has_permissions.createMany({
        data: newRelations,
      });
    }

    // Return role beserta permissions detail
    const roleWithPermissions = await prisma.roles.findUnique({
      where: { id },
      include: {
        role_has_permissions: {
          include: {
            permissions: true,
          },
        },
      },
    });

    return NextResponse.json(roleWithPermissions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const id = Number(context.params.id);
    await prisma.roles.delete({ where: { id } });
    return NextResponse.json({ message: "Role deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete role" }, { status: 500 });
  }
}
