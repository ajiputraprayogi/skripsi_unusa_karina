"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Option = {
  text: string;
  point: number | string;
};

type ParsedAnswer = {
  options?: Option[];
  correct?: string;
};

type Question = {
  id: number;
  category: string;
  question_text: string;
  question_type: "benar_salah" | "skala_positif" | "skala_negatif";
  correct_answer: string; // JSON string
};

export default function KuisionerPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);

  const USER_ID = 1; // ← nanti ganti dengan user actual (JWT / session)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/questions");
      const data = await res.json();
      setQuestions(data);
    };
    fetchData();
  }, []);

  const handleSelect = (id: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  // === HITUNG NILAI PER PERTANYAAN ===
  const calculateScore = (question: Question, answer: string) => {
    const parsed: ParsedAnswer = JSON.parse(question.correct_answer);

    if (question.question_type === "benar_salah") {
      const correct = parsed.correct || "";
      return answer === correct ? 1 : 0;
    }

    if (parsed.options) {
      const opt = parsed.options.find((o) => o.text === answer);
      return opt ? Number(opt.point) : 0;
    }

    return 0;
  };

  // === SUBMIT TO API /responses ===
  const handleSubmit = async () => {
    setLoading(true);

    const payload = Object.entries(answers).map(([qId, ans]) => {
      const q = questions.find((x) => x.id === Number(qId));
      if (!q) return null;

      return {
        user_id: USER_ID,
        question_id: q.id,
        answer_value: ans,
        calculated_score: calculateScore(q, ans),
      };
    }).filter(Boolean);

    const res = await fetch("/api/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ responses: payload }),
    });

    setLoading(false);

    if (res.ok) {
      alert("Jawaban berhasil dikirim!");
    } else {
      alert("Gagal submit jawaban.");
    }
  };

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
        {questions.map((q, i) => {
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

              {/* === BENAR / SALAH === */}
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

              {/* === SKALA === */}
              {(q.question_type === "skala_positif" ||
                q.question_type === "skala_negatif") && (
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {parsed.options?.map((opt: Option, idx: number) => (
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

      <motion.button
        onClick={handleSubmit}
        whileTap={{ scale: 0.95 }}
        className="mt-10 bg-black text-white px-6 py-3 rounded-xl shadow hover:bg-gray-800 transition"
      >
        {loading ? "Mengirim..." : "Submit Jawaban"}
      </motion.button>
    </div>
  );
}