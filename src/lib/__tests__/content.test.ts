import { describe, it, expect } from "vitest";
import {
  buildMenuTree,
  collectDescendantIds,
  matchNoticia,
  parseBlock,
  siblingSwap,
  type MenuRow,
} from "@/lib/content";

describe("buildMenuTree", () => {
  it("anida los hijos por parentId bajo su padre", () => {
    const rows: MenuRow[] = [
      { id: "a", label: "Quiénes somos", href: "/quienes-somos", parentId: null, order: 0, isCTA: false },
      { id: "b", label: "Misión", href: "/quienes-somos#mision", parentId: "a", order: 0, isCTA: false },
      { id: "c", label: "Valores", href: "/quienes-somos#valores", parentId: "a", order: 1, isCTA: false },
    ];

    const tree = buildMenuTree(rows);

    expect(tree).toHaveLength(1);
    expect(tree[0].label).toBe("Quiénes somos");
    expect(tree[0].children).toHaveLength(2);
    expect(tree[0].children?.map((c) => c.label)).toEqual(["Misión", "Valores"]);
  });

  it("respeta el order tanto en raíz como en hijos", () => {
    const rows: MenuRow[] = [
      { id: "root2", label: "Segundo", href: "/2", parentId: null, order: 1, isCTA: false },
      { id: "root1", label: "Primero", href: "/1", parentId: null, order: 0, isCTA: false },
      { id: "child2", label: "Hijo B", href: "/1/b", parentId: "root1", order: 1, isCTA: false },
      { id: "child1", label: "Hijo A", href: "/1/a", parentId: "root1", order: 0, isCTA: false },
    ];

    const tree = buildMenuTree(rows);

    expect(tree.map((i) => i.label)).toEqual(["Primero", "Segundo"]);
    expect(tree[0].children?.map((c) => c.label)).toEqual(["Hijo A", "Hijo B"]);
  });

  it("mapea isCTA y no agrega children cuando el ítem no tiene hijos", () => {
    const rows: MenuRow[] = [
      { id: "cta", label: "Suscribite", href: "/#suscribite", parentId: null, order: 0, isCTA: true },
    ];

    const tree = buildMenuTree(rows);

    expect(tree[0].isCTA).toBe(true);
    expect(tree[0].children).toBeUndefined();
  });

  it("ignora hijos cuyo parentId no existe (huérfanos)", () => {
    const rows: MenuRow[] = [
      { id: "a", label: "Raíz", href: "/", parentId: null, order: 0, isCTA: false },
      { id: "x", label: "Huérfano", href: "/x", parentId: "no-existe", order: 0, isCTA: false },
    ];

    const tree = buildMenuTree(rows);

    expect(tree.map((i) => i.label)).toEqual(["Raíz"]);
  });
});

describe("siblingSwap", () => {
  type Row = Pick<MenuRow, "id" | "parentId" | "order">;
  const roots: Row[] = [
    { id: "a", parentId: null, order: 0 },
    { id: "b", parentId: null, order: 1 },
    { id: "c", parentId: null, order: 2 },
  ];

  it("intercambia order con el hermano anterior ('up')", () => {
    expect(siblingSwap(roots, "b", "up")).toEqual([
      { id: "b", order: 0 },
      { id: "a", order: 1 },
    ]);
  });

  it("intercambia order con el hermano siguiente ('down')", () => {
    expect(siblingSwap(roots, "b", "down")).toEqual([
      { id: "b", order: 2 },
      { id: "c", order: 1 },
    ]);
  });

  it("devuelve null en los bordes (primer 'up', último 'down')", () => {
    expect(siblingSwap(roots, "a", "up")).toBeNull();
    expect(siblingSwap(roots, "c", "down")).toBeNull();
  });

  it("devuelve null si el ítem no existe", () => {
    expect(siblingSwap(roots, "z", "up")).toBeNull();
  });

  it("solo considera hermanos del mismo parentId", () => {
    const mixed: Row[] = [
      { id: "root", parentId: null, order: 0 },
      { id: "h1", parentId: "root", order: 0 },
      { id: "h2", parentId: "root", order: 1 },
      { id: "otro", parentId: null, order: 1 },
    ];
    // h1 'down' intercambia con h2 (su hermano), no con un root.
    expect(siblingSwap(mixed, "h1", "down")).toEqual([
      { id: "h1", order: 1 },
      { id: "h2", order: 0 },
    ]);
    // h2 'down' no tiene hermano siguiente.
    expect(siblingSwap(mixed, "h2", "down")).toBeNull();
  });

  it("tolera order con huecos usando la posición ordenada", () => {
    const gappy: Row[] = [
      { id: "x", parentId: null, order: 5 },
      { id: "y", parentId: null, order: 20 },
    ];
    expect(siblingSwap(gappy, "x", "down")).toEqual([
      { id: "x", order: 20 },
      { id: "y", order: 5 },
    ]);
  });
});

