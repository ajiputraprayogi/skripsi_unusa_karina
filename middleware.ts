import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });
  const { pathname } = req.nextUrl;

  // 1️⃣ Jika user sudah login dan mencoba buka /login → redirect ke /backend
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/backend", req.url));
  }

  // 2️⃣ Jika user BELUM login dan mencoba akses /backend → redirect ke /login
  if (!token && pathname.startsWith("/backend")) {
    const loginUrl = new URL("/login", req.url);

    // simpan callbackUrl supaya setelah login bisa kembali
    loginUrl.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(loginUrl);
  }

  // izinkan akses jika tidak ada masalah
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/backend/:path*","/quiz"], // middleware jalan di login + backend
};
