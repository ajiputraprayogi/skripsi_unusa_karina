"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    namaLengkap: "",
    email: "",
    tanggalLahir: "",
    pendidikan: "",
    alamat: "",
    pekerjaan: "",
    namaAnak: "",
    tanggalLahirAnak: "",
    jenisKelaminAnak: "",
    beratBadan: "",
    tinggiBadan: "",
  });

  // Handle input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

// Kirim data JSON ke API
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const endpoint = isLogin ? "/dummyapi/login" : "/dummyapi/users";
    const method = "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.error || "Gagal mengirim data");

if (isLogin) {
  // Simpan nama & email ke localStorage
  localStorage.setItem(
    "user",
    JSON.stringify({
      namaLengkap: formData.namaLengkap,
      email: formData.email,
    })
  );

  alert("Login berhasil ✅");
  router.push("/soal");
} else {
  alert("Registrasi berhasil 🎉");
  setIsLogin(true);
}

  } catch (error: any) {
    alert(error.message || "Terjadi kesalahan");
  } finally {
    setLoading(false);
  }
};




  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-blue-100 p-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-8 border border-gray-200"
      >
        {/* Title */}
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          {isLogin ? "Selamat Datang" : "Daftar Yuk"}
        </h1>

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {isLogin ? (
            <>
              <div>
                <label className="text-sm text-gray-600">Nama Lengkap</label>
                <input
                  name="namaLengkap"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={formData.namaLengkap}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="_@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-sm text-gray-600">Nama Lengkap</label>
                <input
                  name="namaLengkap"
                  type="text"
                  placeholder="Nama Lengkap"
                  value={formData.namaLengkap}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="email@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Tanggal Lahir</label>
                <input
                  name="tanggalLahir"
                  type="date"
                  value={formData.tanggalLahir}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Pendidikan Terakhir</label>
                <input
                  name="pendidikan"
                  type="text"
                  placeholder="SMA / S1 / D3 / dll"
                  value={formData.pendidikan}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Alamat</label>
                <textarea
                  name="alamat"
                  placeholder="Masukkan alamat lengkap"
                  value={formData.alamat}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Pekerjaan</label>
                <input
                  name="pekerjaan"
                  type="text"
                  placeholder="Pekerjaan"
                  value={formData.pekerjaan}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Nama Lengkap Anak</label>
                <input
                  name="namaAnak"
                  type="text"
                  placeholder="Nama Anak"
                  value={formData.namaAnak}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Tanggal Lahir Anak</label>
                <input
                  name="tanggalLahirAnak"
                  type="date"
                  value={formData.tanggalLahirAnak}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Jenis Kelamin Anak</label>
                <select
                  name="jenisKelaminAnak"
                  value={formData.jenisKelaminAnak}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-pink-400"
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Berat Badan (kg)</label>
                <input
                  name="beratBadan"
                  type="number"
                  placeholder="contoh: 25"
                  value={formData.beratBadan}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Tinggi Badan (cm)</label>
                <input
                  name="tinggiBadan"
                  type="number"
                  placeholder="contoh: 120"
                  value={formData.tinggiBadan}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
                />
              </div>
            </>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className={`mt-4 ${
              loading ? "bg-pink-300" : "bg-pink-500 hover:bg-pink-600"
            } text-white font-medium py-3 rounded-lg transition`}
          >
            {loading ? "Mengirim..." : isLogin ? "Login" : "Daftar"}
          </motion.button>
        </form>

        {/* Switch Mode */}
        <p className="text-center text-gray-600 text-sm mt-6">
          {isLogin ? (
            <>
              Belum punya akun?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-pink-500 hover:underline"
              >
                Daftar disini
              </button>
            </>
          ) : (
            <>
              Sudah punya akun?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-pink-500 hover:underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </motion.div>
    </section>
  );
}