describe("collectDescendantIds", () => {
  type Row = Pick<MenuRow, "id" | "parentId">;
  const items: Row[] = [
    { id: "a", parentId: null },
    { id: "b", parentId: "a" },
    { id: "c", parentId: "b" },
    { id: "d", parentId: "a" },
    { id: "e", parentId: null },
  ];

  it("recolecta hijos y nietos, sin incluirse a sí mismo", () => {
    const ids = collectDescendantIds(items, "a");
    expect([...ids].sort()).toEqual(["b", "c", "d"]);
    expect(ids.has("a")).toBe(false);
  });

  it("devuelve set vacío para una hoja", () => {
    expect(collectDescendantIds(items, "c").size).toBe(0);
  });

  it("devuelve set vacío para un id inexistente", () => {
    expect(collectDescendantIds(items, "zzz").size).toBe(0);
  });

  it("no entra en bucle infinito ante un ciclo en datos", () => {
    const cyclic: Row[] = [
      { id: "p", parentId: "q" },
      { id: "q", parentId: "p" },
    ];
    const ids = collectDescendantIds(cyclic, "p");
    expect(ids.has("q")).toBe(true);
    expect(ids.has("p")).toBe(true);
  });
});

describe("parseBlock", () => {
  it("parsea dataJson a objeto y conserva el resto del bloque", () => {
    const block = { id: "1", type: "hero", order: 0, visible: true, dataJson: '{"title":"Hola","limit":6}' };

    const parsed = parseBlock(block);

    expect(parsed.type).toBe("hero");
    expect(parsed.order).toBe(0);
    expect(parsed.data).toEqual({ title: "Hola", limit: 6 });
  });

  it("tolera JSON inválido devolviendo un objeto vacío", () => {
    const block = { id: "2", type: "noticias", order: 1, visible: true, dataJson: "{no-es-json" };

    const parsed = parseBlock(block);

    expect(parsed.data).toEqual({});
  });

  it("tolera dataJson vacío o nulo devolviendo objeto vacío", () => {
    const parsed = parseBlock({ id: "3", type: "x", order: 2, visible: true, dataJson: "" });
    expect(parsed.data).toEqual({});
  });
});

describe("matchNoticia", () => {
  const noticia = {
    title: "Programa de Voluntariado 2026",
    excerpt: "Convocamos a vecinos de Santa Cruz a sumarse a los equipos.",
    body: "Durante el año los voluntarios participarán de actividades de **acompañamiento social**.",
  };

  it("coincide por título sin distinguir mayúsculas/acentos del término", () => {
    expect(matchNoticia(noticia, "voluntariado")).toBe(true);
    expect(matchNoticia(noticia, "VOLUNTARIADO")).toBe(true);
    expect(matchNoticia(noticia, "  Programa ")).toBe(true);
  });

  it("coincide por excerpt y por body", () => {
    expect(matchNoticia(noticia, "santa cruz")).toBe(true);
    expect(matchNoticia(noticia, "acompañamiento")).toBe(true);
  });

  it("no coincide cuando el término no aparece", () => {
    expect(matchNoticia(noticia, "presupuesto")).toBe(false);
  });

  it("una consulta vacía o de solo espacios no coincide", () => {
    expect(matchNoticia(noticia, "")).toBe(false);
    expect(matchNoticia(noticia, "   ")).toBe(false);
  });

  it("tolera campos nulos sin lanzar", () => {
    const sinCampos = { title: "Hola mundo", excerpt: null, body: null };
    expect(matchNoticia(sinCampos, "mundo")).toBe(true);
    expect(matchNoticia(sinCampos, "ausente")).toBe(false);
  });
});
