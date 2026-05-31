import { describe, it, expect } from "vitest";
import { formatDate } from "@/lib/format";

describe("formatDate", () => {
  it("formatea una fecha en es-AR con día, mes en palabra y año", () => {
    expect(formatDate("2026-05-20T12:00:00Z")).toBe("20 de mayo de 2026");
  });

  it("acepta un objeto Date", () => {
    expect(formatDate(new Date("2026-01-01T12:00:00Z"))).toBe(
      "1 de enero de 2026",
    );
  });

  it("devuelve cadena vacía para fechas inválidas", () => {
    expect(formatDate("no-es-fecha")).toBe("");
  });
});
