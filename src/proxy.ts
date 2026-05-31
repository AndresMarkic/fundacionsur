import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

/**
 * Proxy edge-safe (antes "middleware"; Next 16 renombró el convenio a `proxy`).
 *
 * Usa SOLO `authConfig` (sin el provider de Credentials, sin prisma/bcrypt), por
 * lo que no arrastra dependencias incompatibles con el edge runtime. El callback
 * `authorized` de `authConfig` decide si redirige a `/admin/login`.
 *
 * Además expone la ruta actual en el header `x-pathname` para que el layout
 * raíz (que renderiza el chrome público) sepa que está bajo `/admin` y lo
 * suprima. Como el matcher solo cubre `/admin/*`, este header SOLO aparece en
 * rutas de admin; su ausencia significa "ruta pública".
 */
const { auth } = NextAuth(authConfig);

export const proxy = auth((req) => {
  // `auth()` ya resolvió el redirect a /admin/login si corresponde. Si llegamos
  // acá con respuesta normal, propagamos la ruta para el layout raíz.
  const headers = new Headers(req.headers);
  headers.set("x-pathname", req.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
});

export const config = {
  // Cubre todo /admin/* (incluido /admin/login, que el callback deja pasar).
  matcher: ["/admin/:path*"],
};
