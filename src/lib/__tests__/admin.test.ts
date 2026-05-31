import { describe, expect, it } from "vitest";
import {
  isUploadPath,
  isValidUrl,
  uniqueSlug,
  validateNoticiaInput,
} from "@/lib/admin";

describe("uniqueSlug", () => {
  it("devuelve el slug base si no existe", () => {
    expect(uniqueSlug("Hola Mundo", () => false)).toBe("hola-mundo");
  });

  it("agrega -2 si el base ya existe", () => {
    const taken = new Set(["hola-mundo"]);
    expect(uniqueSlug("Hola Mundo", (s) => taken.has(s))).toBe("hola-mundo-2");
  });

  it("incrementa el sufijo hasta encontrar uno libre (-2, -3…)", () => {
    const taken = new Set(["nota", "nota-2", "nota-3"]);
    expect(uniqueSlug("Nota", (s) => taken.has(s))).toBe("nota-4");
  });

  it("normaliza acentos antes de comparar", () => {
    expect(uniqueSlug("Áreas del Sur", () => false)).toBe("areas-del-sur");
  });

  it("usa 'item' como base cuando el texto no produce slug", () => {
    expect(uniqueSlug("---!!!---", () => false)).toBe("item");
  });

  it("ignora el propio registro vía existsFn (edición sin colisión consigo)", () => {
    // existsFn excluye el slug propio => no hay colisión, mantiene base.
    const ownSlug = "mi-nota";
    const existing = new Set(["mi-nota", "otra"]);
    const existsFn = (s: string) => s !== ownSlug && existing.has(s);
    expect(uniqueSlug("Mi Nota", existsFn)).toBe("mi-nota");
  });
});

describe("validateNoticiaInput", () => {
  it("acepta title y body presentes", () => {
    expect(
      validateNoticiaInput({ title: "Hola", body: "Cuerpo" }),
    ).toEqual({ ok: true });
  });

  it("rechaza title vacío", () => {
    const r = validateNoticiaInput({ title: "  ", body: "x" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.title).toBeTruthy();
  });

  it("rechaza body vacío", () => {
    const r = validateNoticiaInput({ title: "x", body: "" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.body).toBeTruthy();
  });

  it("reporta ambos errores si faltan los dos", () => {
    const r = validateNoticiaInput({ title: null, body: null });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.title).toBeTruthy();
      expect(r.errors.body).toBeTruthy();
    }
  });
});

describe("isValidUrl", () => {
  it("acepta http y https", () => {
    expect(isValidUrl("http://example.com")).toBe(true);
    expect(isValidUrl("https://example.com/path?q=1")).toBe(true);
  });

  it("recorta espacios antes de validar", () => {
    expect(isValidUrl("  https://example.com  ")).toBe(true);
  });

  it("rechaza vacío/null/undefined", () => {
    expect(isValidUrl("")).toBe(false);
    expect(isValidUrl("   ")).toBe(false);
    expect(isValidUrl(null)).toBe(false);
    expect(isValidUrl(undefined)).toBe(false);
  });

  it("rechaza protocolos no http(s)", () => {
    expect(isValidUrl("ftp://example.com")).toBe(false);
    expect(isValidUrl("javascript:alert(1)")).toBe(false);
    expect(isValidUrl("mailto:a@b.com")).toBe(false);
  });

  it("rechaza cadenas que no son URL", () => {
    expect(isValidUrl("no soy una url")).toBe(false);
    expect(isValidUrl("example.com")).toBe(false);
  });
});

describe("isUploadPath", () => {
  it("acepta un path de upload local", () => {
    expect(isUploadPath("/uploads/x.png")).toBe(true);
  });

  it("recorta espacios antes de validar", () => {
    expect(isUploadPath("  /uploads/x.png  ")).toBe(true);
  });

  it("acepta vacío/null/undefined cuando no es required", () => {
    expect(isUploadPath("")).toBe(true);
    expect(isUploadPath("   ")).toBe(true);
    expect(isUploadPath(null)).toBe(true);
    expect(isUploadPath(undefined)).toBe(true);
  });

  it("rechaza vacío cuando es required", () => {
    expect(isUploadPath("", { required: true })).toBe(false);
    expect(isUploadPath(null, { required: true })).toBe(false);
    expect(isUploadPath(undefined, { required: true })).toBe(false);
  });

  it("acepta un path de upload local cuando es required", () => {
    expect(isUploadPath("/uploads/x.png", { required: true })).toBe(true);
  });

  it("rechaza URLs externas http(s)", () => {
    expect(isUploadPath("http://evil/x")).toBe(false);
    expect(isUploadPath("https://evil/x")).toBe(false);
  });

  it("rechaza intentos de path traversal", () => {
    expect(isUploadPath("/uploads/../secret")).toBe(false);
  });

  it("rechaza paths sin slash inicial", () => {
    expect(isUploadPath("uploads/x")).toBe(false);
  });
});
