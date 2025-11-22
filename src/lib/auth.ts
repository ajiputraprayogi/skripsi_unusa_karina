import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

// Perhatian: Jika Anda menggunakan @/lib/db/prisma, ganti baris ini:
// const prisma = new PrismaClient(); 
import { prisma } from "@/lib/db"; // Asumsi Anda menggunakan instance Prisma singleton dari lib/db

// Definisikan tipe User sederhana dan PASTIKAN 'level' ada
interface SimpleUser extends User {
  id: string;
  nama: string;
  email: string;
  level: string; // Tipe yang akan digunakan di Session dan JWT
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email & Nama Lengkap",
      credentials: {
        email: { label: "Email", type: "text" },
        namaLengkap: { label: "Nama Lengkap", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.namaLengkap) {
          throw new Error("Email dan Nama Lengkap harus diisi");
        }

        // Cari user di tabel public.users
        const user = await prisma.users.findFirst({
          where: {
            email: credentials.email,
            namalengkap: credentials.namaLengkap,
          },
          select: { 
            id: true,
            namalengkap: true,
            email: true,
            level: true, // Ambil kolom 'level'
          }
        });

        if (!user) {
          throw new Error("Email atau Nama Lengkap salah");
        }

        // ✅ Penanganan Null Check untuk level dari DB
        const userLevel: string = user.level ?? "User"; 

        // Kembalikan objek pengguna dengan 'level'
        return {
          id: user.id.toString(),
          nama: user.namalengkap ?? "",
          email: user.email ?? "",
          level: userLevel, 
        } as SimpleUser;
      },
    }),
  ],
  // --- Konfigurasi Sesi ---
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // 2 jam
  },
  // --- Callbacks ---
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const simpleUser = user as SimpleUser;
        token.id = simpleUser.id;
        token.nama = simpleUser.nama;
        token.email = simpleUser.email;
        token.level = simpleUser.level; // Simpan level di JWT
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          nama: token.nama as string,
          email: token.email as string,
          level: token.level as string, // Pindahkan level dari JWT ke Session
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      return `${baseUrl}/backend`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

export default NextAuth(authOptions);