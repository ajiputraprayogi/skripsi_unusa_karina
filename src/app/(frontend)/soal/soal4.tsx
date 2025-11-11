"use client";

import QuestionGroup from "./group";

export default function Step4MotivasiIbu() {
  return (
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
  );
}
