import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import MateriSection from "./MateriSection";

export default async function MateriPage() {

  // 1️⃣ cek login
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const email = session.user.email;

  try {

    // 2️⃣ cek ke Google Apps Script
    const res = await fetch(
      `https://script.google.com/macros/s/AKfycbzw21TfPdtkdIg4gbjds0fG9Xf5IpTIy_O0ib4zjsbRTilk_7NnhEYvSHbc8KUo6PGQ/exec?email=${encodeURIComponent(email)}`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    // 3️⃣ jika BELUM isi quiz → redirect ke quiz
    if (data.filled === false) {
      redirect("/quiz");
    }

  } catch (error) {

    console.error("Error cek spreadsheet:", error);

    // optional: redirect ke quiz jika error
    redirect("/quiz");
  }

  // 4️⃣ jika sudah isi quiz → tampilkan materi
  return <MateriSection email={email} />;
}