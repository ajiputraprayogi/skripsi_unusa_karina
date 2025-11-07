"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-[#a4b0be] text-[#2E2B25]"
    >
      {/* Animated Circle Background */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center overflow-hidden -z-10"
      >
        <div className="w-[600px] h-[600px] rounded-full bg-[#C9A77A]/10 blur-3xl" />
      </motion.div>

      {/* Main Content */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-[6rem] md:text-[8rem] font-bold tracking-tight mb-4"
      >
        Waduh Nyasar Nih
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-lg md:text-xl text-[#2E2B25]/70 max-w-md"
      >
        Halaman yang kamu cari sepertinya dalam pengembangan atau menghilang ke dimensi lain.  
        Tapi tenang — kita bantu kamu kembali.
      </motion.p>

      {/* Buttons */}
      <div
        className="mt-10 flex flex-col md:flex-row gap-4"
      >
        {/* Tombol Kembali */}
        <Link
          href="/"
          className="z-99 group relative inline-flex items-center justify-center overflow-hidden rounded-l-3xl rounded-r-3xl bg-[#D7B899] font-medium w-auto transition-all duration-500 hover:scale-[1.03]"
        >
          <div className="inline-flex h-12 items-center justify-center px-8 text-[#2E2B25] transition-all duration-500 group-hover:-translate-y-[150%]">
            Balik Yuk
          </div>

          <div className="absolute inline-flex h-24 w-full translate-y-[100%] items-center justify-center text-[#2E2B25] transition-all duration-500 group-hover:translate-y-0">
            <span className="absolute h-full w-full translate-y-full skew-y-12 scale-y-0 bg-[#C9A77A] transition-all duration-500 group-hover:translate-y-0 group-hover:scale-150"></span>
            <span className="z-10 px-8">Gasin</span>
          </div>
        </Link>
      </div>

      {/* Decorative subtle glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1 }}
        className="absolute bottom-12 w-[200px] h-[200px] bg-[#C9A77A]/30 blur-[120px] rounded-full"
      />
    </main>
  );
}
