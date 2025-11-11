"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPageComponent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // State diubah untuk menyimpan namaLengkap (sebagai pengganti password)
  const [email, setEmail] = useState("");
  const [namaLengkap, setNamaLengkap] = useState(""); // <-- Diubah
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const callbackUrl = searchParams.get("callbackUrl") || "/backend";

  useEffect(() => {
    document.title = "Login | Admin Panel";
  }, []);

  // Logika pengalihan tetap sama
  useEffect(() => {
    if (status === "authenticated") router.replace(callbackUrl);
  }, [status, callbackUrl, router]);

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

    try {
      const res = await signIn("credentials", {
        email,
        // Mengirim namaLengkap sebagai kredensial "password"
        // Catatan: NextAuth secara default mencari 'username' dan 'password'.
        // Jika Anda ingin NextAuth menerima 'namaLengkap',
        // Anda harus mengonfigurasi properti 'credentials' di NextAuth
        // untuk menerima 'namaLengkap' dan 'email'.
        namaLengkap, // <-- Diubah: Mengirimkan namaLengkap sebagai kredensial
        redirect: false,
        callbackUrl,
      });

      if (res?.ok) router.push(res.url || callbackUrl);
      else {
        // Pesan error diperbarui
        setErrorMessage(res?.error || "Login gagal: nama lengkap atau email salah");
        setLoading(false);
      }
    } catch (err) {
      console.error("Unexpected login error:", err);
      setErrorMessage("Terjadi error saat login.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg bg-white p-8 shadow-md"
      >
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Login
        </h2>

        {errorMessage && (
          <div className="mb-4 rounded bg-red-100 p-3 text-center text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Kolom Input Email (Tidak Berubah) */}
        <label className="block mb-2 font-medium text-gray-600" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Masukkan email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="mb-4 w-full rounded border border-gray-300 p-3 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />

        {/* Kolom Input Nama Lengkap (Menggantikan Password) */}
        <label className="block mb-2 font-medium text-gray-600" htmlFor="namaLengkap">
          Nama Lengkap
        </label>
        <input
          id="namaLengkap"
          type="text" // <-- Diubah menjadi type="text"
          placeholder="Masukkan nama lengkap"
          value={namaLengkap}
          onChange={(e) => setNamaLengkap(e.target.value)} // <-- Diubah
          required
          disabled={loading}
          className="mb-6 w-full rounded border border-gray-300 p-3 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded bg-blue-600 py-3 text-white transition-colors duration-300 ${
            loading ? "cursor-not-allowed bg-gray-400" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}