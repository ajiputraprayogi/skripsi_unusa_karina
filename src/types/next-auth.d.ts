import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt"; // Import JWT secara eksplisit jika diperlukan

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      nama: string;
      email: string;
      // ❌ roles dan permissions dihapus
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    nama: string;
    // ❌ roles dan permissions dihapus
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    nama: string;
    email: string;
    // ❌ roles dan permissions dihapus
  }
}