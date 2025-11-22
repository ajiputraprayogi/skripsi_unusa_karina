// import { NextResponse, type NextRequest } from "next/server";
// import { prisma } from "@/lib/db";

// // Definisi tipe data untuk body request
// interface ResponseBody {
//     userId: number;
//     questionId: number;
//     answerValue: string;
//     responseSessionId?: string; 
// }

// /**
//  * Fungsi pembantu untuk menghitung skor
//  * Saat ini disederhanakan: 1 jika jawaban sesuai, 0 jika tidak.
//  * * @param userAnswer Jawaban yang dikirimkan pengguna.
//  * @param correctAnswer Jawaban yang benar dari database.
//  * @returns Skor yang dihitung (misalnya 1 atau 0).
//  */
// function calculateScore(userAnswer: string, correctAnswer: string): number {
//     // Untuk contoh ini, kita melakukan perbandingan string sederhana (case-insensitive)
//     return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim() ? 1 : 0;
// }

// /**
//  * @route POST /api/frontend/api/questions/post
//  * @description Menerima dan menyimpan respons (jawaban) dari frontend
//  */
// export async function POST(request: NextRequest) {
//     try {
//         // 1. Parse body request dari frontend
//         const body: ResponseBody = await request.json();

//         // 2. Lakukan validasi input
//         const { 
//             userId, 
//             questionId, 
//             answerValue, 
//             responseSessionId
//         } = body;

//         // Pastikan input penting tersedia
//         if (!userId || !questionId || !answerValue) {
//             return NextResponse.json(
//                 { error: "Data input tidak lengkap. Diperlukan: userId, questionId, dan answerValue." },
//                 { status: 400 }
//             );
//         }

//         // 3. Ambil jawaban yang benar dari tabel questions (Wajib untuk menghitung skor)
//         const questionData = await prisma.questions.findUnique({
//             where: { id: questionId },
//             select: { correct_answer: true }
//         });

//         if (!questionData) {
//             return NextResponse.json(
//                 { error: `Pertanyaan dengan ID ${questionId} tidak ditemukan.` },
//                 { status: 404 }
//             );
//         }

//         // 4. Hitung skor
//         const correctAnswer = questionData.correct_answer;

//         // ✅ Penanganan Null Check: Memastikan correct_answer ada sebelum dikirim ke calculateScore
//         if (correctAnswer === null) {
//             return NextResponse.json(
//                 { error: "Jawaban yang benar (correct_answer) tidak ditemukan untuk pertanyaan ini." },
//                 { status: 500 }
//             );
//         }
        
//         const calculatedScore = calculateScore(answerValue, correctAnswer);
        
//         // 5. Simpan respons ke database
//         // Menggunakan prisma.responses.create sesuai skema Anda
//         const newResponse = await prisma.responses.create({
//             data: {
//                 user_id: userId,
//                 question_id: questionId,
//                 answer_value: answerValue,
//                 calculated_score: calculatedScore,
//                 ...(responseSessionId && { response_session_id: responseSessionId })
//             },
//             // Pilih data yang ingin dikembalikan ke frontend
//             select: {
//                 id: true,
//                 user_id: true,
//                 question_id: true,
//                 answer_value: true,
//                 calculated_score: true,
//                 submitted_at: true,
//                 response_session_id: true,
//             }
//         });

//         // 6. Kirim respons berhasil ke frontend
//         return NextResponse.json(
//             { 
//                 message: "Respons berhasil disimpan.", 
//                 response: newResponse 
//             }, 
//             { status: 201 } // 201 Created
//         );

//     } catch (error: any) { 
//         console.error("Error menyimpan respons:", error);
        
//         // Tangani error spesifik Prisma, misalnya Foreign Key Constraint (P2003)
//         let status = 500;
//         let errorMessage = "Gagal menyimpan respons karena kesalahan server internal.";

//         if (error && error.code === 'P2003') { 
//             status = 400;
//             errorMessage = "Gagal menyimpan. Pastikan User ID dan Question ID yang diberikan valid.";
//         }

//         return NextResponse.json(
//             { error: errorMessage },
//             { status: status }
//         );
//     }
// }

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";

