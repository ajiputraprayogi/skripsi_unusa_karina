import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const permissions = await prisma.permissions.findMany({
      select: {
        id: true,
        name: true,
        grup: true,
      },
      orderBy: { id: "asc" },
    });
    return NextResponse.json(permissions);
  } catch (error) {
    console.error("Prisma error:", error);
    return NextResponse.json({ error: "Failed to fetch permissions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Permission name is required" }, { status: 400 });
    }

    const newPermission = await prisma.permissions.create({
      data: { name },
    });

    return NextResponse.json(newPermission, { status: 201 });
  } catch (error) {
    console.error("Prisma error:", error);
    return NextResponse.json({ error: "Failed to create permission" }, { status: 500 });
  }
}
