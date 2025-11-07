"use client";

import { motion } from "framer-motion";

const videos = [
  {
    title: "Stimulasi Anak Usia Dini",
    url: "https://www.youtube.com/embed/qzq8XFS_z_I?si=HX9Rz_26QYPB6CPO",
  },
  {
    title: "Tips Parenting Modern",
    url: "https://www.youtube.com/embed/qzq8XFS_z_I?si=HX9Rz_26QYPB6CPO",
  },
  {
    title: "Cara Bermain Edukatif di Rumah",
    url: "https://www.youtube.com/embed/qzq8XFS_z_I?si=HX9Rz_26QYPB6CPO",
  },
  {
    title: "Pentingnya Peran Ibu dalam Tumbuh Kembang Anak",
    url: "https://www.youtube.com/embed/qzq8XFS_z_I?si=HX9Rz_26QYPB6CPO",
  },
];

export default function VideoCardPage() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 py-16 px-6 flex justify-center">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-800">
            Video Inspiratif untuk Ibu & Anak 
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Jelajahi video menarik yang membantu Anda memahami stimulasi dan tumbuh kembang anak dengan cara yang menyenangkan.
          </p>
        </motion.div>

        {/* Video Grid */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {videos.map((video, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 },
              }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-md border border-gray-200 hover:shadow-xl transition cursor-pointer"
            >
              <div className="relative w-full aspect-video">
                <iframe
                  src={video.url}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full object-cover rounded-t-2xl"
                ></iframe>
              </div>
              <div className="p-4">
                <h2 className="text-lg font-medium text-gray-800">{video.title}</h2>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
