import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { prisma } from "@/lib/prisma";
import { validateAdmin } from "@/lib/auth";

/**
 * Configuración COMPLETA de Auth.js (corre en Node).
 *
 * Toma la base edge-safe (`authConfig`) y le agrega el provider de Credentials,
 * cuyo `authorize` usa prisma + bcryptjs (vía `validateAdmin`). Sesión por JWT
 * para que el middleware pueda verificarla sin pegarle a la base.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string" ? credentials.email : "";
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : "";

        return validateAdmin(email, password, async (e) => {
          const admin = await prisma.adminUser.findUnique({
            where: { email: e },
          });
          if (!admin) return null;
          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            passwordHash: admin.passwordHash,
          };
        });
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    // Propaga el id del admin al token JWT.
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // Refleja id/email del token en la sesión expuesta al servidor/cliente.
    session({ session, token }) {
      if (session.user) {
        if (typeof token.id === "string") session.user.id = token.id;
        if (typeof token.email === "string") session.user.email = token.email;
      }
      return session;
    },
  },
});
