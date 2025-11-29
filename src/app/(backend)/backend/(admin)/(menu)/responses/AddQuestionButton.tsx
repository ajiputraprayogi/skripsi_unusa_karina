// "use client";
import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";

export default function AddQuestionButton() {
  const router = useRouter();

  function handleAdd() {
    // ✅ PERUBAHAN: Arahkan ke halaman create pertanyaan
    router.push("/backend/questions/create"); 
  }

  return (
    <Button
      size="xs"
      variant="primary"
      type="button"
      onClick={handleAdd}
    >
      Tambah Pertanyaan
    </Button>
  );
}