// Path: src/app/(backend)/backend/(admin)/(menu)/responses/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { id } from "date-fns/locale"; 
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import SkeletonTable from "@/components/skeleton/Table";
import Button from "@/components/ui/button/Button";

// --- TIPE DATA ---
type QuestionType = 'benar_salah' | 'skala_positif' | 'skala_negatif' | string;

type DetailResponse = {
    id: number;
    answer_value: string;
    submitted_at: string;
    response_session_id: string;
    questions: {
        id: number;
        question_text: string; 
        question_type: QuestionType; 
        correct_answer: string; // Kunci jawaban dalam format JSON string
    }
};

type UserDetail = {
    namalengkap: string;
    email: string;
}

type ResponseDetailState = {
    user: UserDetail | null;
    responses: DetailResponse[];
}

interface UserResponseDetailProps {
    params: {
        id: string; // user_id dari URL
    }
}

// --- FUNGSI HELPER: Menghitung Skor Real-Time & Kunci Jawaban/Opsi ---

/**
 * Menghitung skor dan menentukan tampilan kunci jawaban/opsi berdasarkan tipe soal.
 * Sekarang mengimplementasikan tampilan grid/card untuk Skala yang mirip template edit.
 * * @param response Data respons dari API.
 * @returns Objek yang berisi skor yang dihitung, tampilan kunci jawaban/opsi (JSX), dan status tampilan.
 */
