import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import PretestSection from "./PretestSection";
import PretestDoneSection from "./PretestDoneSection";
import UserNavbar from "../components/layout/DashboardNavbar";

export const metadata: Metadata = {
  title: "Halaman Pre Test",
};

export default async function PretestPage() {

  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const email = session.user.email;
  const name = session.user.nama || "User";
  const avatar = session.user.image || "";

  let filled = false;

  try {

    const res = await fetch(
      `https://script.google.com/macros/s/AKfycbwCyjqiI5KzPw6tMIdZizpKVd5XzI6TtNJliXrQgY9ZQCeZDXf72f_srLRuSbnA-Jdl/exec?email=${encodeURIComponent(email)}`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();
    filled = data?.filled === true;

  } catch (error) {

    console.error("Error cek spreadsheet:", error);
    filled = false;

  }

  return (
    <>
      <UserNavbar
        name={name}
        email={email}
        avatar={avatar}
      />

      {filled ? (
        <PretestDoneSection />
      ) : (
        <PretestSection email={email} />
      )}
    </>
  );
}