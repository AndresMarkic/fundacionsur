import { describe, expect, it } from "vitest";
import { isValidEmail, toCsv } from "@/lib/suscripcion";

describe("isValidEmail", () => {
  it("acepta un email bien formado", () => {
    expect(isValidEmail("a@b.com")).toBe(true);
    expect(isValidEmail("nombre.apellido@dominio.com.ar")).toBe(true);
    expect(isValidEmail("user+tag@example.io")).toBe(true);
  });

  it("recorta espacios antes de validar", () => {
    expect(isValidEmail("  a@b.com  ")).toBe(true);
  });

  it("rechaza un email sin dominio", () => {
    expect(isValidEmail("a@")).toBe(false);
  });

  it("rechaza un email con espacios internos", () => {
    expect(isValidEmail("a b@c.com")).toBe(false);
    expect(isValidEmail("a@c .com")).toBe(false);
  });

  it("rechaza dominio sin punto / TLD", () => {
    expect(isValidEmail("a@b")).toBe(false);
    expect(isValidEmail("a@b.")).toBe(false);
  });

  it("rechaza sin parte local o sin @", () => {
    expect(isValidEmail("@b.com")).toBe(false);
    expect(isValidEmail("ab.com")).toBe(false);
  });

  it("rechaza vacío/null/undefined", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("   ")).toBe(false);
    expect(isValidEmail(null)).toBe(false);
    expect(isValidEmail(undefined)).toBe(false);
  });
});

describe("toCsv", () => {
  it("une encabezado y filas con CRLF", () => {
    const csv = toCsv([
      ["Nombre", "Email"],
      ["Ana", "ana@b.com"],
    ]);
    expect(csv).toBe("Nombre,Email\r\nAna,ana@b.com");
  });

  it("envuelve en comillas y duplica comillas internas", () => {
    expect(toCsv([['di "hola"']])).toBe('"di ""hola"""');
  });

  it("envuelve campos que contienen comas", () => {
    expect(toCsv([["Apellido, Nombre"]])).toBe('"Apellido, Nombre"');
  });

  it("envuelve campos con saltos de línea", () => {
    expect(toCsv([["linea1\nlinea2"]])).toBe('"linea1\nlinea2"');
    expect(toCsv([["a\r\nb"]])).toBe('"a\r\nb"');
  });

  it("no envuelve campos simples", () => {
    expect(toCsv([["simple", "tambien"]])).toBe("simple,tambien");
  });

  it("trata null/undefined en celdas como cadena vacía", () => {
    // @ts-expect-error probamos robustez ante celdas faltantes
    expect(toCsv([["a", undefined]])).toBe("a,");
  });

  it("genera encabezado + varias filas", () => {
    const csv = toCsv([
      ["Nombre", "Email", "Fecha"],
      ["Ana", "ana@b.com", "1 de enero de 2026"],
      ["", "x@y.com", "2 de enero de 2026"],
    ]);
    expect(csv).toBe(
      "Nombre,Email,Fecha\r\nAna,ana@b.com,1 de enero de 2026\r\n,x@y.com,2 de enero de 2026",
    );
  });
});
