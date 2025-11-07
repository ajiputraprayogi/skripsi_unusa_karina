"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";

export default function AddBannerButton() {
  const router = useRouter();

  function handleAdd() {
    router.push("/backend/banner/create"); // ✅ arahkan ke halaman create banner
  }

  return (
    <Button
      size="xs"
      variant="primary"
      type="button"
      onClick={handleAdd}
    >
      Tambah Banner
    </Button>
  );
}
