"use client";

import { motion } from "framer-motion";

export default function QuestionGroup({
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
