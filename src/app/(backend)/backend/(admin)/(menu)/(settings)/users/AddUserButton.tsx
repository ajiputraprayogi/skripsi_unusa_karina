"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";

export default function AddUserButton() {
  const router = useRouter();

  function handleAdd() {
    router.push("/backend/users/create"); // sesuaikan path halaman tambah user
  }

  return (
    <Button 
      size="xs" 
      variant="primary" 
      type="submit"
      onClick={handleAdd}>
      Tambah
    </Button>
  );
}
