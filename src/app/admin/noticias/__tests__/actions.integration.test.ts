/**
 * Test de integración de las server actions de Noticias contra la BD real
 * (dev.db vía el cliente prisma del proyecto). Mockea `auth`, `next/cache` y
 * `next/navigation` para poder invocar las actions fuera del runtime de Next.
 *
 * Verifica: guard de sesión, validación, unicidad de slug (-2), create/update/
 * delete y las llamadas a revalidatePath. Limpia sus propios registros.
 */
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

// --- Mocks de infraestructura de Next ---
const sessionRef = { value: null as null | { user: { id: string } } };
vi.mock("@/auth", () => ({
  auth: vi.fn(async () => sessionRef.value),
}));

const revalidated: string[] = [];
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn((p: string) => {
    revalidated.push(p);
  }),
}));

class RedirectError extends Error {
  constructor(public to: string) {
    super("NEXT_REDIRECT");
  }
}
vi.mock("next/navigation", () => ({
  redirect: vi.fn((to: string) => {
    throw new RedirectError(to);
  }),
}));

import { prisma } from "@/lib/prisma";
import {
  createNoticia,
  updateNoticia,
  deleteNoticia,
} from "../actions";

const PREFIX = "vitest-noticia-";

function fd(obj: Record<string, string>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(obj)) f.append(k, v);
  return f;
}

async function expectRedirect(promise: Promise<unknown>): Promise<string> {
  try {
    await promise;
    throw new Error("Se esperaba un redirect y no ocurrió");
  } catch (e) {
    if (e instanceof RedirectError) return e.to;
    throw e;
  }
}

beforeEach(() => {
  revalidated.length = 0;
  sessionRef.value = null;
});

afterAll(async () => {
  await prisma.noticia.deleteMany({
    where: { title: { startsWith: PREFIX } },
  });
  await prisma.$disconnect();
});

describe("server actions de Noticias (integración)", () => {
  it("rechaza create sin sesión", async () => {
    await expect(
      createNoticia({}, fd({ title: `${PREFIX}a`, body: "x" })),
    ).rejects.toThrow("No autorizado");
  });

  it("devuelve errores de validación sin crear", async () => {
    sessionRef.value = { user: { id: "admin" } };
    const res = await createNoticia({}, fd({ title: "", body: "" }));
    expect(res.errors?.title).toBeTruthy();
    expect(res.errors?.body).toBeTruthy();
  });

  it("crea, edita y borra una noticia; slug se hace único", async () => {
    sessionRef.value = { user: { id: "admin" } };

    // create #1
    const to1 = await expectRedirect(
      createNoticia(
        {},
        fd({
          title: `${PREFIX}Hola`,
          slug: "",
          body: "Cuerpo md",
          status: "published",
          date: "2026-05-20",
        }),
      ),
    );
    expect(to1).toBe("/admin/noticias");
    expect(revalidated).toContain("/");
    expect(revalidated).toContain("/noticias");

    const created = await prisma.noticia.findFirst({
      where: { title: `${PREFIX}Hola` },
    });
    expect(created).toBeTruthy();
    expect(created!.slug.startsWith(`${PREFIX.toLowerCase()}hola`)).toBe(true);
    expect(created!.status).toBe("published");

    // create #2 con mismo título => slug debe colisionar y sufijarse
    await expectRedirect(
      createNoticia({}, fd({ title: `${PREFIX}Hola`, body: "Otro" })),
    );
    const both = await prisma.noticia.findMany({
      where: { title: `${PREFIX}Hola` },
      orderBy: { createdAt: "asc" },
    });
    expect(both).toHaveLength(2);
    expect(new Set(both.map((n) => n.slug)).size).toBe(2);
    expect(both.some((n) => /-2$/.test(n.slug))).toBe(true);

    // update #1
    await expectRedirect(
      updateNoticia(
        created!.id,
        {},
        fd({
          title: `${PREFIX}Editada`,
          slug: created!.slug,
          body: "Cuerpo editado",
          status: "draft",
        }),
      ),
    );
    const updated = await prisma.noticia.findUnique({
      where: { id: created!.id },
    });
    expect(updated!.title).toBe(`${PREFIX}Editada`);
    expect(updated!.status).toBe("draft");

    // delete ambas
    for (const n of both) {
      await deleteNoticia(n.id);
    }
    const remaining = await prisma.noticia.count({
      where: { title: { startsWith: PREFIX } },
    });
    expect(remaining).toBe(0);
  });
});
