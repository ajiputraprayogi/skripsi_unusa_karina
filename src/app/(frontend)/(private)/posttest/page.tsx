import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import PosttestSection from "./PosttestSection";
import PosttestDoneSection from "./PosttestDoneSection";
import UserNavbar from "../components/layout/DashboardNavbar";

export const metadata: Metadata = {
  title: "Halaman PostTest",
};

export default async function PosttestPage() {

  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const email = session.user.email;
  const name = session.user.nama || "User";
  const avatar = session.user.image || "";

  let pretestFilled = false;
  let posttestFilled = false;

  // ====================
  // CEK PRETEST
  // ====================
  try {
    const pretestRes = await fetch(
      `https://script.google.com/macros/s/AKfycbwCyjqiI5KzPw6tMIdZizpKVd5XzI6TtNJliXrQgY9ZQCeZDXf72f_srLRuSbnA-Jdl/exec?email=${encodeURIComponent(email)}`,
      {
        cache: "no-store",
      }
    );

    const pretestData = await pretestRes.json();
    pretestFilled = pretestData?.filled === true;

  } catch (error) {
    console.error("Error cek pretest:", error);
  }

  // jika belum isi pretest → redirect
  if (!pretestFilled) {
    redirect("/pretest");
  }

  // ====================
  // CEK POSTTEST
  // ====================
  try {
    const posttestRes = await fetch(
      `https://script.google.com/macros/s/AKfycbzNawjTmg8xVqMgiiiRsbCsL1kKGl91xFd6HuUV9129fc-_7WpDvg49CUwdsYKxWz98gQ/exec?email=${encodeURIComponent(email)}`,
      {
        cache: "no-store",
      }
    );

    const posttestData = await posttestRes.json();
    posttestFilled = posttestData?.filled === true;

  } catch (error) {
    console.error("Error cek posttest:", error);
  }

  return (
    <>
      <UserNavbar
        name={name}
        email={email}
        avatar={avatar}
      />

      {posttestFilled ? (
        <PosttestDoneSection />
      ) : (
        <PosttestSection email={email} />
      )}
    </>
  );
}