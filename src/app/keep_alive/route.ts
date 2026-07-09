// File: ./src/app/keep_alive/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * ✅ GET: Memicu 'ping' (UPSERT/UPDATE baris tunggal) dan melakukan ping ke Google Apps Script (pretest & posttest)
 * untuk menghindari cold start.
 */
export async function GET() {
  let dbSuccess = false;
  let updatedKeepAlive = null;
  const googleAppsScriptResults: Record<string, any> = {};

  const email = "prayogiputraaji@gmail.com";
  const urlEksperimen = `https://script.google.com/macros/s/AKfycbz7VXp27u0kELz19CbAzs9a0ZJE_sjIU9QUX8iZLR13Gqc4WWf0k6dnxZdN51hFQ6Jq/exec?email=${encodeURIComponent(email)}`;
  const urlPostTest = `https://script.google.com/macros/s/AKfycbwi7D3FJUqq20kyMRoFigvvSATY84c1LoVCTOVf7PgGi8xZqKqJjupBOqF3U5WLT8Co7w/exec?email=${encodeURIComponent(email)}`;

  // 1. **Memicu 'Ping' Database (Supabase) menggunakan Prisma**
  try {
    updatedKeepAlive = await prisma.keep_alive.upsert({
      where: { id: 1 },
      update: { last_ping: new Date() },
      create: { id: 1, last_ping: new Date() },
    });
    dbSuccess = true;
  } catch (error) {
    console.error("Prisma error (GET Keep-Alive/UPSERT Failed):", error);
  }

  // 2. **Memicu 'Ping' Google Apps Script (Eksperimen & Post Test)**
  try {
    const [resEksperimen, resPostTest] = await Promise.allSettled([
      fetch(urlEksperimen, { cache: "no-store", signal: AbortSignal.timeout(10000) }).then((r) => r.json()),
      fetch(urlPostTest, { cache: "no-store", signal: AbortSignal.timeout(10000) }).then((r) => r.json()),
    ]);

    googleAppsScriptResults.eksperimen =
      resEksperimen.status === "fulfilled"
        ? { success: true, data: resEksperimen.value }
        : { success: false, error: String(resEksperimen.reason) };

    googleAppsScriptResults.postTest =
      resPostTest.status === "fulfilled"
        ? { success: true, data: resPostTest.value }
        : { success: false, error: String(resPostTest.reason) };
  } catch (error) {
    console.error("Google Apps Script ping failed:", error);
    googleAppsScriptResults.error = String(error);
  }

  // Jika DB fail, kembalikan status 500
  if (!dbSuccess) {
    return NextResponse.json(
      {
        error: "Failed to perform database keep-alive. Check server logs.",
        googleAppsScript: googleAppsScriptResults,
      },
      { status: 500 }
    );
  }

  // Mengembalikan status 200 OK beserta detail response keep-alive
  return NextResponse.json({
    message: "Keep-alive ping completed.",
    dbKeepAlive: {
      success: true,
      newPingTime: updatedKeepAlive?.last_ping,
    },
    googleAppsScript: googleAppsScriptResults,
  });
}

/**
 * ❌ POST: Dinonaktifkan
 */
export async function POST() {
    return NextResponse.json(
        { error: "POST method is not used for keep-alive. Use GET instead." }, 
        { status: 405 }
    );
}