import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(request, context) {
  const id = Number(context.params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const deletedUser = await prisma.users.delete({ where: { id } });
    return NextResponse.json({ message: "User deleted", user: deletedUser }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    console.error(error.stack);

    // Lebih spesifik untuk error Prisma
    if (error.code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Cannot delete user" }, { status: 500 });
  }
}
