"use client";

import QuestionGroup from "./group";

export default function Step2PengetahuanIbu() {
  return (
    <QuestionGroup
      title="Kuesioner Pengetahuan Ibu"
      questions={[
        "Tumbuh kembang mencakup 2 peristiwa berbeda tapi saling berkaitan: pertumbuhan & perkembangan.",
        "Aspek perkembangan anak terdiri dari gerak halus, kasar, bahasa, dan kemandirian.",
        "Stimulasi adalah kegiatan merangsang kemampuan dasar anak usia 0-6 tahun.",
        "Perkembangan memerlukan stimulasi seperti mainan, sosialisasi, dan keterlibatan keluarga.",
        "Stimulasi tidak boleh dilakukan ketika bayi atau balita sedang mengantuk dan bosan.",
        "Peran ibu dalam stimulasi sangat berpengaruh pada perkembangan anak.",
        "Prinsip stimulasi adalah menggunakan alat permainan sederhana dan aman.",
        "Memberikan pujian atas keberhasilan anak adalah prinsip stimulasi.",
        "Melatih anak berlari dan melompat merupakan stimulasi gerak kasar.",
        "Menulis huruf, angka, dan menggambar garis lurus termasuk stimulasi gerak halus.",
        "Mengajari anak menghitung adalah bentuk stimulasi gerak halus.",
        "Membacakan buku cerita adalah contoh stimulasi bicara dan bahasa.",
        "Membiarkan anak bermain dengan teman adalah stimulasi sosial dan kemandirian.",
        "Mengajak anak bermain di taman termasuk stimulasi sosial dan kemandirian.",
        "Keberhasilan stimulasi dipengaruhi oleh waktu, durasi, dan prosesnya.",
      ]}
      options={["Benar", "Salah"]}
    />
  );
}
