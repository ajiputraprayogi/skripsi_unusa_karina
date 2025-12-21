"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/FORM_ID/viewform";

export default function LoginPageComponent() {
  const [email, setEmail] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // ✅ dummy delay biar berasa proses
    setTimeout(() => {
      setLoading(false);
      setShowBanner(true);
    }, 800);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-blue-100 p-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-8 border border-gray-200"
      >
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Selamat Datang
        </h1>

        {/* ================= FORM ================= */}
        {!showBanner && (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm text-gray-600">Nama Lengkap</label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                required
                disabled={loading}
                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 bg-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                placeholder="_@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 bg-white"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className={`mt-4 ${
                loading ? "bg-pink-300" : "bg-pink-500 hover:bg-pink-600"
              } text-white font-medium py-3 rounded-lg transition`}
            >
              {loading ? "Memproses..." : "Login"}
            </motion.button>
          </form>
        )}

        {/* ================= BANNER INFORMASI ================= */}
        <AnimatePresence>
          {showBanner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800">
                <h2 className="font-semibold mb-2">
                  📌 Petunjuk Pengisian Google Form
                </h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Isi form dengan data yang sebenar-benarnya</li>
                  <li>Gunakan email yang sama seperti saat login</li>
                  <li>Pastikan semua pertanyaan terjawab</li>
                  <li>Form hanya dapat diisi satu kali</li>
                </ul>
              </div>

              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition"
              >
                Lanjut ke Google Form
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
