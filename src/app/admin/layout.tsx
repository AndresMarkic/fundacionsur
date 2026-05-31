import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth, signOut } from "@/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

// El panel usa prisma (Node) y no debe cachearse.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Layout del panel admin (Server Component, runtime Node).
 *
 * Defensa en profundidad: además del middleware, acá llamamos `auth()` y, si no
 * hay sesión, redirigimos a `/admin/login`. La ruta de login queda EXENTA del
 * guard y del chrome (si no, loop de redirects): la detectamos por la ruta que
 * el middleware expone en `x-pathname`.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isLogin = pathname === "/admin/login";

  // La pantalla de login se renderiza sin chrome ni guard.
  if (isLogin) {
    return <>{children}</>;
  }

  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  const email = session.user.email ?? "";

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <div className="flex min-h-screen bg-fondo text-austral">
      <AdminSidebar onSignOut={handleSignOut} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-piedra/20 bg-white px-6 py-4">
          <div className="text-sm text-piedra">Panel de administración</div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-piedra sm:inline">Sesión:</span>
            <span className="font-medium text-austral">{email}</span>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
