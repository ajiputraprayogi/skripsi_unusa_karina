"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import Button from "@/components/ui/button/Button";
import Swal from "sweetalert2"; // Tambahkan SweetAlert untuk feedback

export default function CreateUserForm() {
    const router = useRouter();
    
    // Data Akun
    const [namalengkap, setNamaLengkap] = useState("");
    const [email, setEmail] = useState("");
    
    // Data Pribadi Ibu
    const [tanggallahir, setTanggalLahir] = useState("");
    const [pendidikan, setPendidikan] = useState(""); // Diubah menjadi Select
    const [alamat, setAlamat] = useState("");
    const [pekerjaan, setPekerjaan] = useState("");
    
    // Data Anak
    const [namaanak, setNamaAnak] = useState("");
    const [tanggallahiranak, setTanggalLahirAnak] = useState("");
    // ✅ PERBAIKAN ENUM: Menggunakan 'Laki_laki' sesuai skema Prisma
    const [jeniskelaminanak, setJenisKelaminAnak] = useState("Laki_laki");

    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const userData = {
            namalengkap,
            email,
            tanggallahir: tanggallahir || null,
            pendidikan: pendidikan || null, // Nilai dari Select
            alamat: alamat || null,
            pekerjaan: pekerjaan || null,
            namaanak: namaanak || null,
            tanggallahiranak: tanggallahiranak || null,
            jeniskelaminanak: namaanak ? jeniskelaminanak : null, 
        };
        
        try {
            const res = await fetch("/api/backend/users/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            const data = await res.json();
            
            if (!res.ok) {
                console.error("API error:", data);
                Swal.fire("Gagal", data.error || "Gagal membuat user.", "error");
                setLoading(false);
                return;
            }

            Swal.fire("Berhasil!", "User berhasil ditambahkan.", "success");
            router.push("/backend/users");

        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Gagal membuat user. Periksa koneksi atau konsol.", "error");
            setLoading(false);
        }
    }

    // Opsi Jenis Kelamin Anak (Disesuaikan dengan ENUM Prisma: Laki_laki/Perempuan)
    const jkOptions = [
        { value: "Laki_laki", label: "Laki-laki" },
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
                <Label htmlFor="namalengkap">Nama Lengkap</Label>
                <Input 
                    type="text" 
                    id="namalengkap" 
                    name="namalengkap" 
                    required
                    onChange={(e) => setNamaLengkap(e.target.value)}
                    placeholder="Input Nama Lengkap"
                    disabled={loading}
                />
            </div>

            {/* Email */}
            <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Input Email"
                    disabled={loading}
                />
            </div>

            <div className="md:col-span-2"> 
                {/* Div ini digunakan untuk menjaga layout tetap konsisten */}
            </div>
            
            <h3 className="col-span-full font-semibold text-lg border-b pb-2 mb-2 mt-4">Data Pribadi Ibu</h3>

            {/* Tanggal Lahir */}
            <div>
                <Label htmlFor="tanggallahir">Tanggal Lahir</Label>
                <Input 
                    type="date" 
                    id="tanggallahir" 
                    name="tanggallahir" 
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
                    // Dinonaktifkan jika Nama Anak kosong
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
                    {loading ? "Menyimpan..." : "Simpan User"}
                </Button>
            </div>
        </form>
    );
}