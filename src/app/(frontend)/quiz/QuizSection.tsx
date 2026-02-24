"use client";

import { motion } from "framer-motion";
import Lottie from "lottie-react";
import quizAnimation from "./quiz.json";

interface QuizSectionProps {
  email: string;
}

export default function QuizSection({ email }: QuizSectionProps) {

  const GOOGLE_FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSf0r9anx463v44JYfzwCAPmq9EfqQ3RauHv22nU2Vxf9aX90A/viewform";

  return (
    <section className="relative px-6 md:px-14 py-24 bg-gradient-to-b from-white via-pink-50 to-white overflow-hidden">

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
            animationData={quizAnimation}
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
            Ikuti Quiz  
            <span className="text-pink-500"> Tumbuh Kembang Anak</span>
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed">
            Jawab beberapa pertanyaan sederhana untuk mengetahui tahap 
            perkembangan anak Anda. Hasil quiz akan membantu memberikan 
            rekomendasi materi yang paling sesuai untuk proses belajar.
          </p>

          {/* INFO BOX */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-pink-100 p-6 rounded-2xl shadow-sm border border-pink-200"
          >
            <p className="text-pink-700 font-semibold">
              ✨ Hanya membutuhkan waktu 5–7 menit
            </p>
            <p className="text-pink-600 text-sm mt-1">
              Gratis • Mudah • Tanpa biaya
            </p>
          </motion.div>

          {/* BUTTON */}
          <motion.a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            className="
              inline-block
              px-8 py-4
              bg-pink-500 hover:bg-pink-600
              text-white
              rounded-2xl
              font-semibold
              text-lg
              shadow-md hover:shadow-xl
              transition-all duration-200
            "
          >
            Mulai Quiz Sekarang
          </motion.a>

        </motion.div>

      </div>

    </section>
  );
}