// Path: src/app/(backend)/backend/(admin)/(menu)/responses/page.tsx
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
import Button from "@/components/ui/button/Button"; 

// Tipe untuk Ringkasan Respons (sesuai output API /api/backend/responses)
type UserSummary = {
    user_id: number;
    namalengkap: string;
    email: string;
    total_responses: number;
};

function ResponseSummaryPage() {
    const router = useRouter();
    const [summary, setSummary] = useState<UserSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Ringkasan Respons Pengguna | Admin Panel";
        fetchSummary();
    }, []);

    async function fetchSummary() {
        setLoading(true);
        try {
            // Memanggil API ringkasan (group by user)
            const res = await fetch("/api/backend/responses", { cache: "no-store" }); 
            if (!res.ok) throw new Error("Gagal memuat ringkasan respons");
            const data = await res.json();
            setSummary(data);
        } catch (err: unknown) {
            Swal.fire("Error", err instanceof Error ? err.message : "Terjadi kesalahan", "error");
        } finally {
            setLoading(false);
        }
    }
    
    function handleViewDetail(userId: number) {
        // Arahkan ke halaman detail: /backend/responses/123
        router.push(`/backend/responses/${userId}`); 
    }

    if (loading) { 
        return (
            <>
                <PageBreadcrumb pageTitle="Ringkasan Respons Pengguna" />
                <ComponentCard title="Ringkasan Respons Table">
                    <SkeletonTable />
                </ComponentCard>
            </>
        );
    }

    return (
        <div>
            <PageBreadcrumb pageTitle="Ringkasan Respons Pengguna" />
            <ComponentCard title="Data Ringkasan per Pengguna">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">
                        <div className="min-w-[800px]">
                            <Table>
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-2/6">
                                            Nama Lengkap
                                        </TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-2/6">
                                            Email / User ID
                                        </TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400 w-1/6">
                                            Total Respons
                                        </TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400 w-1/6">
                                            Action
                                        </TableCell>
                                    </TableRow>
                                </TableHeader>

                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {summary.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-6 text-gray-500 dark:text-gray-400">
                                                Tidak ada pengguna yang memberikan respons.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        summary.map((user) => (
                                            <TableRow key={user.user_id}>
                                                {/* Kolom Nama Lengkap */}
                                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                    <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {user.namalengkap}
                                                    </span>
                                                </TableCell>

                                                {/* Kolom Email / User ID */}
                                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                    <span className="block text-gray-500 text-sm dark:text-gray-400">
                                                        {user.email || `ID: ${user.user_id}`}
                                                    </span>
                                                </TableCell>
                                                
                                                {/* Kolom Total Respons */}
                                                <TableCell className="px-5 py-4 sm:px-6 text-center">
                                                    <span className="block text-gray-800 text-theme-sm dark:text-white/90 font-bold">
                                                        {user.total_responses}
                                                    </span>
                                                </TableCell>

                                                {/* Actions */}
                                                <TableCell className="px-5 py-4 sm:px-6 text-center">
                                                    <Button
                                                        size="xs"
                                                        variant="primary"
                                                        onClick={() => handleViewDetail(user.user_id)}
                                                    >
                                                        Lihat Detail
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
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

export default ResponseSummaryPage;