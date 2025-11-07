"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";

export default function AddPortofolioButton() {
  const router = useRouter();

  function handleAdd() {
    router.push("/backend/portofolio/create"); // ✅ arahkan ke halaman create portofolio
  }

  return (
    <Button
      size="xs"
      variant="primary"
      type="button"
      onClick={handleAdd}
    >
      Tambah
    </Button>
  );
}
