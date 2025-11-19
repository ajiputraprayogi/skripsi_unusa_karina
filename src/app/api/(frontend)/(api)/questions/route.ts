// Path: app/api/backend/questions/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * @route GET /api/backend/questions
 * @description Mengambil semua data pertanyaan (questions)
 */
export async function GET() {
    try {
        // ✅ Mengambil semua data pertanyaan (questions)
        const questions = await prisma.questions.findMany({
            // Pilih kolom yang diperlukan untuk tampilan daftar
            select: {
                id: true,
                category: true,
                question_text: true,
                question_type: true,
                correct_answer: true,
                created_at: true,
            },
            // Urutkan (contoh: berdasarkan ID secara ascending)
            orderBy: { id: "asc" },
        });

        if (!questions || questions.length === 0) {
            return NextResponse.json(
                { error: "Tidak ada data pertanyaan ditemukan" },
                { status: 404 }
            );
        }

        return NextResponse.json(questions, { status: 200 });
    } catch (error) {
        console.error("Error mengambil data questions:", error);
        return NextResponse.json(
            { error: "Gagal memuat data pertanyaan" },
            { status: 500 }
        );
    }
}