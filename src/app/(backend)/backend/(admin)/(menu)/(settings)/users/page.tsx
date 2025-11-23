"use client";

import React, { useEffect, useState } from "react";
// Import-import lainnya sudah benar
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Button from "@/components/ui/button/Button";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import AddUserButton from "./AddUserButton";
import SkeletonTable from "@/components/skeleton/Table";

// 📝 Tipe data disederhanakan sesuai tabel public.users (tanpa Role)
type User = {
    id: number;
    namalengkap: string; // ✅ Sudah benar
    email: string;
};

function UsersPage() {
    const router = useRouter();

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Data Users | Admin Panel";
        fetchUsers();
    }, []);

    async function fetchUsers() {
        setLoading(true);
        try {
            // Endpoint yang kita buat di route handler sebelumnya mengirimkan properti 'nama'
            const res = await fetch("/api/backend/users", { cache: "no-store" });
            if (!res.ok) throw new Error("Gagal memuat data users");
            
            // ⚠️ CATATAN: Karena API handler kita mengubah properti 'namalengkap' menjadi 'nama'
            // di respons JSON, kita perlu menyesuaikan tipe data di sini. 
            // Namun, untuk menjaga komponen ini tetap konsisten dengan model Prisma (namalengkap),
            // kita akan asumsikan API mengirimkan namalengkap ATAU menyesuaikan map datanya di API.

            // Berdasarkan API handler terakhir yang kita buat, tipe responsnya adalah:
            // type UserApi = { id: number; nama: string; email: string; };
            // Jika Anda ingin mempertahankan `namalengkap` di komponen ini, kita harus konversi di sini, 
            // atau kembali ke API handler dan pastikan ia mengirim `namalengkap`.
            
            // Mengikuti tipe data User di atas (namalengkap) dan untuk konsistensi:
            const data: User[] = await res.json();
            setUsers(data);
        } catch (error: unknown) {
            Swal.fire("Error", error instanceof Error ? error.message : "Terjadi kesalahan", "error");
        } finally {
            setLoading(false);
        }
    }

    function handleEdit(id: number) {
        router.push(`/backend/users/edit/${id}`);
    }

    async function handleDelete(id: number) {
        const result = await Swal.fire({
            title: "Yakin ingin menghapus user ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#d33",
            reverseButtons: true,
        });

        if (!result.isConfirmed) return;

        try {
            const res = await fetch(`/api/backend/users/delete/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Gagal menghapus user");

            setUsers((prev) => prev.filter((u) => u.id !== id));
            Swal.fire("Terhapus!", "User berhasil dihapus.", "success");

        } catch (error: unknown) {
            Swal.fire("Error", error instanceof Error ? error.message : "Terjadi kesalahan", "error");
        }
    }

    if (loading) {
        return (
            <>
                <PageBreadcrumb pageTitle="Data Users" />
                <ComponentCard
                    title="Data Users Table"
                    headerRight={<AddUserButton />}
                >
                    <SkeletonTable />
                </ComponentCard>
            </>
        );
    }

    return (
        <div>
            <PageBreadcrumb pageTitle="Data Users" />
            <ComponentCard
                title="Data Users Table"
                headerRight={<AddUserButton />}
            >
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">
                        <div className="min-w-[800px]">
                            <Table>
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>
                                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            Nama Lengkap
                                        </TableCell>
                                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            Email
                                        </TableCell>
                                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHeader>

                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                    {user.namalengkap} {/* ✅ Menggunakan namalengkap */}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                    {user.email}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                                                <Button
                                                    size="xs"
                                                    variant="warning"
                                                    type="button"
                                                    onClick={() => handleEdit(user.id)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    variant="danger"
                                                    type="button"
                                                    className="ml-2"
                                                    onClick={() => handleDelete(user.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </ComponentCard>
        </div>
    );
}

export default UsersPage;