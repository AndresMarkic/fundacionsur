import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../Button";

describe("Button", () => {
  it("renderiza la variante solid con fondo glaciar", () => {
    render(<Button>Suscribite</Button>);
    const el = screen.getByText("Suscribite");
    expect(el.className).toContain("bg-glaciar");
  });

  it("la variante link incluye la flecha →", () => {
    render(<Button variant="link">Leer más</Button>);
    const el = screen.getByText(/Leer más/);
    expect(el.textContent).toContain("→");
  });

  it("la variante outline tiene borde y no fondo glaciar", () => {
    render(<Button variant="outline">Conocé más</Button>);
    const el = screen.getByText("Conocé más");
    expect(el.className).toContain("border");
    expect(el.className).not.toContain("bg-glaciar");
  });

  it("renderiza como <a> cuando recibe href", () => {
    render(
      <Button href="/suscribite" variant="solid">
        Ir
      </Button>,
    );
    const el = screen.getByText("Ir");
    expect(el.tagName).toBe("A");
    expect(el).toHaveAttribute("href", "/suscribite");
  });

  it("renderiza como <button> cuando no recibe href", () => {
    render(<Button>Enviar</Button>);
    const el = screen.getByText("Enviar");
    expect(el.tagName).toBe("BUTTON");
  });

  it("propaga props nativas (type, onClick handler attrs)", () => {
    render(<Button type="submit">Guardar</Button>);
    const el = screen.getByText("Guardar");
    expect(el).toHaveAttribute("type", "submit");
  });
});
