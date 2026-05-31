import type { DefaultSession } from "next-auth";

// Extiende los tipos de Auth.js para incluir el id del admin en la sesión/JWT.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}
