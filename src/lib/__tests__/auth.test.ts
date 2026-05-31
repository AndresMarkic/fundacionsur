import { describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";
import { validateAdmin, verifyPassword } from "@/lib/auth";

describe("verifyPassword", () => {
  it("devuelve true cuando el password coincide con el hash", async () => {
    const hash = await bcrypt.hash("cambiar123", 10);
    await expect(verifyPassword("cambiar123", hash)).resolves.toBe(true);
  });

  it("devuelve false cuando el password no coincide", async () => {
    const hash = await bcrypt.hash("cambiar123", 10);
    await expect(verifyPassword("otra-cosa", hash)).resolves.toBe(false);
  });

  it("devuelve false (sin lanzar) con un hash inválido", async () => {
    await expect(verifyPassword("cambiar123", "")).resolves.toBe(false);
    await expect(verifyPassword("cambiar123", "no-es-un-hash")).resolves.toBe(
      false,
    );
  });
});

describe("validateAdmin", () => {
  it("devuelve el admin (sin passwordHash) con credenciales correctas", async () => {
    const passwordHash = await bcrypt.hash("cambiar123", 10);
    const lookup = async (email: string) =>
      email === "prensamasgestion@gmail.com"
        ? {
            id: "admin1",
            email,
            name: "Administración",
            passwordHash,
          }
        : null;

    const result = await validateAdmin(
      "prensamasgestion@gmail.com",
      "cambiar123",
      lookup,
    );
    expect(result).toEqual({
      id: "admin1",
      email: "prensamasgestion@gmail.com",
      name: "Administración",
    });
    // No debe filtrar el hash hacia la sesión.
    expect(result && "passwordHash" in result).toBe(false);
  });

  it("devuelve null con password incorrecto", async () => {
    const passwordHash = await bcrypt.hash("cambiar123", 10);
    const lookup = async () => ({
      id: "admin1",
      email: "prensamasgestion@gmail.com",
      name: null,
      passwordHash,
    });
    await expect(
      validateAdmin("prensamasgestion@gmail.com", "incorrecta", lookup),
    ).resolves.toBeNull();
  });

  it("devuelve null cuando el usuario no existe", async () => {
    const lookup = async () => null;
    await expect(
      validateAdmin("nadie@example.com", "cambiar123", lookup),
    ).resolves.toBeNull();
  });

  it("devuelve null con email o password vacíos (sin pegarle al lookup)", async () => {
    let called = false;
    const lookup = async () => {
      called = true;
      return null;
    };
    await expect(validateAdmin("", "x", lookup)).resolves.toBeNull();
    await expect(validateAdmin("x@x.com", "", lookup)).resolves.toBeNull();
    expect(called).toBe(false);
  });
});
