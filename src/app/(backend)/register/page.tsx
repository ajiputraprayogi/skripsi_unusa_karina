"use client";

import { Suspense, useEffect } from "react";
import RegisterPageComponent from "./RegisterPageComponent";

export const dynamic = "force-dynamic"; // tetap supaya tidak diprerender statis

export default function RegisterPage() {

  useEffect(() => {
    document.title = "Halaman Daftar";
  }, []);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      }
    >
      <RegisterPageComponent />
    </Suspense>
  );
}