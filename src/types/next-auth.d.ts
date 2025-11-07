import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      nama: string;
      email: string;
      roles: string[];
      permissions: string[];
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    nama: string;
    roles: string[];
    permissions: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    nama: string;
    email: string;
    roles: string[];
    permissions: string[];
  }
}
