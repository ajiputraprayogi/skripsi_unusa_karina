"use client";

import { motion } from "framer-motion";

/* ================== TYPES ================== */
type VideoItem = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
};

/* ================== DUMMY DATA ================== */
const videos: VideoItem[] = [
  {
    id: "1",
    title: "Pengenalan Sistem",
    description: "Penjelasan singkat tentang alur dan tujuan sistem.",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "2",
    title: "Cara Mengisi Google Form",
    description: "Tutorial langkah demi langkah pengisian form.",
    thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
  },
  {
    id: "3",
    title: "Aturan & Ketentuan",
    description: "Hal-hal penting yang wajib diperhatikan peserta.",
    thumbnail: "https://img.youtube.com/vi/l482T0yNkeo/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=l482T0yNkeo",
  },
];

/* ================== ANIMATION ================== */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

/* ================== PAGE ================== */
export default function VideoListPage() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl font-semibold text-gray-800">
            Video Pembelajaran
          </h1>
          <p className="mt-2 text-gray-600 text-sm">
            Silakan tonton video berikut sebelum melanjutkan
          </p>
        </motion.div>

        {/* GRID VIDEOS */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {videos.map((video) => (
            <motion.a
              key={video.id}
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl bg-white shadow-sm hover:shadow-md overflow-hidden transition"
            >
              {/* THUMBNAIL */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition" />
              </div>

              {/* CONTENT */}
              <div className="p-4">
                <h2 className="font-medium text-gray-800 line-clamp-2">
                  {video.title}
                </h2>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {video.description}
                </p>

                <div className="mt-4 text-sm text-pink-600 font-medium">
                  ▶ Tonton Video
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
