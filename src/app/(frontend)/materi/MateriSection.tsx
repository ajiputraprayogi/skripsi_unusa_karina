"use client";

import { motion } from "framer-motion";

interface Props {
  email: string;
}

export default function MateriSection({ email }: Props) {

  const username = email.split("@")[0];

  const salam = () => {
    const jam = new Date().getHours();

    if (jam < 12) return "Selamat pagi";
    if (jam < 15) return "Selamat siang";
    if (jam < 18) return "Selamat sore";
    return "Selamat malam";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-xl p-8 max-w-xl w-full"
      >
        <h1 className="text-2xl font-bold mb-2">
          {salam()}, {username} 👋
        </h1>

        <p className="text-gray-600">
          Selamat datang! Anda sudah menyelesaikan quiz awal.
        </p>

        <p className="text-sm text-gray-400 mt-1">
          Login sebagai: {email}
        </p>

        <div className="mt-6">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Mulai Belajar
          </button>
        </div>

      </motion.div>

    </div>
  );
}