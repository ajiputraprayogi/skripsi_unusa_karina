"use client";

import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import SkeletonTable from "@/components/skeleton/Table";
// Asumsi Anda akan membuat komponen ini di path yang benar
import AddQuestionButton from "./AddQuestionButton"; 
import Button from "@/components/ui/button/Button";

// Mengganti type Portfolio menjadi Question
type Question = {
    id: number;
    category: string; // @db.VarChar(50)
    question_text: string;
    question_type: string; // question_type (enum/string)
    correct_answer?: string | null; // @db.VarChar
    // responses: any[]; 
};

function QuestionsPage() {
    const router = useRouter();
    // Menghilangkan usePermissions
    const [allQuestions, setAllQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    // Menghilangkan canAdd, canEdit, canDelete karena tidak ada pemeriksaan permission

    useEffect(() => {
        document.title = "Data Pertanyaan | Admin Panel";
        fetchQuestions();
    }, []);

    async function fetchQuestions() {
        setLoading(true);
        try {
            // PERHATIAN: Pastikan API Route Anda sesuai, misalnya: /api/backend/questions
            const res = await fetch("/api/backend/questions", { cache: "no-store" }); 
            if (!res.ok) throw new Error("Gagal memuat data pertanyaan");
            const data = await res.json();
            setAllQuestions(data);
        } catch (err: unknown) {
            Swal.fire("Error", err instanceof Error ? err.message : "Terjadi kesalahan", "error");
        } finally {
            setLoading(false);
        }
    }

    function handleEdit(id: number) {
        // Sesuaikan path ke halaman edit pertanyaan
        router.push(`/backend/questions/${id}`); 
    }

    async function handleDelete(id: number) {
        const result = await Swal.fire({
            title: "Yakin ingin menghapus pertanyaan ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#d33",
            reverseButtons: true,
        });

        if (!result.isConfirmed) return;

        try {
            // Sesuaikan API endpoint untuk DELETE
            const res = await fetch(`/api/backend/questions/${id}`, { method: "DELETE" }); 
            if (!res.ok) throw new Error("Gagal menghapus pertanyaan");

            setAllQuestions((prev) => prev.filter((q) => q.id !== id));
            Swal.fire("Terhapus!", "Pertanyaan berhasil dihapus.", "success");
        } catch (err: unknown) {
            Swal.fire("Error", err instanceof Error ? err.message : "Terjadi kesalahan", "error");
        }
    }

    // Menghilangkan permissionsLoading
    if (loading) { 
        return (
            <>
                <PageBreadcrumb pageTitle="Data Pertanyaan" />
                <ComponentCard title="Data Pertanyaan Table">
                    <SkeletonTable />
                </ComponentCard>
            </>
        );
    }

    return (
        <div>
            <PageBreadcrumb pageTitle="Data Pertanyaan" />
            <ComponentCard
                title="Data Pertanyaan Table"
                headerRight={<AddQuestionButton />} // Tombol Add selalu ditampilkan
            >
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">
                        <div className="min-w-[800px]">
                            <Table>
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-1/5">
                                            Kategori
                                        </TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-2/5">
                                            Teks Pertanyaan
                                        </TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-1/5">
                                            Tipe
                                        </TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400 w-1/5">
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHeader>


                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {allQuestions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-6 text-gray-500 dark:text-gray-400">
                                                Tidak ada data pertanyaan.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        allQuestions.map((question) => {
                                            const questionText = question.question_text ?? "";
                                            const shortQuestionText =
                                                questionText.length > 100
                                                    ? questionText.slice(0, 100) + "..."
                                                    : questionText || "Tidak ada teks pertanyaan";

                                            return (
                                                <TableRow key={question.id}>
                                                    {/* Kolom Kategori */}
                                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                        <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                            {question.category}
                                                        </span>
                                                    </TableCell>

                                                    {/* Kolom Teks Pertanyaan */}
                                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                        <span className="block text-gray-800 text-theme-sm dark:text-white/90">
                                                            {shortQuestionText}
                                                        </span>
                                                    </TableCell>

                                                    {/* Kolom Tipe Pertanyaan */}
                                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                        <span className="block text-gray-500 text-sm dark:text-gray-400 capitalize">
                                                            {question.question_type.replace(/_/g, ' ') ?? "-"}
                                                        </span>
                                                    </TableCell>
                                                    

                                                    {/* Actions */}
                                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                        <div className="flex items-center justify-center gap-0">
                                                            {/* Tombol Edit dan Delete selalu ditampilkan */}
                                                            <Button
                                                                size="xs"
                                                                variant="warning"
                                                                onClick={() => handleEdit(question.id)}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                size="xs"
                                                                variant="danger"
                                                                className="ml-2"
                                                                onClick={() => handleDelete(question.id)}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </ComponentCard>
        </div>
    );
}

// Menghilangkan withPermission
export default QuestionsPage;