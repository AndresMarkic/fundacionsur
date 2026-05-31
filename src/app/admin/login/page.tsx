import Image from "next/image";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { auth, signIn } from "@/auth";
import { LoginForm } from "./LoginForm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ingresar al panel",
  robots: { index: false, follow: false },
};

/**
 * Server action de login. Intenta autenticar con el provider de credenciales.
 * - Éxito: `signIn` lanza un redirect a `/admin` (no retorna).
 * - Fallo: devuelve un mensaje genérico (no revela qué campo falló).
 */
async function authenticate(
  _prev: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  "use server";
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "Credenciales inválidas. Verificá el email y la contraseña.";
    }
    // `signIn` usa un redirect interno (NEXT_REDIRECT) en el caso de éxito:
    // hay que re-lanzarlo para que Next complete la navegación.
    throw error;
  }
  return undefined;
}

export default async function AdminLoginPage() {
  // Si ya hay sesión, no mostramos el login.
  const session = await auth();
  if (session?.user) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-fondo px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/brand/isotipo.png"
            alt="Fundación Sur"
            width={64}
            height={64}
            priority
            className="rounded"
          />
          <h1 className="mt-5 font-display text-2xl text-austral">
            Panel de administración
          </h1>
          <p className="mt-1 text-sm text-piedra">
            Ingresá con tus credenciales.
          </p>
        </div>

        <div className="rounded-2xl border border-piedra/15 bg-white p-6 shadow-sm sm:p-7">
          <LoginForm action={authenticate} />
        </div>

        <p className="mt-6 text-center text-xs text-piedra">
          Fundación Sur · Patagonia austral
        </p>
      </div>
    </div>
  );
}
