"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-pink-50 to-white">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full mb-6 shadow-md"
      />
      <motion.p
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
        className="text-pink-600 font-semibold text-lg tracking-wide"
      >
        Memuat Data...
      </motion.p>
      <p className="text-gray-400 text-sm mt-2 max-w-xs text-center">
        Sedang melakukan pengecekan data dari server, mohon tunggu sebentar.
      </p>
    </div>
  );
}
