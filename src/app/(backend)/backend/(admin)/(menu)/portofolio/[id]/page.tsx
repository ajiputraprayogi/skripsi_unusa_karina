"use client";

import React, { useEffect, useState, useMemo } from "react";
import withPermission from "@/components/auth/withPermission";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import SkeletonDefault from "@/components/skeleton/Default";
import FileInput from "@/components/form/input/FileInput";
import Select from "@/components/form/Select";

// Definisi Opsi Tipe berdasarkan Kategori (Disesuaikan dari Create Portofolio)
const CATEGORY_TO_TYPES: { [key: string]: { label: string; value: string }[] } = {
  "Design Interior": [
    { label: "Enscape", value: "Enscape" },
    { label: "Kamar", value: "Kamar" },
    { label: "WC", value: "WC" },
  ],
  "Design Eksterior": [
    { label: "Perumahan", value: "Perumahan" },
    { label: "Cafe", value: "Cafe" },
    { label: "Hunian", value: "Hunian" },
    { label: "Kost", value: "Kost" },
    { label: "Tempat Ibadah", value: "Tempat Ibadah" },
    { label: "Villa", value: "Villa" },
  ],
};


function EditPortofolio() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [kategori, setKategori] = useState("");
  const [type, setType] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Memperoleh opsi tipe secara dinamis berdasarkan kategori yang dipilih
  const typeOptions = useMemo(() => {
    return CATEGORY_TO_TYPES[kategori] || [];
  }, [kategori]);

  // Handler untuk mengubah Kategori dan mereset Tipe hanya saat interaksi pengguna
  const handleKategoriChange = (val: string | number) => {
    const newKategori = String(val);
    setKategori(newKategori);
    setType(""); // Reset Tipe agar pengguna memilih ulang tipe yang valid untuk kategori baru
  };

  // Fungsi untuk membersihkan URL objek saat komponen di-unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    document.title = "Edit Portofolio | Admin Panel";

    async function fetchPortofolio() {
      if (!params.id) return;

      try {
        const res = await fetch(`/api/backend/portofolio/${params.id}`);
        if (!res.ok) throw new Error("Gagal memuat portofolio");

        const data = await res.json();
        setName(data.name || "");
        setDescription(data.description || "");
        setKategori(data.kategori || "");
        setType(data.type || ""); // State Tipe diisi dengan data yang ada
        setImagePreview(data.image || null);
      } catch (error) {
        console.error(error);
        alert("Gagal memuat data portofolio");
      } finally {
        setInitialLoading(false);
      }
    }

    fetchPortofolio();
  }, [params.id]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    
    // Bersihkan URL objek sebelumnya (jika ada)
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else if (!imagePreview || imagePreview.startsWith("blob:")) {
        // Jika tidak ada file baru dipilih dan preview adalah blob URL, bersihkan
        setImagePreview(null);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 1. VALIDASI SISI KLIEN UNTUK FIELD WAJIB
    if (!name || !kategori || !type) {
        // ✅ PERBAIKAN: Ganti alert() dengan pesan yang lebih informatif (jika Anda memiliki komponen modal/toast)
        console.error("Error: Nama, Kategori, dan Tipe wajib diisi.");
        alert("Error: Nama, Kategori, dan Tipe wajib diisi.");
        return; 
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("kategori", kategori);
      formData.append("type", type);
      
      // Hanya tambahkan file jika ada file baru yang dipilih
      if (imageFile) {
        formData.append("image", imageFile);
      } 
      // Jika Anda ingin menghapus gambar lama, Anda mungkin perlu menambahkan
      // flag lain (misalnya: formData.append("remove_image", "true");)

      const res = await fetch(`/api/backend/portofolio/${params.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal update portofolio");
      }

      router.push("/backend/portofolio");
    } catch (error) {
      console.error(error);
      alert((error as Error).message || "Terjadi kesalahan saat update portofolio");
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Data Portofolio" />
        <ComponentCard title="Form Edit Portofolio">
          <SkeletonDefault />
        </ComponentCard>
      </>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Portofolio" />
      <ComponentCard title="Form Edit Portofolio">
        <form onSubmit={handleSubmit} className="grid gap-4">
          
          {/* Input Nama Portofolio */}
          <div>
            <Label>Nama Portofolio <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              placeholder="Input Nama Portofolio"
              disabled={loading}
            />
          </div>

          {/* Input Deskripsi */}
          <div>
            <Label>Deskripsi</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              rows={4}
              disabled={loading}
              placeholder="Deskripsi portofolio"
            />
          </div>

          {/* Dropdown Kategori (Kontrol Utama) */}
          <div>
            <Label>Kategori <span className="text-red-500">*</span></Label>
            <Select
              value={kategori}
              // ✅ Menggunakan handler baru untuk mereset Tipe saat Kategori berubah
              onChange={handleKategoriChange}
              placeholder="Pilih Kategori"
              options={[
                { label: "Design Interior", value: "Design Interior" },
                { label: "Design Eksterior", value: "Design Eksterior" }
              ]}
              disabled={loading}
            />
          </div>

          {/* Dropdown Type (Kondisional) */}
          <div>
            <Label>Tipe <span className="text-red-500">*</span></Label>
            <Select
              value={type}
              // ✅ Menerima val sebagai string | number, lalu konversi ke String
              onChange={(val: string | number) => setType(String(val))}
              // ✅ Placeholder dinamis
              placeholder={kategori ? "Pilih Tipe" : "Pilih Kategori Terlebih Dahulu"}
              // ✅ Menggunakan opsi dinamis
              options={typeOptions}
              // ✅ Nonaktifkan jika Kategori belum dipilih atau sedang loading
              disabled={loading || !kategori}
            />
          </div>

          {/* Input Gambar & Preview */}
          <div>
            <Label>Gambar (Kosongkan jika tidak ingin diubah)</Label>
            <FileInput onChange={handleFileChange} disabled={loading} accept=".png, .webp" />
            {imagePreview && (
              <>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Gambar Saat Ini:</p>
                <img
                  src={imagePreview}
                  alt="Preview Portofolio"
                  className="mt-1 max-h-48 w-auto rounded border object-cover shadow-md"
                />
              </>
            )}
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end">
            <Button
              size="sm"
              className="mr-2"
              variant="danger"
              type="button"
              onClick={() => router.back()}
              disabled={loading}
            >
              Kembali
            </Button>

            <Button size="sm" variant="green" type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}

export default withPermission(EditPortofolio, "edit-portofolio");