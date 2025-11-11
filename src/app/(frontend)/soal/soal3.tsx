"use client";

import QuestionGroup from "./group";

export default function Step3SikapIbu() {
  return (
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
  );
}
