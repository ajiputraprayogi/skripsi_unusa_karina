// "use client";

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";

// type Option = {
//   text: string;
//   point: number | string;
// };

// type ParsedAnswer = {
//   options?: Option[];
//   answer?: string;
// };

// type Question = {
//   id: number;
//   category: string;
//   question_text: string;
//   question_type: "benar_salah" | "skala_positif" | "skala_negatif";
//   correct_answer: string; // JSON string
// };

// export default function KuisionerPage() {
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [answers, setAnswers] = useState<Record<number, string>>({});
//   const [loading, setLoading] = useState(false);
//   const [phase, setPhase] = useState(0); // fase 0-3

//   const USER_ID = 1; // nanti diganti pakai JWT/session

//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await fetch("/api/questions");
//       const data = await res.json();
//       setQuestions(data);
//     };
//     fetchData();
//   }, []);

//   const handleSelect = (id: number, value: string) => {
//     setAnswers((prev) => ({ ...prev, [id]: value }));
//   };

//   const questionsPerPhase = Math.ceil(questions.length / 4);
//   const currentQuestions = questions.slice(
//     phase * questionsPerPhase,
//     (phase + 1) * questionsPerPhase
//   );

//   const handleNextPhase = () => {
//     if (phase < 3) setPhase(phase + 1);
//   };

//   const handlePrevPhase = () => {
//     if (phase > 0) setPhase(phase - 1);
//   };

//   const handleSubmit = async () => {
//     setLoading(true);

//     // Format POST sesuai GET JSON
//     const payload = Object.entries(answers).map(([qId, ans]) => ({
//       userId: USER_ID,
//       questionId: Number(qId),
//       answerValue: ans,
//       soal: "PRE_TEST"
//     }));

//     const res = await fetch("/api/questions/post", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     setLoading(false);

//     if (res.ok) alert("Jawaban berhasil dikirim!");
//     else alert("Gagal submit jawaban.");
//   };

//   return (
//     <div className="min-h-screen w-full flex flex-col items-center px-5 py-10 bg-gray-50">
//       <motion.h1
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-3xl font-semibold mb-8"
//       >
//         Kuisioner Ibu & Anak
//       </motion.h1>

//       <div className="w-full max-w-3xl flex flex-col gap-6">
//         {currentQuestions.map((q, i) => {
//           const parsed: ParsedAnswer = JSON.parse(q.correct_answer);

//           return (
//             <motion.div
//               key={q.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: i * 0.05 }}
//               className="bg-white p-5 rounded-xl shadow-sm border border-gray-200"
//             >
//               <h2 className="text-sm text-gray-500 font-medium mb-1">
//                 {q.category.replace("_", " ")}
//               </h2>

//               <p className="text-lg font-medium mb-4">{q.question_text}</p>

//               {/* BENAR / SALAH */}
//               {q.question_type === "benar_salah" && (
//                 <div className="flex gap-4">
//                   {["Benar", "Salah"].map((item) => (
//                     <button
//                       key={item}
//                       onClick={() => handleSelect(q.id, item)}
//                       className={`px-4 py-2 rounded-lg border transition 
//                         ${
//                           answers[q.id] === item
//                             ? "bg-teal-500 text-white border-teal-500"
//                             : "border-gray-300 hover:bg-gray-100"
//                         }`}
//                     >
//                       {item}
//                     </button>
//                   ))}
//                 </div>
//               )}

//               {/* SKALA */}
//               {(q.question_type === "skala_positif" ||
//                 q.question_type === "skala_negatif") && (
//                 <div className="grid grid-cols-2 gap-3 mt-2">
//                   {parsed.options?.map((opt, idx) => (
//                     <button
//                       key={idx}
//                       onClick={() => handleSelect(q.id, opt.text)}
//                       className={`px-4 py-3 rounded-xl border text-left transition 
//                         ${
//                           answers[q.id] === opt.text
//                             ? "bg-blue-500 text-white border-blue-500"
//                             : "border-gray-300 hover:bg-gray-100"
//                         }`}
//                     >
//                       {opt.text}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </motion.div>
//           );
//         })}
//       </div>

//       <div className="flex gap-4 mt-10">
//         {phase > 0 && (
//           <motion.button
//             onClick={handlePrevPhase}
//             whileTap={{ scale: 0.95 }}
//             className="bg-gray-300 text-black px-6 py-3 rounded-xl shadow hover:bg-gray-400 transition"
//           >
//             Sebelumnya
//           </motion.button>
//         )}

//         {phase < 3 ? (
//           <motion.button
//             onClick={handleNextPhase}
//             whileTap={{ scale: 0.95 }}
//             className="bg-black text-white px-6 py-3 rounded-xl shadow hover:bg-gray-800 transition"
//           >
//             Selanjutnya
//           </motion.button>
//         ) : (
//           <motion.button
//             onClick={handleSubmit}
//             whileTap={{ scale: 0.95 }}
//             className="bg-green-600 text-white px-6 py-3 rounded-xl shadow hover:bg-green-700 transition"
//           >
//             {loading ? "Mengirim..." : "Submit Jawaban"}
//           </motion.button>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type Option = {
  text: string;
  point: number | string;
};

