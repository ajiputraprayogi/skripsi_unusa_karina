import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import QuizSection from "./QuizSection";

export default async function QuizPage() {

  // 1️⃣ cek login
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const email = session.user.email;

  let filled = false;

  try {

    // 2️⃣ cek ke Google Apps Script
    const res = await fetch(
      `https://script.google.com/macros/s/AKfycbzw21TfPdtkdIg4gbjds0fG9Xf5IpTIy_O0ib4zjsbRTilk_7NnhEYvSHbc8KUo6PGQ/exec?email=${encodeURIComponent(email)}`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    filled = data?.filled === true;

  } catch (error) {

    console.error("Error cek spreadsheet:", error);

    // jika error, anggap belum isi quiz
    filled = false;
  }

  // 3️⃣ redirect HARUS di luar try-catch
  if (filled) {
    redirect("/materi");
  }

  // 4️⃣ tampilkan quiz jika belum isi
  return <QuizSection email={email} />;
}