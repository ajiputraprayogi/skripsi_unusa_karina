"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function QuestionnairePage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false); // 🔹 state baru
  const totalSteps = 4;

  const nextStep = () => step < totalSteps && setStep(step + 1);
  const prevStep = () => step > 1 && setStep(step - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true); // 🔹 tampilkan animasi terima kasih
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center p-6">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-gray-200"
          >
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-semibold text-gray-800">
                {step === 1 && "Data Ibu & Anak"}
                {step === 2 && "Pengetahuan Ibu"}
                {step === 3 && "Sikap Ibu"}
                {step === 4 && "Motivasi Ibu"}
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Langkah {step} dari {totalSteps}
              </p>
            </div>

            {/* Form */}
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="bagian1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {[
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
                    ].map((q, i) => (
                      <div key={i}>
                        <label className="text-gray-700 text-sm font-medium">
                          {q.label}
                        </label>
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
                )}

                {step === 2 && (
                  <QuestionGroup
                    title="Kuesioner Pengetahuan Ibu"
                    questions={[
                      "Tumbuh kembang mencakup 2 peristiwa berbeda tapi saling berkaitan: pertumbuhan & perkembangan.",
                      "Aspek perkembangan anak terdiri dari gerak halus, kasar, bahasa, dan kemandirian.",
                      "Stimulasi adalah kegiatan merangsang kemampuan dasar anak usia 0-6 tahun.",
                      "Perkembangan memerlukan stimulasi seperti mainan, sosialisasi, dan keterlibatan keluarga.",
                      "Stimulasi tidak boleh dilakukan ketika bayi atau balita sedang mengantuk dan bosan.",
                      "Peran ibu dalam stimulasi sangat berpengaruh pada perkembangan anak.",
                      "Prinsip stimulasi adalah menggunakan alat permainan sederhana dan aman.",
                      "Memberikan pujian atas keberhasilan anak adalah prinsip stimulasi.",
                      "Melatih anak berlari dan melompat merupakan stimulasi gerak kasar.",
                      "Menulis huruf, angka, dan menggambar garis lurus termasuk stimulasi gerak halus.",
                      "Mengajari anak menghitung adalah bentuk stimulasi gerak halus.",
                      "Membacakan buku cerita adalah contoh stimulasi bicara dan bahasa.",
                      "Membiarkan anak bermain dengan teman adalah stimulasi sosial dan kemandirian.",
                      "Mengajak anak bermain di taman termasuk stimulasi sosial dan kemandirian.",
                      "Keberhasilan stimulasi dipengaruhi oleh waktu, durasi, dan prosesnya.",
                    ]}
                    options={["Benar", "Salah"]}
                  />
                )}

                {step === 3 && (
                  <QuestionGroup
                    title="Kuesioner Sikap Ibu"
                    questions={[
                      "Informasi tentang stimulasi anak penting bagi ibu.",
                      "Ibu yakin stimulasi bermanfaat bagi kesiapan sekolah anak.",
                      "Ibu perlu memberikan stimulasi secara rutin.",
                      "Ibu perlu memperhatikan aspek perkembangan saat menstimulasi anak.",
                      "Ibu merasa keberatan memberi stimulasi karena tidak punya waktu.",
                      "Anak berkembang sendiri tanpa perlu stimulasi.",
                      "Ibu seharusnya menghargai setiap respon anak.",
                      "Ibu merasa senang bisa memberikan stimulasi perkembangan.",
                      "Ibu perlu memberi anak kesempatan memilih aktivitas.",
                      "Ibu perlu menyediakan materi & alat permainan untuk stimulasi anak.",
                    ]}
                    options={[
                      "Sangat Setuju",
                      "Setuju",
                      "Tidak Setuju",
                      "Sangat Tidak Setuju",
                    ]}
                  />
                )}

                {step === 4 && (
                  <QuestionGroup
                    title="Kuesioner Motivasi Ibu"
                    questions={[
                      "Saya memberikan stimulasi perkembangan secara rutin.",
                      "Saya harus menyempatkan waktu untuk memberikan stimulasi.",
                      "Saya tidak memberikan stimulasi karena perkembangan anak tidak penting.",
                      "Saya akan memberikan stimulasi karena saya paling dekat dengan anak.",
                      "Saya berharap anak saya siap sekolah setelah distimulasi.",
                      "Saya yakin anak akan lebih sehat setelah diberikan stimulasi.",
                      "Saya ingin perkembangan anak optimal dengan stimulasi.",
                      "Saya malas menstimulasi perkembangan anak.",
                      "Saya senang dapat memberikan stimulasi perkembangan.",
                      "Saya benci jika harus menstimulasi perkembangan anak.",
                      "Saya harus disuruh keluarga untuk memberikan stimulasi.",
                      "Saya senang mendapat dukungan suami dalam memberikan stimulasi.",
                      "Saya lebih semangat saat didukung orang tua & kerabat.",
                      "Saya lebih mementingkan pekerjaan rumah daripada stimulasi.",
                      "Memberikan stimulasi membuat saya repot.",
                      "Saya memberikan stimulasi jika anak rewel saja.",
                      "Saya bosan memberikan stimulasi karena kegiatan berulang.",
                      "Saya memberikan stimulasi karena pengaruh kader/petugas kesehatan.",
                      "Saya memberikan stimulasi karena ingin pengakuan orang lain.",
                      "Saya akan memberikan stimulasi jika dipuji keluarga/tetangga.",
                    ]}
                    options={[
                      "Sangat Setuju",
                      "Setuju",
                      "Tidak Setuju",
                      "Sangat Tidak Setuju",
                    ]}
                  />
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                    onClick={prevStep}
                    type="button"
                  >
                    Kembali
                  </motion.button>
                ) : (
                  <div />
                )}
                {step < totalSteps ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-6 py-3 rounded-xl bg-pink-500 text-white hover:bg-pink-600 transition"
                    onClick={nextStep}
                    type="button"
                  >
                    Lanjut
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-6 py-3 rounded-xl bg-green-200 text-green-700 hover:text-white transition"
                    type="submit"
                  >
                    Kirim Jawaban
                  </motion.button>
                )}
              </div>
            </form>
          </motion.div>
        ) : (
          // 🔹 Animasi ucapan terima kasih
          <motion.div
            key="thankyou"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center bg-white/80 p-10 rounded-3xl shadow-xl border border-gray-200 max-w-lg"
          >
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-semibold text-green-600 mb-4"
            >
              Selesai ^_^
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 mb-5"
            >
              Jawaban Anda berhasil direkam. <br />
              Terima kasih sudah meluangkan waktu untuk mengisi kuesioner ini 💕
            </motion.p>
            <Link href={"/video"}
              className="px-6 py-3 rounded-xl bg-green-200 text-green-700 transition"

            >
              Lanjut
            </Link>

          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function QuestionGroup({
  title,
  questions,
  options,
}: {
  title: string;
  questions: string[];
  options: string[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {questions.map((q, i) => (
        <div key={i}>
          <p className="font-medium text-gray-700">
            {i + 1}. {q}
          </p>
          <div className="flex gap-4 mt-2 flex-wrap">
            {options.map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name={`${title}-${i}`}
                  className="text-pink-500 focus:ring-pink-400"
                />
                <span className="text-sm text-gray-600">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
