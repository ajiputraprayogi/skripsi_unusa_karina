"use client";

import { Suspense, useEffect } from "react";
import LoginPageComponent from "./LoginPageComponent";

export const dynamic = "force-dynamic";

export default function LoginPage() {

  useEffect(() => {
    document.title = "Halaman Login";
  }, []);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      }
    >
      <LoginPageComponent />
    </Suspense>
  );
}