"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select"; // Diperlukan untuk field Pendidikan
import Button from "@/components/ui/button/Button";
import Swal from "sweetalert2";

interface User {
    id: number;
    namalengkap: string; 
    email: string;
    tanggallahir: string | null;
    pendidikan: string | null; // Tipe tetap string
    alamat: string | null;
    pekerjaan: string | null;
    namaanak: string | null;
    tanggallahiranak: string | null;
    jeniskelaminanak: "Laki_laki" | "Perempuan" | null; // Tipe disesuaikan dengan skema Prisma 'Laki_laki'
}

export default function EditUserForm({ user }: { user: User }) {
    const router = useRouter();

    // State disesuaikan dengan field model users
    const [namalengkap, setNamaLengkap] = useState(user.namalengkap || "");
    const [email, setEmail] = useState(user.email || "");
    
    // Data Pribadi
    const [tanggallahir, setTanggalLahir] = useState<string>(user.tanggallahir || "");
    const [pendidikan, setPendidikan] = useState(user.pendidikan || ""); // Pendidikan diubah ke Select
    const [alamat, setAlamat] = useState(user.alamat || "");
    const [pekerjaan, setPekerjaan] = useState(user.pekerjaan || "");
    
    // Data Anak
    const [namaanak, setNamaAnak] = useState(user.namaanak || "");
    const [tanggallahiranak, setTanggalLahirAnak] = useState<string>(user.tanggallahiranak || "");
    // ✅ PERBAIKAN ENUM: Menggunakan Laki_laki/Perempuan sesuai skema Prisma
    const [jeniskelaminanak, setJenisKelaminAnak] = useState<string>(user.jeniskelaminanak || "Laki_laki");

    const [loading, setLoading] = useState(false);
    
    // Sinkronisasi state saat props user berubah
    useEffect(() => {
        setNamaLengkap(user.namalengkap || "");
        setEmail(user.email || "");
        setTanggalLahir(user.tanggallahir || "");
        setPendidikan(user.pendidikan || "");
        setAlamat(user.alamat || "");
        setPekerjaan(user.pekerjaan || "");
        setNamaAnak(user.namaanak || "");
        setTanggalLahirAnak(user.tanggallahiranak || "");
        // ✅ PERBAIKAN ENUM: Menggunakan Laki_laki/Perempuan sesuai skema Prisma
        setJenisKelaminAnak(user.jeniskelaminanak || "Laki_laki"); 
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const body: any = {
            namalengkap,
            email,
            tanggallahir: tanggallahir || null,
            pendidikan: pendidikan || null,
            alamat: alamat || null,
            pekerjaan: pekerjaan || null,
            namaanak: namaanak || null,
            tanggallahiranak: tanggallahiranak || null,
            jeniskelaminanak: namaanak ? jeniskelaminanak : null, 
        };

        try {
            const res = await fetch(`/api/backend/users/edit/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            
            const data = await res.json();

            if (!res.ok) {
                console.error("API Error:", data);
                Swal.fire("Gagal", data.error || "Gagal mengupdate user.", "error");
                setLoading(false);
                return;
            }

            Swal.fire("Berhasil!", "User berhasil diupdate.", "success");
            router.push("/backend/users");
            
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Gagal mengupdate user.", "error");
            setLoading(false);
        }
    };
    
    // Opsi Jenis Kelamin Anak (Diperbaiki agar sesuai dengan ENUM Prisma)
    const jkOptions = [
        { value: "Laki_laki", label: "Laki-laki" }, // Sesuaikan dengan 'Laki_laki'
        { value: "Perempuan", label: "Perempuan" },
    ];
    
    // 📝 Opsi Pendidikan Baru
    const pendidikanOptions = [
        { value: "SD", label: "SD" },
        { value: "SMP", label: "SMP" },
        { value: "SMA", label: "SMA" },
        { value: "S1", label: "S1" },
        { value: "S2", label: "S2" },
        { value: "S3", label: "S3" },
    ];


    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <h3 className="col-span-full font-semibold text-lg border-b pb-2 mb-2">Data Akun</h3>
            
            {/* Nama Lengkap */}
            <div>
                <Label>Nama Lengkap</Label>
                <Input
                    type="text"
                    value={namalengkap}
                    onChange={(e) => setNamaLengkap(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Input Nama Lengkap"
                />
            </div>
            
            {/* Email */}
            <div>
                <Label>Email</Label>
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Input Email"
                />
            </div>
            
            <h3 className="col-span-full font-semibold text-lg border-b pb-2 mb-2 mt-4">Data Pribadi Ibu</h3>

            {/* Tanggal Lahir */}
            <div>
                <Label htmlFor="tanggallahir">Tanggal Lahir</Label>
                <Input 
                    type="date" 
                    id="tanggallahir" 
                    name="tanggallahir" 
                    value={tanggallahir}
                    onChange={(e) => setTanggalLahir(e.target.value)}
                    disabled={loading}
                />
            </div>
            
            {/* ✅ Pendidikan (Select) */}
            <div>
                <Label htmlFor="pendidikan">Pendidikan</Label>
                <Select
                    options={pendidikanOptions}
                    placeholder="Pilih Jenjang Pendidikan"
                    value={pendidikan}
                    onChange={(val) => setPendidikan(val.toString())}
                    className="dark:bg-dark-900"
                    disabled={loading}
                />
            </div>

            {/* Pekerjaan */}
            <div>
                <Label htmlFor="pekerjaan">Pekerjaan</Label>
                <Input 
                    type="text" 
                    id="pekerjaan" 
                    name="pekerjaan" 
                    value={pekerjaan}
                    onChange={(e) => setPekerjaan(e.target.value)}
                    placeholder="Input Pekerjaan"
                    disabled={loading}
                />
            </div>

            {/* Alamat */}
            <div className="md:col-span-2">
                <Label htmlFor="alamat">Alamat</Label>
                <Input 
                    type="text" 
                    id="alamat" 
                    name="alamat" 
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    placeholder="Input Alamat Lengkap"
                    disabled={loading}
                />
            </div>

            <h3 className="col-span-full font-semibold text-lg border-b pb-2 mb-2 mt-4">Data Anak</h3>

            {/* Nama Anak */}
            <div>
                <Label htmlFor="namaanak">Nama Anak</Label>
                <Input 
                    type="text" 
                    id="namaanak" 
                    name="namaanak" 
                    value={namaanak}
                    onChange={(e) => setNamaAnak(e.target.value)}
                    placeholder="Input Nama Anak"
                    disabled={loading}
                />
            </div>

            {/* Tanggal Lahir Anak */}
            <div>
                <Label htmlFor="tanggallahiranak">Tanggal Lahir Anak</Label>
                <Input 
                    type="date" 
                    id="tanggallahiranak" 
                    name="tanggallahiranak" 
                    value={tanggallahiranak}
                    onChange={(e) => setTanggalLahirAnak(e.target.value)}
                    disabled={loading}
                />
            </div>
            
            {/* Jenis Kelamin Anak */}
            <div>
                <Label htmlFor="jeniskelaminanak">Jenis Kelamin Anak</Label>
                <Select
                    options={jkOptions}
                    placeholder="Pilih Jenis Kelamin"
                    value={jeniskelaminanak} 
                    onChange={(val) => setJenisKelaminAnak(val.toString())}
                    className="dark:bg-dark-900"
                    disabled={loading || !namaanak}
                />
            </div>
            
            <div className="md:col-span-2 flex justify-end gap-3 mt-6">
                <Button
                    size="sm"
                    variant="danger"
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        router.back();
                    }}
                    disabled={loading}
                >
                    Kembali
                </Button>

                <Button size="sm" variant="green" type="submit" disabled={loading}>
                    {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
            </div>
        </form>
    );
}