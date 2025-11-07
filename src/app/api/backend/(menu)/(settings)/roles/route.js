import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const roles = await prisma.roles.findMany({
      select: {
        id: true,
        name: true,
        role_has_permissions: {
          select: {
            permissions: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json(roles);
  } catch (error) {
    console.error("Prisma error (GET roles):", error);
    return NextResponse.json(
      { error: "Failed to fetch roles" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, permissions } = body; // permissions: array of permission ids

    if (!name) {
      return NextResponse.json(
        { error: "Role name is required" },
        { status: 400 }
      );
    }
    if (!Array.isArray(permissions)) {
      return NextResponse.json(
        { error: "Permissions must be an array" },
        { status: 400 }
      );
    }

    const newRole = await prisma.roles.create({
      data: {
        name,
        role_has_permissions: {
          create: permissions.map((permId) => ({
            permission_id: permId,
          })),
        },
      },
      include: {
        role_has_permissions: {
          include: {
            permissions: true,
          },
        },
      },
    });

    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    console.error("Prisma error (POST roles):", error);

    // Jika error P2002 (duplicate), tampilkan pesan lebih jelas
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Role name must be unique" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create role" },
      { status: 500 }
    );
  }
}
