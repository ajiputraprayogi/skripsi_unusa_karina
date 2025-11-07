"use client";

import { Suspense } from "react";
import LoginPageComponent from "./LoginPageComponent";

export const dynamic = "force-dynamic"; // ⬅️ tetap supaya tidak diprerender statis

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <LoginPageComponent />
    </Suspense>
  );
}
