// // app/api/auth/[...nextauth]/route.js atau pages/api/auth/[...nextauth].js
// import NextAuth, { NextAuthOptions, User } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// // Definisikan tipe User sederhana
// // Catatan: Interface ini hanya memastikan tipe yang dikembalikan dari authorize() benar.
// interface SimpleUser extends User {
//   id: string;
//   nama: string;
//   email: string;
// }

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Email & Nama Lengkap",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         namaLengkap: { label: "Nama Lengkap", type: "text" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.namaLengkap) {
//           throw new Error("Email dan Nama Lengkap harus diisi");
//         }

//         // Cari user di tabel public.users
//         const user = await prisma.users.findFirst({
//           where: {
//             email: credentials.email,
//             namalengkap: credentials.namaLengkap, // Verifikasi Nama Lengkap
//           },
//         });

//         if (!user) {
//           throw new Error("Email atau Nama Lengkap salah");
//         }

//         // Kembalikan objek pengguna sederhana (tanpa roles/permissions)
//         return {
//           id: user.id.toString(), // ID harus string
//           nama: user.namalengkap ?? "",
//           email: user.email ?? "",
//         } as SimpleUser;
//       },
//     }),
//   ],
//   // --- Konfigurasi Sesi ---
//   pages: {
//     signIn: "/login",
//   },
//   session: {
//     strategy: "jwt",
//     maxAge: 2 * 60 * 60, // 2 jam
//   },
//   // --- Callbacks Sederhana (Sudah Disesuaikan) ---
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         const simpleUser = user as SimpleUser;
//         token.id = simpleUser.id;
//         token.nama = simpleUser.nama;
//         token.email = simpleUser.email;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user = {
//           id: token.id as string,
//           nama: token.nama as string,
//           email: token.email as string,
//         };
//       }
//       return session;
//     },
//     async redirect({ url, baseUrl }) {
//       if (url.startsWith(baseUrl)) return url;
//       return `${baseUrl}/backend`;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   debug: true,
// };

// export default NextAuth(authOptions);

// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Definisikan tipe User sederhana dan PASTIKAN 'level' ada
interface SimpleUser extends User {
 id: string;
 nama: string;
 email: string;
 level: string; // 🚨 DIUBAH: Dibuat wajib (atau sertakan fallback)
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
     select: { // 🚨 PENYESUAIAN 1: Ambil kolom level dari DB
      id: true,
      namalengkap: true,
      email: true,
      level: true, // Asumsikan ada kolom 'level' di tabel users
     }
    });

    if (!user) {
     throw new Error("Email atau Nama Lengkap salah");
    }

    // 🚨 PENYESUAIAN 2: Kembalikan objek pengguna dengan 'level'
    return {
     id: user.id.toString(),
     nama: user.namalengkap ?? "",
     email: user.email ?? "",
     level: user.level ?? "User", // Gunakan 'User' jika level null/undefined
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
    token.level = simpleUser.level; // 🚨 PENYESUAIAN 3: Simpan level di JWT
   }
   return token;
  },
  async session({ session, token }) {
   if (token) {
    session.user = {
     id: token.id as string,
     nama: token.nama as string,
     email: token.email as string,
     level: token.level as string, // 🚨 PENYESUAIAN 4: Pindahkan level dari JWT ke Session
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