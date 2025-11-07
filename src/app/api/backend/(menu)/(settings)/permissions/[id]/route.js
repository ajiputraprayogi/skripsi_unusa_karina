import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ============================
// Route handlers
// ============================

export async function GET(request, context) {
  try {
    const id = Number(context.params.id);
    const permission = await prisma.permissions.findUnique({ where: { id } });

    if (!permission) {
      return NextResponse.json({ error: "Permission not found" }, { status: 404 });
    }

    return NextResponse.json(permission);
  } catch (error) {
    console.error("Prisma error:", error);
    return NextResponse.json({ error: "Failed to fetch permission" }, { status: 500 });
  }
}

export async function PUT(request, context) {
  try {
    const id = Number(context.params.id);
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Permission name is required" }, { status: 400 });
    }

    const updatedPermission = await prisma.permissions.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(updatedPermission);
  } catch (error) {
    console.error("Prisma error:", error);
    return NextResponse.json({ error: "Failed to update permission" }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const id = Number(context.params.id);
    await prisma.permissions.delete({ where: { id } });

    return NextResponse.json({ message: "Permission deleted" });
  } catch (error) {
    console.error("Prisma error:", error);
    return NextResponse.json({ error: "Failed to delete permission" }, { status: 500 });
  }
}
