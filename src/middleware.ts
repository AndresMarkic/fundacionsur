import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

/**
 * Middleware edge-safe.
 *
 * Usa SOLO `authConfig` (sin el provider de Credentials, sin prisma/bcrypt), por
 * lo que no arrastra dependencias incompatibles con el edge runtime. El callback
 * `authorized` de `authConfig` decide si redirige a `/admin/login`.
 */
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // Cubre todo /admin/* (incluido /admin/login, que el callback deja pasar),
  // excluyendo assets internos y las rutas de la API de auth.
  matcher: ["/admin/:path*"],
};
