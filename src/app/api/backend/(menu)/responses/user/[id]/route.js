import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request, { params }) {
  const userId = parseInt(params.id);

  if (isNaN(userId)) {
    return NextResponse.json(
      { error: "ID pengguna tidak valid." },
      { status: 400 }
    );
  }

  try {
    const userResponses = await prisma.responses.findMany({
      where: { user_id: userId },
      select: {
        id: true,
        answer_value: true,
        calculated_score: true,
        submitted_at: true,
        response_session_id: true,
        questions: {
          select: {
            question_text: true,
            question_type: true,
            correct_answer: true,
          },
        },
      },
      orderBy: { submitted_at: "asc" },
    });

    const userData = await prisma.users.findUnique({
      where: { id: userId },
      select: { namalengkap: true, email: true },
    });

    return NextResponse.json({
      user: userData,
      responses: userResponses,
    });
  } catch (error) {
    console.error("Prisma error (GET User Responses):", error);
    return NextResponse.json(
      { error: "Gagal mengambil detail respons pengguna" },
      { status: 500 }
    );
  }
}
