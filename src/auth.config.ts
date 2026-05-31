import type { NextAuthConfig } from "next-auth";

/**
 * Configuración EDGE-SAFE de Auth.js (next-auth v5).
 *
 * Este archivo lo consume el middleware (que corre en el edge runtime), por eso
 * NO incluye el provider de Credentials (que usa bcryptjs y prisma, ambos solo
 * Node) ni importa prisma. El provider real se agrega en `src/auth.ts`, que
 * corre en Node.
 *
 * - `pages.signIn`: a dónde mandar a los no autenticados.
 * - `callbacks.authorized`: protege `/admin/*` (excepto `/admin/login`). El
 *   helper de middleware usa este callback para decidir el redirect.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  // Sin providers acá: se inyectan en auth.ts (Node). El array vacío mantiene
  // el bundle del middleware libre de bcryptjs/prisma.
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // La ruta de login es pública (si no, loop de redirects).
      if (pathname === "/admin/login") {
        if (isLoggedIn) {
          return Response.redirect(new URL("/admin", nextUrl));
        }
        return true;
      }

      // Todo lo demás bajo /admin requiere sesión.
      if (pathname.startsWith("/admin")) {
        return isLoggedIn;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

export default authConfig;
