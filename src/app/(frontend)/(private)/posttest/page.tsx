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
      `https://script.google.com/macros/s/AKfycbz7VXp27u0kELz19CbAzs9a0ZJE_sjIU9QUX8iZLR13Gqc4WWf0k6dnxZdN51hFQ6Jq/exec?email=${encodeURIComponent(email)}`,
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
      `https://script.google.com/macros/s/AKfycbwi7D3FJUqq20kyMRoFigvvSATY84c1LoVCTOVf7PgGi8xZqKqJjupBOqF3U5WLT8Co7w/exec?email=${encodeURIComponent(email)}`,
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