import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";

// Definisi tipe data untuk body request
interface ResponseBody {
    userId: number;
    questionId: number;
    answerValue: string;
    responseSessionId?: string; 
}

/**
 * Fungsi pembantu untuk menghitung skor
 * Saat ini disederhanakan: 1 jika jawaban sesuai, 0 jika tidak.
 * * @param userAnswer Jawaban yang dikirimkan pengguna.
 * @param correctAnswer Jawaban yang benar dari database.
 * @returns Skor yang dihitung (misalnya 1 atau 0).
 */
function calculateScore(userAnswer: string, correctAnswer: string): number {
    // Untuk contoh ini, kita melakukan perbandingan string sederhana (case-insensitive)
    return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim() ? 1 : 0;
}

/**
 * @route POST /api/frontend/api/questions/post
 * @description Menerima dan menyimpan respons (jawaban) dari frontend
 */
export async function POST(request: NextRequest) {
    try {
        // 1. Parse body request dari frontend
        const body: ResponseBody = await request.json();

        // 2. Lakukan validasi input
        const { 
            userId, 
            questionId, 
            answerValue, 
            responseSessionId
        } = body;

        // Pastikan input penting tersedia
        if (!userId || !questionId || !answerValue) {
            return NextResponse.json(
                { error: "Data input tidak lengkap. Diperlukan: userId, questionId, dan answerValue." },
                { status: 400 }
            );
        }

        // 3. Ambil jawaban yang benar dari tabel questions (Wajib untuk menghitung skor)
        const questionData = await prisma.questions.findUnique({
            where: { id: questionId },
            select: { correct_answer: true }
        });

        if (!questionData) {
            return NextResponse.json(
                { error: `Pertanyaan dengan ID ${questionId} tidak ditemukan.` },
                { status: 404 }
            );
        }

        // 4. Hitung skor
        const correctAnswer = questionData.correct_answer;

        // ✅ Penanganan Null Check: Memastikan correct_answer ada sebelum dikirim ke calculateScore
        if (correctAnswer === null) {
            return NextResponse.json(
                { error: "Jawaban yang benar (correct_answer) tidak ditemukan untuk pertanyaan ini." },
                { status: 500 }
            );
        }
        
        const calculatedScore = calculateScore(answerValue, correctAnswer);
        
        // 5. Simpan respons ke database
        // Menggunakan prisma.responses.create sesuai skema Anda
        const newResponse = await prisma.responses.create({
            data: {
                user_id: userId,
                question_id: questionId,
                answer_value: answerValue,
                calculated_score: calculatedScore,
                ...(responseSessionId && { response_session_id: responseSessionId })
            },
            // Pilih data yang ingin dikembalikan ke frontend
            select: {
                id: true,
                user_id: true,
                question_id: true,
                answer_value: true,
                calculated_score: true,
                submitted_at: true,
                response_session_id: true,
            }
        });

        // 6. Kirim respons berhasil ke frontend
        return NextResponse.json(
            { 
                message: "Respons berhasil disimpan.", 
                response: newResponse 
            }, 
            { status: 201 } // 201 Created
        );

    } catch (error: any) { 
        console.error("Error menyimpan respons:", error);
        
        // Tangani error spesifik Prisma, misalnya Foreign Key Constraint (P2003)
        let status = 500;
        let errorMessage = "Gagal menyimpan respons karena kesalahan server internal.";

        if (error && error.code === 'P2003') { 
            status = 400;
            errorMessage = "Gagal menyimpan. Pastikan User ID dan Question ID yang diberikan valid.";
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: status }
        );
    }
}