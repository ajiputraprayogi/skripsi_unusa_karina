"use client";

import { motion } from "framer-motion";
import Lottie from "lottie-react";
import doneAnimation from "./posttest.json"; // animasi success

export default function PosttestDoneSection() {

  return (
    <section className="relative min-h-screen flex items-center px-6 md:px-14 py-24 bg-gradient-to-b from-white via-pink-50 to-white overflow-hidden">  

      {/* background bubbles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 1 }}
        className="absolute top-10 left-10 w-40 h-40 rounded-full bg-pink-200 blur-2xl"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1 }}
        className="absolute bottom-10 right-10 w-56 h-56 rounded-full bg-purple-200 blur-3xl"
      />

      <div className="grid md:grid-cols-2 gap-7 items-center relative z-10">

        {/* IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: -40, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-xl mx-auto"
        >
          <Lottie
            animationData={doneAnimation}
            loop
            autoplay
            className="w-full h-auto"
          />
        </motion.div>

        {/* TEXT */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-7"
        >

          <h2 className="text-gray-800 text-4xl md:text-5xl font-bold leading-tight">
            Post Test
            <span className="text-pink-500"> Sudah Diisi</span>
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed">
            Terima kasih! Anda telah menyelesaikan posttest sebelumnya.
            Sekarang Anda dapat melanjutkan ke materi pembelajaran
            untuk memahami lebih dalam tentang tumbuh kembang anak.
          </p>

          {/* INFO BOX */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-green-100 p-6 rounded-2xl shadow-sm border border-green-200"
          >
            <p className="text-green-700 font-semibold">
              ✅ Post Test berhasil tersimpan
            </p>
          </motion.div>
        </motion.div>

      </div>

    </section>
  );
}