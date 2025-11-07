"use client";
import React from "react";
import { useSession } from "next-auth/react";

export const EcommerceMetrics = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="mt-4 text-gray-500 dark:text-gray-400">Memuat...</p>;
  }

  // Ambil role pertama, atau fallback ke "Admin"
  const role = session?.user?.roles?.[0] || "Admin";
  const nama = session?.user?.nama || ""; // bisa tampilkan nama user juga

  return (
    <div className="mt-4">
      <h4 className="font-bold text-gray-800 text-title-md dark:text-white/90">
        Selamat Datang, {nama || role}!
      </h4>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Selamat datang di dashboard Lanara Architect. Pantau semua data proyek dan aktivitas terbaru di sini.
      </p>
    </div>
  );
};