// ⚠️ PERUBAHAN: Sekarang Request Body diharapkan berupa ARRAY dari ResponseBody
interface ResponseBody {
    userId: number;
    questionId: number;
    answerValue: string;
    responseSessionId?: string;
}

/**
 * Fungsi pembantu untuk menghitung skor
 */
function calculateScore(userAnswer: string, correctAnswer: string): number {
    return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim() ? 1 : 0;
}

// Tambahkan tipe data untuk respons yang akan dikembalikan
interface SavedResponse {
    id: number;
    user_id: number;
    question_id: number;
    answer_value: string;
    calculated_score: number;
    submitted_at: Date;
    response_session_id: string | null;
}

/**
 * @route POST /api/frontend/api/questions/post
 * @description Menerima dan menyimpan ARRAY respons (jawaban) dari frontend
 */
export async function POST(request: NextRequest) {
    try {
        // 1. Parse body request dari frontend (mengharapkan Array<ResponseBody>)
        const body: ResponseBody[] = await request.json();

        if (!Array.isArray(body) || body.length === 0) {
            return NextResponse.json(
                { error: "Body request harus berupa array non-kosong dari respons." },
                { status: 400 }
            );
        }

        // 2. Kumpulkan semua ID pertanyaan yang perlu dicari jawabannya
        const questionIds = body.map(r => r.questionId);
        
        // 3. Ambil semua jawaban yang benar dalam satu query (lebih efisien)
        const questionsData = await prisma.questions.findMany({
            where: {
                id: { in: questionIds }
            },
            select: { 
                id: true, 
                correct_answer: true 
            }
        });

        // Ubah array menjadi map untuk pencarian cepat O(1)
        const correctAnswerMap = new Map(
            questionsData.map(q => [q.id, q.correct_answer])
        );

        const responsesToSave = body.map(response => {
            const { userId, questionId, answerValue, responseSessionId } = response;

            // Validasi input setiap item
            if (!userId || !questionId || !answerValue) {
                throw new Error("Data input pada salah satu respons tidak lengkap.");
            }

            const correctAnswer = correctAnswerMap.get(questionId);

            // Cek apakah pertanyaan ditemukan dan memiliki jawaban yang benar
            if (correctAnswer === undefined) {
                throw new Error(`Pertanyaan dengan ID ${questionId} tidak ditemukan.`);
            }
            if (correctAnswer === null) {
                // Tangani kasus di mana pertanyaan ditemukan tetapi jawabannya null
                throw new Error(`Jawaban yang benar untuk Pertanyaan ID ${questionId} tidak valid.`);
            }

            // Hitung skor
            const calculatedScore = calculateScore(answerValue, correctAnswer);

            // Kembalikan objek data yang siap untuk disimpan
            return prisma.responses.create({
                data: {
                    user_id: userId,
                    question_id: questionId,
                    answer_value: answerValue,
                    calculated_score: calculatedScore,
                    ...(responseSessionId && { response_session_id: responseSessionId })
                },
                select: { // Pilih data yang ingin dikembalikan
                    id: true,
                    user_id: true,
                    question_id: true,
                    answer_value: true,
                    calculated_score: true,
                    submitted_at: true,
                    response_session_id: true,
                }
            });
        });

        // 5. Simpan semua respons secara paralel
        const savedResponses: SavedResponse[] = await prisma.$transaction(responsesToSave);

        // 6. Kirim respons berhasil ke frontend
        return NextResponse.json(
            { 
                message: `${savedResponses.length} respons berhasil disimpan.`, 
                responses: savedResponses 
            }, 
            { status: 201 } // 201 Created
        );

    } catch (error: any) { 
        console.error("Error menyimpan respons massal:", error);
        
        let status = 500;
        let errorMessage = "Gagal menyimpan respons karena kesalahan server internal.";

        // Tangani error spesifik Prisma
        if (error && error.code === 'P2003') { 
            status = 400;
            errorMessage = "Gagal menyimpan. Pastikan User ID dan Question ID pada semua respons valid.";
        } else if (error instanceof Error) {
            // Tangani error yang di-throw secara manual (seperti 'Data input tidak lengkap')
            status = 400;
            errorMessage = error.message;
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: status }
        );
    }
}