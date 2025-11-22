"use client";

import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();

  // Masih loading
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // Belum login
  if (!session) {
    return <p>Belum login cuy</p>;
  }

  // Ambil level dari session
  const level = session?.user?.level;

  // Sudah login
  return (
    <p>
      Halo {session.user?.email}, kamu sudah login! <br />
      Level kamu: {level}
    </p>
  );
}
