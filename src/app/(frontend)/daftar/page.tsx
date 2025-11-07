"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

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
        <form className="flex flex-col gap-4">
          {/* LOGIN MODE */}
          {isLogin && (
            <>
              {/* Nama Lengkap */}
              <div>
                <label className="text-sm text-gray-600">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  placeholder="_@gmail.com"
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
            </>
          )}

          {/* REGISTER MODE */}
          {!isLogin && (
            <>
              {/* Nama Lengkap */}
              <div>
                <label className="text-sm text-gray-600">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  placeholder="email@gmail.com"
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              {/* Tgl Lahir */}
              <div>
                <label className="text-sm text-gray-600">Tanggal Lahir</label>
                <input
                  type="date"
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              {/* Pendidikan Terakhir */}
              <div>
                <label className="text-sm text-gray-600">
                  Pendidikan Terakhir
                </label>
                <input
                  type="text"
                  placeholder="SMA / S1 / D3 / dll"
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              {/* Alamat */}
              <div>
                <label className="text-sm text-gray-600">Alamat</label>
                <textarea
                  placeholder="Masukkan alamat lengkap"
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              {/* Pekerjaan */}
              <div>
                <label className="text-sm text-gray-600">Pekerjaan</label>
                <input
                  type="text"
                  placeholder="Pekerjaan"
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              {/* Nama Lengkap Anak */}
              <div>
                <label className="text-sm text-gray-600">
                  Nama Lengkap Anak
                </label>
                <input
                  type="text"
                  placeholder="Nama Anak"
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              {/* Tanggal Lahir Anak */}
              <div>
                <label className="text-sm text-gray-600">
                  Tanggal Lahir Anak
                </label>
                <input
                  type="date"
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              {/* Jenis Kelamin Anak */}
              <div>
                <label className="text-sm text-gray-600">
                  Jenis Kelamin Anak
                </label>
                <select className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-pink-400">
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              {/* Berat Badan */}
              <div>
                <label className="text-sm text-gray-600">Berat Badan (kg)</label>
                <input
                  type="number"
                  placeholder="contoh: 25"
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              {/* Tinggi Badan */}
              <div>
                <label className="text-sm text-gray-600">Tinggi Badan (cm)</label>
                <input
                  type="number"
                  placeholder="contoh: 120"
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
            </>
          )}

          {/* Tombol Submit */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="mt-4 bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 rounded-lg transition"
          >
            {isLogin ? "Login" : "Daftar"}
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
