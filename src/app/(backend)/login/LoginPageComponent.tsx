"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPageComponent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Jika sudah login → arahkan sesuai level
  useEffect(() => {
    if (status === "authenticated" && session?.user?.level) {
      if (session.user.level === "admin") {
        router.replace("/backend");
      } else {
        router.replace("/quiz");
      }
    }
  }, [status, session, router]);

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg">
        {status === "loading" ? "Memeriksa sesi..." : "Mengarahkan..."}
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const res = await signIn("credentials", {
      email,
      namaLengkap,
      redirect: false,
    });

    if (res?.ok) {
      // Ambil session baru
      const newSession = await fetch("/api/auth/session").then((r) => r.json());
      const level = newSession?.user?.level;

      if (level === "admin") router.push("/backend");
      else router.push("/quiz");
    } else {
      setErrorMessage(res?.error || "Login gagal: nama lengkap atau email salah");
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
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Selamat Datang
        </h1>

        {errorMessage && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-center text-red-700">
            {errorMessage}
          </div>
        )}

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
      </motion.div>
    </section>
  );
}
