"use client";

import React, { useEffect, useState } from "react";
// Hapus: import withPermission from "@/components/auth/withPermission"; // DIHAPUS
import { useParams, useRouter } from "next/navigation";
import EditUserForm from "./EditUserForm";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

// 📝 Interface User disesuaikan dengan data lengkap dari EditUserForm
interface User {
    id: number;
    namalengkap: string; // Ganti 'nama'
    email: string;
    // Hapus: roleId: number | null; 
    
    // Tambahkan field data pribadi
    tanggallahir: string | null;
    pendidikan: string | null;
    alamat: string | null;
    pekerjaan: string | null;
    namaanak: string | null;
    tanggallahiranak: string | null;
    jeniskelaminanak: "Laki_laki" | "Perempuan" | null;
}

function EditUserPage() {
    const params = useParams();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 📝 Menghindari error params?.id saat mount
    const userId = params?.id;
    const userIdString = Array.isArray(userId) ? userId[0] : userId;

    useEffect(() => {
        if (!userIdString) {
            setError("User ID tidak ditemukan");
            setLoading(false);
            return;
        }

        async function fetchUser() {
            try {
                // Endpoint fetch user by ID
                const res = await fetch(`/api/backend/users/edit/${userIdString}`);
                
                if (!res.ok) {
                    if (res.status === 404) {
                        setError("User tidak ditemukan");
                    } else {
                        throw new Error("Gagal mengambil data user");
                    }
                    setUser(null);
                    return;
                }
                
                const data: User = await res.json();
                
                // Pastikan nama property yang digunakan di sini adalah namalengkap
                // Jika API Anda masih mengirimkan 'nama', Anda perlu menyesuaikannya di API handler
                // atau memetakan data di sini. Namun, kita asumsikan API sudah mengirim data lengkap User.
                setUser(data);
                
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Error saat mengambil data");
                }
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [userIdString]); // Dependensi diperbarui ke userIdString

    if (loading) return <> 
        <PageBreadcrumb pageTitle="Data Users" /> {/* ✅ Judul diperbaiki */}
        <ComponentCard title="Form Edit User"> {/* ✅ Judul diperbaiki */}
            <p>Loading...</p>
        </ComponentCard>
    </>;

    if (error)
        return (
            <p className="text-center py-4 text-red-600">
                Error: {error}
            </p>
        );

    if (!user)
        return (
            <p className="text-center py-4">
                User tidak ditemukan
            </p>
        );

    return (
        <div>
            <PageBreadcrumb pageTitle="Data Users" />
            <ComponentCard title="Form Edit User">
                <EditUserForm user={user} />
            </ComponentCard>
        </div>
    );
}

// ✅ Export langsung tanpa withPermission
export default EditUserPage;