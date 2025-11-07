// src/app/api/service/route.ts
import { NextResponse } from "next/server";
import { sizePattern } from "@/utils/size";

export async function GET() {
  // Data asli cuma dari DB (tanpa size)
  const dbProjects = [
    {
      id: 1,
      title: "Prabowo",
      desc: "Villa mewah dengan arsitektur modern dan detail artistik, menghadirkan suasana elegan sekaligus nyaman.",
      img: "/images/design/villa1.jpg",
    },
    {
      id: 2,
      title: "Villa Axel",
      desc: "Hunian eksklusif dengan desain kontemporer, dilengkapi pencahayaan alami dan tata ruang yang luas.",
      img: "/images/design/villa2.jpg",
    },
    {
      id: 3,
      title: "Villa Kaca",
      desc: "Konsep villa berlapis kaca penuh untuk menikmati panorama alam secara maksimal, cocok untuk liburan keluarga.",
      img: "/images/design/villa3.jpg",
    },
    {
      id: 4,
      title: "Sketch Villa Tropis",
      desc: "Sketsa rancangan villa tropis dengan ventilasi alami, nuansa kayu, dan keterhubungan dengan alam sekitar.",
      img: "/images/design/sketch1.jpg",
    },
    {
      id: 5,
      title: "Sketch Villa Minimalis",
      desc: "Desain awal villa minimalis yang menonjolkan garis bersih, tata ruang efisien, dan konsep terbuka.",
      img: "/images/design/sketch2.jpg",
    },
    {
      id: 6,
      title: "Sketch Villa Resort",
      desc: "Konsep sketsa villa resort dengan area terbuka luas, kolam renang, dan sentuhan arsitektur modern.",
      img: "/images/design/sketch3.jpg",
    },
        {
      id: 7,
      title: "Villa Atlas",
      desc: "Villa mewah dengan arsitektur modern dan detail artistik, menghadirkan suasana elegan sekaligus nyaman.",
      img: "/images/design/villa1.jpg",
    },
    {
      id: 8,
      title: "Villa Axel",
      desc: "Hunian eksklusif dengan desain kontemporer, dilengkapi pencahayaan alami dan tata ruang yang luas.",
      img: "/images/design/villa2.jpg",
    },
    {
      id: 9,
      title: "Villa Kaca",
      desc: "Konsep villa berlapis kaca penuh untuk menikmati panorama alam secara maksimal, cocok untuk liburan keluarga.",
      img: "/images/design/villa3.jpg",
    },
    {
      id: 10,
      title: "Sketch Villa Tropis",
      desc: "Sketsa rancangan villa tropis dengan ventilasi alami, nuansa kayu, dan keterhubungan dengan alam sekitar.",
      img: "/images/design/sketch1.jpg",
    },
    {
      id: 11,
      title: "Sketch Villa Minimalis",
      desc: "Desain awal villa minimalis yang menonjolkan garis bersih, tata ruang efisien, dan konsep terbuka.",
      img: "/images/design/sketch2.jpg",
    },
    {
      id: 12,
      title: "Sketch Villa Resort",
      desc: "Konsep sketsa villa resort dengan area terbuka luas, kolam renang, dan sentuhan arsitektur modern.",
      img: "/images/design/sketch3.jpg",
    },
  ];

  // Gabungkan dengan pola size
  const projectsWithSize = dbProjects.map((proj, idx) => ({
    ...proj,
    size: sizePattern[idx % sizePattern.length], // looping otomatis
  }));

  return NextResponse.json(projectsWithSize);
}