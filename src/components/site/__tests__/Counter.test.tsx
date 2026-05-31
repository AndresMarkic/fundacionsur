import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Counter } from "@/components/site/Counter";

// Mockeamos framer-motion: el contador entra en viewport (useInView=true) y
// el usuario prefiere movimiento reducido (useReducedMotion=true), de modo que
// el componente muestra el valor FINAL sin animar — estado determinista.
vi.mock("framer-motion", () => ({
  useInView: () => true,
  useReducedMotion: () => true,
  animate: () => ({ stop: () => {} }),
}));

describe("Counter", () => {
  it("muestra el valor final, el sufijo y la etiqueta (sin animar)", () => {
    render(<Counter value={120} label="Voluntarios" suffix="+" />);

    expect(screen.getByText("120")).toBeInTheDocument();
    expect(screen.getByText("+")).toBeInTheDocument();
    expect(screen.getByText("Voluntarios")).toBeInTheDocument();
  });

  it("funciona sin sufijo", () => {
    render(<Counter value={40} label="Proyectos" />);

    expect(screen.getByText("40")).toBeInTheDocument();
    expect(screen.getByText("Proyectos")).toBeInTheDocument();
  });
});