type ParsedAnswer = {
  options?: Option[];
  answer?: string;
};

type Question = {
  id: number;
  category: string;
  question_text: string;
  question_type: "benar_salah" | "skala_positif" | "skala_negatif";
  correct_answer: string;
};

export default function KuisionerPage() {
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState(0);

  // ✅ State khusus cek pretest
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState<boolean | null>(null);

  // ✅ 1. CEK PRETEST SAAT PERTAMA KALI LOAD
  useEffect(() => {
    const checkPretest = async () => {
      try {
        const res = await fetch("/api/questions/cekpretest");
        const data = await res.json();

        setAllowed(data.allowed);
        setChecking(false);

        // ✅ Jika boleh mengerjakan PRE_TEST, baru fetch soal
        if (data.allowed) {
          fetchQuestions();
        }
      } catch (error) {
        console.error("Gagal cek PRE_TEST:", error);
        setChecking(false);
      }
    };

    const fetchQuestions = async () => {
      const res = await fetch("/api/questions");
      const data = await res.json();
      setQuestions(data);
    };

    checkPretest();
  }, []);

  const handleSelect = (id: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const questionsPerPhase = Math.ceil(questions.length / 4);
  const currentQuestions = questions.slice(
    phase * questionsPerPhase,
    (phase + 1) * questionsPerPhase
  );

  const handleNextPhase = () => {
    if (phase < 3) setPhase(phase + 1);
  };

  const handlePrevPhase = () => {
    if (phase > 0) setPhase(phase - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const payload = Object.entries(answers).map(([qId, ans]) => ({
      questionId: Number(qId),
      answerValue: ans,
      soal: "PRE_TEST",
    }));

    const res = await fetch("/api/questions/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (res.ok) {
      alert("Jawaban berhasil dikirim!");
      router.push("/");
    } else {
      alert("Gagal submit jawaban.");
    }
  };

  // ✅ LOADING SAAT CEK PRETEST
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Mengecek status PRE TEST...</p>
      </div>
    );
  }

  // ✅ JIKA SUDAH PERNAH PRETEST
  if (allowed === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-semibold text-gray-800"
        >
          Anda sudah melakukan PRE TEST ✅
        </motion.h1>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/")}
          className="bg-black text-white px-6 py-3 rounded-xl shadow hover:bg-gray-800 transition"
        >
          Kembali ke Halaman Awal
        </motion.button>
      </div>
    );
  }

  // ✅ JIKA BOLEH MENGERJAKAN PRETEST
  return (
    <div className="min-h-screen w-full flex flex-col items-center px-5 py-10 bg-gray-50">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-semibold mb-8"
      >
        Kuisioner Ibu & Anak
      </motion.h1>

      <div className="w-full max-w-3xl flex flex-col gap-6">
        {currentQuestions.map((q, i) => {
          const parsed: ParsedAnswer = JSON.parse(q.correct_answer);

          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-200"
            >
              <h2 className="text-sm text-gray-500 font-medium mb-1">
                {q.category.replace("_", " ")}
              </h2>

              <p className="text-lg font-medium mb-4">{q.question_text}</p>

              {q.question_type === "benar_salah" && (
                <div className="flex gap-4">
                  {["Benar", "Salah"].map((item) => (
                    <button
                      key={item}
                      onClick={() => handleSelect(q.id, item)}
                      className={`px-4 py-2 rounded-lg border transition 
                        ${
                          answers[q.id] === item
                            ? "bg-teal-500 text-white border-teal-500"
                            : "border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}

              {(q.question_type === "skala_positif" ||
                q.question_type === "skala_negatif") && (
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {parsed.options?.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelect(q.id, opt.text)}
                      className={`px-4 py-3 rounded-xl border text-left transition 
                        ${
                          answers[q.id] === opt.text
                            ? "bg-blue-500 text-white border-blue-500"
                            : "border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="flex gap-4 mt-10">
        {phase > 0 && (
          <motion.button
            onClick={handlePrevPhase}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-300 text-black px-6 py-3 rounded-xl shadow hover:bg-gray-400 transition"
          >
            Sebelumnya
          </motion.button>
        )}

        {phase < 3 ? (
          <motion.button
            onClick={handleNextPhase}
            whileTap={{ scale: 0.95 }}
            className="bg-black text-white px-6 py-3 rounded-xl shadow hover:bg-gray-800 transition"
          >
            Selanjutnya
          </motion.button>
        ) : (
          <motion.button
            onClick={handleSubmit}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600 text-white px-6 py-3 rounded-xl shadow hover:bg-green-700 transition"
          >
            {loading ? "Mengirim..." : "Submit Jawaban"}
          </motion.button>
        )}
      </div>
    </div>
  );
}
