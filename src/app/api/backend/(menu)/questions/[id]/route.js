import { NextResponse } from "next/server";
// Pastikan ini adalah path yang benar ke instance Prisma Client Anda
import { prisma } from "@/lib/db"; 

/**
 * @route GET /api/backend/questions/[id]
 * @description Mengambil data pertanyaan tunggal berdasarkan ID
 */
export async function GET(request, context) {
    // Akses params melalui objek 'context' (sebelumnya bernama 'params' di error log Anda)
    // Next.js secara otomatis menyediakan context.params.id
    const questionId = parseInt(context.params.id);

    if (isNaN(questionId)) {
        return NextResponse.json(
            { error: "ID Pertanyaan tidak valid." },
            { status: 400 }
        );
    }

    try {
        const question = await prisma.questions.findUnique({
            where: { id: questionId },
            select: {
                id: true,
                category: true,
                question_text: true,
                question_type: true,
                correct_answer: true,
                created_at: true,
            },
        });

        if (!question) {
            return NextResponse.json(
                { error: "Pertanyaan tidak ditemukan." },
                { status: 404 }
            );
        }

        return NextResponse.json(question);
    } catch (error) {
        console.error(`Prisma error (GET Question ${questionId}):`, error);
        return NextResponse.json(
            { error: "Gagal mengambil data pertanyaan" },
            { status: 500 }
        );
    }
}

/**
 * @route PUT /api/backend/questions/[id]
 * @description Memperbarui pertanyaan berdasarkan ID (Update)
 */
export async function PUT(request, context) {
    const questionId = parseInt(context.params.id);

    if (isNaN(questionId)) {
        return NextResponse.json(
            { error: "ID Pertanyaan tidak valid." },
            { status: 400 }
        );
    }

    try {
        // Body request harus diawait secara eksplisit sebelum diakses
        const body = await request.json();

        const {
            category,
            question_text,
            question_type,
            correct_answer
        } = body;

        // VALIDASI DASAR
        if (!category || !question_text || !question_type || !correct_answer) {
            return NextResponse.json(
                { error: "Semua field (Kategori, Teks, Tipe, Jawaban) wajib diisi." },
                { status: 400 }
            );
        }

        const validTypes = ['benar_salah', 'skala_positif', 'skala_negatif'];
        if (!validTypes.includes(question_type)) {
            return NextResponse.json(
                { error: "Tipe pertanyaan tidak valid." },
                { status: 400 }
            );
        }

        // UPDATE PRISMA
        const updatedQuestion = await prisma.questions.update({
            where: { id: questionId },
            data: {
                category,
                question_text,
                question_type,
                correct_answer, // Simpan string JSON langsung
            },
            select: {
                id: true,
                category: true,
                question_text: true,
                question_type: true,
                created_at: true,
            }
        });

        return NextResponse.json(updatedQuestion, { status: 200 });

    } catch (error) {
        // Pengecekan NotFoundError Prisma jika ID tidak ditemukan (P2025)
        if (error && error.code === 'P2025') {
             return NextResponse.json(
                { error: `Pertanyaan dengan ID ${questionId} tidak ditemukan.` },
                { status: 404 }
            );
        }
        console.error(`Prisma/General Error (PUT Question ${questionId}):`, error);
        return NextResponse.json(
            { error: "Gagal memperbarui pertanyaan. Pastikan ID dan format data sudah benar." },
            { status: 500 }
        );
    }
}

/**
 * @route DELETE /api/backend/questions/[id]
 * @description Menghapus pertanyaan berdasarkan ID (Delete)
 */
export async function DELETE(request, context) {
    const questionId = parseInt(context.params.id);

    if (isNaN(questionId)) {
        return NextResponse.json(
            { error: "ID Pertanyaan tidak valid." },
            { status: 400 }
        );
    }

    try {
        await prisma.questions.delete({
            where: { id: questionId },
        });

        return NextResponse.json({ message: "Pertanyaan berhasil dihapus" }, { status: 200 });

    } catch (error) {
        if (error && error.code === 'P2025') {
            return NextResponse.json(
                { error: `Pertanyaan dengan ID ${questionId} tidak ditemukan.` },
                { status: 404 }
            );
        }
        console.error(`Prisma/General Error (DELETE Question ${questionId}):`, error);
        return NextResponse.json(
            { error: "Gagal menghapus pertanyaan." },
            { status: 500 }
        );
    }
}

// Alias PUT sebagai PATCH agar endpoint dapat menerima kedua metode
export { PUT as PATCH };