function calculateScoreAndCorrectness(response: DetailResponse) {
    const { question_type, correct_answer } = response.questions;
    const userAnswer = response.answer_value;

    let calculatedScore: number = 0;
    // Tipe data untuk tampilan kunci: string (Benar/Salah) atau JSX.Element (Skala)
    let correctAnswerDisplay: string | React.ReactNode = ""; 
    let statusText: string = "N/A";
    let statusClass: string = "bg-gray-100 text-gray-700";

    try {
        const parsedCorrect = JSON.parse(correct_answer);

        if (question_type === 'benar_salah') {
            const correctAnswerValue = parsedCorrect.answer;
            const isCorrect = userAnswer.toLowerCase() === correctAnswerValue.toLowerCase();

            correctAnswerDisplay = (
                <span className="font-bold text-lg">{correctAnswerValue}</span>
            );
            if (isCorrect) {
                calculatedScore = 1; 
                statusText = "JAWABAN TEPAT";
                statusClass = "bg-green-100 text-green-700";
            } else {
                calculatedScore = 0;
                statusText = "JAWABAN SALAH";
                statusClass = "bg-red-100 text-red-700";
            }
        
        } else if (question_type.startsWith('skala')) {
            const options = parsedCorrect.options as { text: string, point: number }[];
            
            // 1. Hitung Skor Real-Time (Mencari poin dari teks jawaban pengguna)
            const selectedOption = options.find(opt => opt.text === userAnswer);
            calculatedScore = selectedOption ? selectedOption.point : 0; 

            // 2. Tentukan Tampilan Kunci/Opsi (Semua opsi dengan bobot skornya - MIRIP TEMPLATE EDIT)
            correctAnswerDisplay = (
                <div className="grid grid-cols-2 gap-3 mt-2">
                    {options.map((option, index) => {
                        const isUserAnswer = option.text === userAnswer;
                        const bgColor = isUserAnswer ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-400' : 'bg-white dark:bg-gray-700/50 border-gray-200';
                        const textColor = option.point > 2 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

                        return (
                            <div 
                                key={index} 
                                className={`flex items-center justify-between p-2 border rounded-md ${bgColor} text-sm`}
                            >
                                <span className={`font-medium ${isUserAnswer ? 'text-blue-800 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
                                    {option.text} 
                                </span>
                                <span className={`text-sm font-bold ${textColor}`}>
                                    ({option.point} poin)
                                </span>
                            </div>
                        );
                    })}
                </div>
            );
            
            // 3. Tentukan Tampilan Status (Skor eksplisit)
            statusText = `SKOR: ${calculatedScore}`;
            if (calculatedScore >= 3) {
                 statusClass = "bg-blue-100 text-blue-700"; 
            } else if (calculatedScore >= 1) {
                statusClass = "bg-yellow-100 text-yellow-700"; 
            } else {
                statusClass = "bg-gray-100 text-gray-700";
            }
        } else {
            calculatedScore = 0;
            statusText = "TIPE SOAL TIDAK DIKENAL";
            correctAnswerDisplay = "N/A";
            statusClass = "bg-gray-200 text-gray-800";
        }

    } catch (e) {
        correctAnswerDisplay = 'Gagal Parsing Kunci';
        calculatedScore = 0;
        statusText = 'DATA ERROR';
        statusClass = 'bg-red-500 text-white';
    }

    const display = (
        <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${statusClass}`}>
            {statusText}
        </span>
    );
    
    return { calculatedScore, correctAnswerDisplay, display }; 
}

const formatQuestionType = (type: string) => {
    return type.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// --- KOMPONEN KLIEN UTAMA ---
function UserResponseDetailClient({ params }: UserResponseDetailProps) {
    const userId = parseInt(params.id); 
    const router = useRouter();

    const [data, setData] = useState<ResponseDetailState | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isNaN(userId)) {
            setError("ID pengguna tidak valid.");
            setLoading(false);
            return;
        }
        document.title = `Detail Respons User ${userId} | Admin Panel`;
        fetchDetail();
    }, [userId]);

    async function fetchDetail() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/backend/responses/user/${userId}`, { cache: "no-store" }); 
            
            if (!res.ok) {
                 const err = await res.json();
                 throw new Error(err.error || `Gagal memuat detail respons untuk User ID ${userId}`);
            }

            const fetchedData = await res.json();
            setData(fetchedData);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui.";
            setError(errorMessage);
            Swal.fire("Error", errorMessage, "error");
        } finally {
            setLoading(false);
        }
    }
    
    if (loading) { 
        return (
            <>
                <PageBreadcrumb pageTitle="Detail Respons Pengguna" />
                <ComponentCard title="Memuat Detail...">
                    <SkeletonTable />
                </ComponentCard>
            </>
        );
    }
    
    if (error) {
        return (
             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-6" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline ml-2">{error}</span>
            </div>
        );
    }

    const userDetail = data?.user;
    const responses = data?.responses || [];

    return (
        <div>
            <PageBreadcrumb pageTitle="Detail Respons Pengguna" />
            
            <ComponentCard title={`Detail Respons: ${userDetail?.namalengkap || `User ID ${userId}`}`}>
                
                {/* Info Pengguna */}
                <div className="mb-6 space-y-2 p-3 border rounded-lg bg-gray-50 dark:bg-white/[0.05]">
                    <p className="text-theme-sm dark:text-gray-300">
                        <strong>Nama Lengkap:</strong> {userDetail?.namalengkap || 'N/A'}
                    </p>
                    <p className="text-theme-sm dark:text-gray-300">
                        <strong>Email:</strong> {userDetail?.email || 'N/A'}
                    </p>
                    <p className="text-theme-sm dark:text-gray-300">
                        <strong>Total Respons Ditemukan:</strong> {responses.length}
                    </p>
                </div>

                {/* Daftar Detail Respons (Format Card) */}
                <div className="space-y-6">
                    {responses.length === 0 ? (
                        <div className="text-center py-6 text-gray-500 dark:text-gray-400 border rounded-lg">
                            Pengguna ini belum memiliki detail respons.
                        </div>
                    ) : (
                        responses.map((response, index) => {
                            // Menggunakan fungsi calculateScoreAndCorrectness untuk mendapatkan skor dan status terbaru
                            const { calculatedScore, correctAnswerDisplay, display: correctnessDisplay } = calculateScoreAndCorrectness(response);
                            
                            // Menentukan Judul Bagian Kunci Jawaban/Opsi
                            const keyTitle = response.questions.question_type === 'benar_salah' 
                                ? 'Kunci Jawaban' 
                                : 'Opsi Jawaban & Bobot Skor';

                            return (
                                <div 
                                    key={response.id} 
                                    className="p-5 border border-gray-200 rounded-lg shadow-md bg-white dark:bg-white/[0.03]"
                                >
                                    <div className="flex justify-between items-start mb-3 border-b pb-3">
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                                            Respons Ke-{index + 1}
                                        </h3>
                                        {correctnessDisplay}
                                    </div>

                                    {/* Bagian Pertanyaan */}
                                    <div className="mb-4">
                                        <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Pertanyaan:</p>
                                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-gray-900 dark:text-white whitespace-pre-wrap">
                                            {response.questions.question_text}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Tipe: {formatQuestionType(response.questions.question_type)}
                                        </p>
                                    </div>

                                    {/* Bagian Kunci Jawaban / Opsi Bobot (Disesuaikan untuk Skala) */}
                                    <div className="mb-4 p-3 border border-dashed border-gray-300 rounded-md">
                                        <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {keyTitle}:
                                        </p>
                                        <div className="text-gray-900 dark:text-gray-200 font-normal">
                                            {correctAnswerDisplay} 
                                        </div>
                                    </div>

                                    {/* Bagian Jawaban Pengguna */}
                                    <div className="mb-4">
                                        <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Jawaban Pengguna:</p>
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/50 border border-blue-200 rounded-md text-blue-800 dark:text-blue-100 font-semibold">
                                            {response.answer_value || "[Tidak Dijawab]"}
                                        </div>
                                    </div>
                                    
                                    {/* Bagian Detail Skor & Waktu */}
                                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 border-t pt-3">
                                        <div>
                                            <strong>Skor Real-Time:</strong> 
                                            <span className="ml-2 font-bold text-lg text-gray-800 dark:text-white">
                                                {calculatedScore}
                                            </span>
                                        </div>
                                        <div>
                                            <strong>Waktu Submit:</strong> 
                                            <span className="ml-2">
                                                {format(new Date(response.submitted_at), "dd MMM yyyy, HH:mm", { locale: id })}
                                            </span>
                                        </div>
                                        <div className="col-span-2 overflow-hidden truncate" title={response.response_session_id}>
                                            <strong>ID Sesi Respons:</strong> {response.response_session_id}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Tombol Kembali */}
                <div className="flex justify-start pt-6 border-t border-gray-200 mt-6">
                    <Button
                        size="sm"
                        variant="danger"
                        onClick={() => router.push("/backend/responses")}
                    >
                        &larr; Kembali ke Ringkasan Respons
                    </Button>
                </div>
            </ComponentCard>
        </div>
    );
}


// --- KOMPONEN SERVER/PAGE YANG DIEKSPOR SECARA DEFAULT ---
export default function UserResponseDetailPage({ params }: any) {
    const typedParams: { id: string } = params;
    return <UserResponseDetailClient params={typedParams} />;
}