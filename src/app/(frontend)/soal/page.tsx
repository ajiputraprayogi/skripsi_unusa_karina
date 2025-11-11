"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function QuestionnairePage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const totalSteps = 4;

  // 🧠 State global
  const [userData, setUserData] = useState<any>({
    umur: "",
    pendidikan: "",
    alamat: "",
    pekerjaan: "",
    namaAnak: "",
    jenisKelaminAnak: "",
    tanggalLahirAnak: "",
    beratBadan: "",
    tinggiBadan: "",
    infoStimulasi: "",
  });
  const [pengetahuan, setPengetahuan] = useState<string[]>([]);
  const [sikap, setSikap] = useState<string[]>([]);
  const [motivasi, setMotivasi] = useState<string[]>([]);

  useEffect(() => {
    const enableAutofill = true;
    if (enableAutofill) {
      setUserData({
        namaLengkap: "Sigit", 
        email: "sigit@gmail.com", 
        umur: 32,
        pendidikan: "S1",
        alamat: "Jl. Melati No. 123, Nganjuk",
        pekerjaan: "Programmer",
        namaAnak: "Vyron",
        jenisKelaminAnak: "Laki-laki",
        tanggalLahirAnak: "2020-05-12",
        beratBadan: 25,
        tinggiBadan: 130,
        infoStimulasi: "Ya",
      });
      setPengetahuan(["Benar", "Salah", "Benar", "Benar"]);
      setSikap(["Setuju", "Sangat Setuju", "Tidak Setuju"]);
      setMotivasi(["Sangat Setuju", "Setuju", "Sangat Tidak Setuju"]);
    }
  }, []);

  const nextStep = () => step < totalSteps && setStep(step + 1);
  const prevStep = () => step > 1 && setStep(step - 1);

  // 🔹 Submit ke API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      user: userData,
      pengetahuan,
      sikap,
      motivasi,
    };

    console.log("📦 JSON dikirim:", payload);

    try {
      const res = await fetch("/dummyapi/jawaban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) setSubmitted(true);
      else console.error("❌ Gagal menyimpan:", await res.json());
    } catch (err) {
      console.error("❌ Error:", err);
    }
  };

  // 🧩 Komponen Step1 langsung di sini
  const Step1DataIbuAnak = () => {
    const questions = [
      { key: "umur", label: "Umur", type: "number" },
      {
        key: "pendidikan",
        label: "Pendidikan Terakhir",
        type: "select",
        options: ["SD", "SMP", "SMA / SMK", "Diploma / Sarjana"],
      },
      { key: "alamat", label: "Alamat Rumah", type: "text" },
      {
        key: "pekerjaan",
        label: "Pekerjaan",
        type: "select",
        options: ["Bekerja", "Tidak Bekerja / Ibu Rumah Tangga"],
      },
      { key: "namaAnak", label: "Nama Anak", type: "text" },
      {
        key: "jenisKelaminAnak",
        label: "Jenis Kelamin Anak",
        type: "select",
        options: ["Laki-laki", "Perempuan"],
      },
      { key: "tanggalLahirAnak", label: "Tanggal Lahir Anak", type: "date" },
      { key: "beratBadan", label: "Berat Badan Anak Sekarang (kg)", type: "number" },
      { key: "tinggiBadan", label: "Tinggi Badan Anak Sekarang (cm)", type: "number" },
      {
        key: "infoStimulasi",
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
              <select
                className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
                value={userData[q.key] || ""}
                onChange={(e) =>
                  setUserData((prev: any) => ({
                    ...prev,
                    [q.key]: e.target.value,
                  }))
                }
              >
                {q.options?.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={q.type}
                value={userData[q.key] || ""}
                onChange={(e) =>
                  setUserData((prev: any) => ({
                    ...prev,
                    [q.key]: e.target.value,
                  }))
                }
                className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
              />
            )}
          </div>
        ))}
      </motion.div>
    );
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

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 && <Step1DataIbuAnak />}
                {step === 2 && (
                  <p className="text-center text-gray-500">[Step 2 Placeholder]</p>
                )}
                {step === 3 && (
                  <p className="text-center text-gray-500">[Step 3 Placeholder]</p>
                )}
                {step === 4 && (
                  <p className="text-center text-gray-500">[Step 4 Placeholder]</p>
                )}
              </AnimatePresence>

              {/* Navigation */}
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
          // ✅ Halaman Terima Kasih
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
            <Link
              href="/video"
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
