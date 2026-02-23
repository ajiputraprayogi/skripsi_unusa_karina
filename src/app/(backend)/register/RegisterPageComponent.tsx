"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function RegisterPageComponent() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          namaLengkap,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registrasi gagal");
      }

      setSuccessMessage("Registrasi berhasil! Mengarahkan ke login...");

      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-blue-100 p-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-8 border border-gray-200"
      >
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Daftar Akun
        </h1>

        {errorMessage && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-center text-red-700">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-lg bg-green-100 p-3 text-center text-green-700">
            {successMessage}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

          {/* Nama Lengkap */}
          <div>
            <label className="text-sm text-gray-600">Nama Lengkap</label>
            <input
              type="text"
              placeholder="Masukkan nama lengkap"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              required
              disabled={loading}
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className={`mt-4 ${
              loading ? "bg-pink-300" : "bg-pink-500 hover:bg-pink-600"
            } text-white font-medium py-3 rounded-lg`}
          >
            {loading ? "Memproses..." : "Daftar"}
          </motion.button>

        </form>

        {/* Link ke Login */}
        <div className="text-center mt-4 text-sm">
          Sudah punya akun?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-pink-500 hover:underline"
          >
            Login
          </button>
        </div>

      </motion.div>
    </section>
  );
}