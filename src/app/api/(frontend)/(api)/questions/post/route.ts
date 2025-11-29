// import { NextResponse, type NextRequest } from "next/server";
// import { prisma } from "@/lib/db";

// // ⚠️ PERUBAHAN: Sekarang Request Body diharapkan berupa ARRAY dari ResponseBody
// interface ResponseBody {
//     userId: number;
//     questionId: number;
//     answerValue: string;
//     responseSessionId?: string;
//     soal: string;
// }

// /**
//  * Fungsi pembantu untuk menghitung skor
//  */
// function calculateScore(userAnswer: string, correctAnswer: string): number {
//     return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim() ? 1 : 0;
// }

// // Tambahkan tipe data untuk respons yang akan dikembalikan
// interface SavedResponse {
//     id: number;
//     user_id: number;
//     question_id: number;
//     answer_value: string;
//     calculated_score: number;
//     submitted_at: Date;
//     response_session_id: string | null;
//     soal: string;
// }

// /**
//  * @route POST /api/frontend/api/questions/post
//  * @description Menerima dan menyimpan ARRAY respons (jawaban) dari frontend
//  */
// export async function POST(request: NextRequest) {
//     try {
//         // 1. Parse body request dari frontend (mengharapkan Array<ResponseBody>)
//         const body: ResponseBody[] = await request.json();

//         if (!Array.isArray(body) || body.length === 0) {
//             return NextResponse.json(
//                 { error: "Body request harus berupa array non-kosong dari respons." },
//                 { status: 400 }
//             );
//         }

//         // 2. Kumpulkan semua ID pertanyaan yang perlu dicari jawabannya
//         const questionIds = body.map(r => r.questionId);
        
//         // 3. Ambil semua jawaban yang benar dalam satu query (lebih efisien)
//         const questionsData = await prisma.questions.findMany({
//             where: {
//                 id: { in: questionIds }
//             },
//             select: { 
//                 id: true, 
//                 correct_answer: true 
//             }
//         });

//         // Ubah array menjadi map untuk pencarian cepat O(1)
//         const correctAnswerMap = new Map(
//             questionsData.map(q => [q.id, q.correct_answer])
//         );

//         const responsesToSave = body.map(response => {
//             const { userId, questionId, answerValue, responseSessionId, soal = null } = response;

//             // Validasi input setiap item
//             if (!userId || !questionId || !answerValue) {
//                 throw new Error("Data input pada salah satu respons tidak lengkap.");
//             }

//             const correctAnswer = correctAnswerMap.get(questionId);

//             // Cek apakah pertanyaan ditemukan dan memiliki jawaban yang benar
//             if (correctAnswer === undefined) {
//                 throw new Error(`Pertanyaan dengan ID ${questionId} tidak ditemukan.`);
//             }
//             if (correctAnswer === null) {
//                 // Tangani kasus di mana pertanyaan ditemukan tetapi jawabannya null
//                 throw new Error(`Jawaban yang benar untuk Pertanyaan ID ${questionId} tidak valid.`);
//             }

//             // Hitung skor
//             const calculatedScore = calculateScore(answerValue, correctAnswer);

//             // Kembalikan objek data yang siap untuk disimpan
//             return prisma.responses.create({
//                 data: {
//                     user_id: userId,
//                     question_id: questionId,
//                     answer_value: answerValue,
//                     calculated_score: calculatedScore,
//                     soal: soal,
//                     ...(responseSessionId && { response_session_id: responseSessionId })
//                 },
//                 select: { // Pilih data yang ingin dikembalikan
//                     id: true,
//                     user_id: true,
//                     question_id: true,
//                     answer_value: true,
//                     calculated_score: true,
//                     submitted_at: true,
//                     response_session_id: true,
//                 }
//             });
//         });

//         // 5. Simpan semua respons secara paralel
//         const savedResponses: SavedResponse[] = await prisma.$transaction(responsesToSave);

//         // 6. Kirim respons berhasil ke frontend
//         return NextResponse.json(
//             { 
//                 message: `${savedResponses.length} respons berhasil disimpan.`, 
//                 responses: savedResponses 
//             }, 
//             { status: 201 } // 201 Created
//         );

//     } catch (error: any) { 
//         console.error("Error menyimpan respons massal:", error);
        
//         let status = 500;
//         let errorMessage = "Gagal menyimpan respons karena kesalahan server internal.";

//         // Tangani error spesifik Prisma
//         if (error && error.code === 'P2003') { 
//             status = 400;
//             errorMessage = "Gagal menyimpan. Pastikan User ID dan Question ID pada semua respons valid.";
//         } else if (error instanceof Error) {
//             // Tangani error yang di-throw secara manual (seperti 'Data input tidak lengkap')
//             status = 400;
//             errorMessage = error.message;
//         }

//         return NextResponse.json(
//             { error: errorMessage },
//             { status: status }
//         );
//     }
// }

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // sesuaikan path authOptions Anda

// Body dari frontend (TIDAK ADA userId LAGI)
interface ResponseBody {
  questionId: number;
  answerValue: string;
  responseSessionId?: string;
  soal?: string; // ✅ optional
}

/**
 * Fungsi pembantu untuk menghitung skor
 */
function calculateScore(userAnswer: string, correctAnswer: string): number {
  return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
    ? 1
    : 0;
}

export async function POST(request: NextRequest) {
  try {
    // ✅ 1. Ambil userId dari SESSION
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "User belum login" },
        { status: 401 }
      );
    }

    const userId = Number(session.user.id);

    // ✅ 2. Ambil body
    const body: ResponseBody[] = await request.json();

    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { error: "Body harus berupa array non-kosong." },
        { status: 400 }
      );
    }

    // ✅ 3. Ambil semua correct answer sekaligus
    const questionIds = body.map(r => r.questionId);

    const questionsData = await prisma.questions.findMany({
      where: { id: { in: questionIds } },
      select: { id: true, correct_answer: true },
    });

    const correctAnswerMap = new Map(
      questionsData.map(q => [q.id, q.correct_answer])
    );

    // ✅ 4. Siapkan data untuk transaction
    const responsesToSave = body.map((response) => {
      const {
        questionId,
        answerValue,
        responseSessionId,
        soal = null
      } = response;

      // ✅ VALIDASI YANG BENAR
      if (!questionId || !answerValue) {
        throw new Error("questionId dan answerValue wajib diisi.");
      }

      const correctAnswer = correctAnswerMap.get(questionId);

      if (correctAnswer === undefined) {
        throw new Error(`Pertanyaan ID ${questionId} tidak ditemukan.`);
      }
      if (correctAnswer === null) {
        throw new Error(`Jawaban benar untuk ID ${questionId} tidak valid.`);
      }

      const calculatedScore = calculateScore(answerValue, correctAnswer);

      return prisma.responses.create({
        data: {
          user_id: userId, // ✅ dari SESSION
          question_id: questionId,
          answer_value: answerValue,
          calculated_score: calculatedScore,
          soal: soal, // ✅ boleh null (POST TEST)
          ...(responseSessionId && {
            response_session_id: responseSessionId,
          }),
        },
      });
    });

    // ✅ 5. Simpan dengan transaction
    const savedResponses = await prisma.$transaction(responsesToSave);

    return NextResponse.json(
      {
        message: `${savedResponses.length} respons berhasil disimpan.`,
        responses: savedResponses,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Error menyimpan respons massal:", error);

    let status = 500;
    let errorMessage = "Gagal menyimpan respons.";

    if (error?.code === "P2003") {
      status = 400;
      errorMessage = "User ID atau Question ID tidak valid.";
    } else if (error instanceof Error) {
      status = 400;
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
}
