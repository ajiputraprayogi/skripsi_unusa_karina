"use client";

import { Suspense } from "react";
import RegisterPageComponent from "./RegisterPageComponent";

export const dynamic = "force-dynamic"; // tetap supaya tidak diprerender statis

export default function RegisterPage() {
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