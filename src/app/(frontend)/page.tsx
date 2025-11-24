"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-white text-gray-800">

      {/* HERO */}
      <section className="relative w-full px-6 md:px-14 py-24 overflow-hidden">

        {/* Soft colorful floating bubbles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          className="absolute top-10 left-10 w-40 h-40 rounded-full bg-pink-200 blur-2xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          className="absolute bottom-10 right-10 w-56 h-56 rounded-full bg-purple-200 blur-3xl"
        />

        <div className="grid md:grid-cols-2 gap-12 relative z-10 items-center">
          
          {/* Text Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-7"
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
              Belajar Jadi Seru  
              <span className="text-pink-500"> untuk Ibu & Anak</span>
            </h1>

            <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
              Materi interaktif, aktivitas kreatif, dan panduan modern untuk 
              mendampingi tumbuh kembang anak secara menyenangkan.
            </p>

            <Link href={"/login"}>
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="px-7 py-4 bg-pink-500 rounded-2xl text-white font-semibold text-lg shadow-md"
            >
              Mulai Belajar
            </motion.button>
            </Link>
          </motion.div>

          {/* Hero Image */}
          <motion.img
            src="/hero1.jpg"
            alt="ibu dan anak"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-lg mx-auto rounded-3xl shadow-lg object-cover"
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 md:px-14 py-20 bg-gradient-to-b from-gray-50 to-white">
        <h2 className="text-4xl font-bold text-center mb-14">
          Mulai Dari Mana Hari Ini?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Materi Parenting",
              desc: "Tips modern untuk menghadapi tahap perkembangan anak.",
              color: "bg-pink-100",
              text: "text-pink-700"
            },
            {
              title: "Aktivitas Interaktif",
              desc: "Belajar sambil bermain yang merangsang kreativitas.",
              color: "bg-yellow-100",
              text: "text-yellow-700"
            },
            {
              title: "Tips Kesehatan",
              desc: "Informasi kesehatan anak dengan gaya mudah dipahami.",
              color: "bg-blue-100",
              text: "text-blue-700"
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className={`${item.color} p-7 rounded-3xl shadow-md hover:shadow-lg transition-all`}
            >
              <h3 className={`${item.text} text-2xl font-semibold mb-3`}>{item.title}</h3>
              <p className={`${item.text}`}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="px-6 md:px-14 py-24">
        <div className="grid md:grid-cols-2 gap-14 items-center">

          <motion.img
            src="/hero2.avif"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md mx-auto rounded-3xl shadow-md"
          />

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold leading-snug">
              Edukasi Yang Lebih Dekat Dengan Keluarga
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed">
              Dengan pendekatan modern, kami menciptakan pengalaman belajar yang 
              menyenangkan dan mudah dipahami oleh semua kalangan ibu. 
              Setiap materi dibuat simpel, aplikatif, dan relevan.
            </p>

            <p className="text-gray-600 text-lg leading-relaxed">
              Belajar bersama anak kini jauh lebih hangat, nyaman, dan penuh warna.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-14 py-20 bg-gradient-to-r from-pink-400 to-pink-500 text-white text-center rounded-t-3xl">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-6"
        >
          Ayo Mulai Perjalanan Belajar Hari Ini!
        </motion.h2>

        <Link href={"/login"}>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="px-8 py-4 bg-white text-pink-600 rounded-2xl font-semibold text-lg shadow-xl"
        >
          Daftar Gratis
        </motion.button></Link>
      </section>
    </main>
  );
}
