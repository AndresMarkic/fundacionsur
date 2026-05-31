import { describe, it, expect } from "vitest";
import { buildMenuTree, parseBlock, type MenuRow } from "@/lib/content";

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
