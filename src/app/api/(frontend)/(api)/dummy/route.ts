import { NextResponse } from "next/server";

export async function GET() {
  const data = [
    {
      id: 1,
      title: "Anak Usia 3 Tahun Sudah Bisa Apa? Ini Tahapan & Stimulasinya",
      video_url: "https://www.youtube.com/watch?v=idy-IxcA9UQ",
      usia: 3,
    },
    {
      id: 2,
      title: "Anak Usia 4 Tahun Sudah Bisa Apa? Ini Tahapan & Stimulasi Perkembangan",
      video_url: "https://www.youtube.com/watch?v=s3OYDE00VIY",
      usia: 4,
    },
    {
      id: 4,
      title: "Anak 5 Tahun Sudah Siap Sekolah? Ini Tahapan & Stimulasinya",
      video_url: "https://www.youtube.com/watch?v=YFsdWw9ip2A",
      usia: 5,
    },
    // {
    //   id: 5,
    //   title: "Ibu 1",
    //   video_url: "https://www.youtube.com/watch?v=D-x91uN7LhA",
    //   usia: 25,
    // },
    // {
    //   id: 6,
    //   title: "Ibu 2",
    //   video_url: "https://www.youtube.com/watch?v=D-x91uN7LhA",
    //   usia: 32,
    // },
    // {
    //   id: 7,
    //   title: "Ibu 3",
    //   video_url: "https://www.youtube.com/watch?v=D-x91uN7LhA",
    //   usia: 28,
    // },
  ];

  return NextResponse.json({
    status: "success",
    total: data.length,
    data,
  });
}