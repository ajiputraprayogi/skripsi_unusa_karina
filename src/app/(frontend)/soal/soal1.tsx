"use client";

import { motion } from "framer-motion";

export default function Step1DataIbuAnak() {
  const questions = [
    { label: "Umur", type: "number" },
    {
      label: "Pendidikan Terakhir",
      type: "select",
      options: ["SD", "SMP", "SMA / SMK", "Diploma / Sarjana"],
    },
    { label: "Alamat Rumah", type: "text" },
    {
      label: "Pekerjaan",
      type: "select",
      options: ["Bekerja", "Tidak Bekerja / Ibu Rumah Tangga"],
    },
    { label: "Nama Anak", type: "text" },
    {
      label: "Jenis Kelamin Anak",
      type: "select",
      options: ["Laki-laki", "Perempuan"],
    },
    { label: "Tanggal Lahir Anak", type: "date" },
    { label: "Berat Badan Anak Sekarang (kg)", type: "number" },
    { label: "Tinggi Badan Anak Sekarang (cm)", type: "number" },
    {
      label:
        "Apakah Anda pernah memperoleh informasi tentang stimulasi perkembangan anak?",
      type: "select",
      options: ["Ya", "Tidak"],
    },
  ];

  return (
    <motion.div
      key="bagian1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {questions.map((q, i) => (
        <div key={i}>
          <label className="text-gray-700 text-sm font-medium">{q.label}</label>
          {q.type === "select" ? (
            <select className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none">
              {q.options?.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type={q.type}
              className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
            />
          )}
        </div>
      ))}
    </motion.div>
  );
}
