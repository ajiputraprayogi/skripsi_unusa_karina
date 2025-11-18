// Path: app/api/backend/questions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // Sesuaikan path ini jika perlu

// Tipe untuk body request POST (untuk keamanan TypeScript)
interface QuestionData {
    category: string;
    question_text: string;
    question_type: 'benar_salah' | 'skala_positif' | 'skala_negatif';
    correct_answer: string; // String JSON yang berisi detail jawaban/skala
}


/**
 * @route GET /api/backend/questions
 * @description Mengambil semua data pertanyaan beserta detailnya
 */
export async function GET() {
    try {
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
            // Urutkan berdasarkan ID terbaru
            orderBy: { id: "asc" },
        });

        return NextResponse.json(questions);
    } catch (error) {
        console.error("Prisma error (GET Questions):", error);
        return NextResponse.json(
            { error: "Gagal mengambil data pertanyaan" },
            { status: 500 }
        );
    }
}

/**
 * @route POST /api/backend/questions
 * @description Membuat pertanyaan baru (Create)
 */
export async function POST(request: Request) {
    try {
        // Ambil data dari body request
        const body: QuestionData = await request.json();
        
        const { 
            category, 
            question_text, 
            question_type, 
            correct_answer // Ini berisi string JSON dari frontend
        } = body;
        
        // VALIDASI DASAR (Sesuai dengan komponen frontend)
        if (!category || !question_text || !question_type || !correct_answer) {
            return NextResponse.json(
                { error: "Semua field (Kategori, Teks, Tipe, Jawaban) wajib diisi." },
                { status: 400 }
            );
        }

        // Pastikan Tipe Pertanyaan sesuai dengan ENUM Prisma
        const validTypes = ['benar_salah', 'skala_positif', 'skala_negatif'];
        if (!validTypes.includes(question_type)) {
             return NextResponse.json(
                { error: "Tipe pertanyaan tidak valid." },
                { status: 400 }
            );
        }

        // SIMPAN PRISMA
        const newQuestion = await prisma.questions.create({
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

        return NextResponse.json(newQuestion, { status: 201 });
    } catch (error) {
        // Ini akan menangkap kesalahan jika data tidak sesuai dengan skema (misal: panjang string)
        console.error("Prisma/General Error (POST Questions):", error);
        return NextResponse.json(
            { error: "Gagal membuat pertanyaan baru. Pastikan format data sudah benar." },
            { status: 500 }
        );
    }
}