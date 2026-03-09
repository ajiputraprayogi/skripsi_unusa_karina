import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserNavbar from "../components/layout/DashboardNavbar";
import VideoSection from "./video";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Halaman Materi",
};

export default async function MateriPage() {

  // 1️⃣ cek login
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const email = session.user.email;
  const name = session.user.nama || "User";
  const avatar = session.user.image || null;

  try {

    // 2️⃣ cek ke Google Apps Script
    const res = await fetch(
      `https://script.google.com/macros/s/AKfycbwCyjqiI5KzPw6tMIdZizpKVd5XzI6TtNJliXrQgY9ZQCeZDXf72f_srLRuSbnA-Jdl/exec?email=${encodeURIComponent(email)}`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    // 3️⃣ jika BELUM isi pretest → redirect ke pretest
    if (data.filled === false) {
      redirect("/pretest");
    }

  } catch (error) {

    console.error("Error cek spreadsheet:", error);

    // optional: redirect ke pretest jika error
    redirect("/pretest");
  }

  // 4️⃣ jika sudah isi pretest → tampilkan materi
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-100">
      
      <UserNavbar
        name={name}
        email={email}
        avatar={avatar}
      />

      <main className="flex justify-center px-6 py-10">
        <div className="w-full max-w-6xl">
          <VideoSection />
        </div>
      </main>

    </div>
  );
  
}