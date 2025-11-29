// Path: app/api/backend/responses/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; 

/**
 * @route GET /api/backend/responses
 * @description Mengambil daftar ringkasan pengguna yang sudah merespons (Group By User)
 */
export async function GET() {
    try {
        // Menggunakan GROUP BY implisit melalui aggregation dan grouping
        const userResponsesSummary = await prisma.responses.groupBy({
            by: ['user_id'], // Kelompokkan berdasarkan ID pengguna
            _count: {
                id: true, // Hitung jumlah respons untuk setiap pengguna
            },
            orderBy: {
                _count: {
                    id: 'desc', // Urutkan dari pengguna dengan respons terbanyak
                },
            },
        });

        // Ambil data detail pengguna (nama lengkap) untuk user_id yang didapat
        const userIds = userResponsesSummary.map(summary => summary.user_id);

        const usersData = await prisma.users.findMany({
            where: {
                id: { in: userIds }
            },
            select: {
                id: true,
                namalengkap: true,
                email: true, // Tambahkan email untuk identifikasi
            }
        });

        // Gabungkan data ringkasan dengan data detail pengguna
        const finalSummary = userResponsesSummary.map(summary => {
            const user = usersData.find(u => u.id === summary.user_id);
            return {
                user_id: summary.user_id,
                total_responses: summary._count.id,
                namalengkap: user?.namalengkap || `User ID ${summary.user_id}`,
                email: user?.email || "-",
            };
        });

        return NextResponse.json(finalSummary);
    } catch (error) {
        console.error("Prisma error (GET Responses Summary):", error);
        return NextResponse.json(
            { error: "Gagal mengambil ringkasan respons pengguna" },
            { status: 500 }
        );
    }
}