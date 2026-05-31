"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

export type CounterProps = {
  /** Valor objetivo al que asciende el contador. */
  value: number;
  /** Etiqueta descriptiva debajo del número. */
  label: string;
  /** Sufijo opcional pegado al número (p. ej. "+", "%"). */
  suffix?: string;
  /** Duración de la animación en segundos. */
  duration?: number;
};

/**
 * Contador animado 0 → valor que se dispara al entrar en viewport.
 * Respeta `prefers-reduced-motion`: muestra el valor final sin animar.
 */
export function Counter({ value, label, suffix = "", duration = 1.8 }: CounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const prefersReduced = useReducedMotion();

  // Estado inicial: si se reduce el movimiento, ya mostramos el valor final.
  const [display, setDisplay] = useState(prefersReduced ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (prefersReduced) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, prefersReduced, value, duration]);

  return (
    <div ref={ref} className="group/counter text-center">
      <div className="relative inline-flex items-baseline justify-center">
        {/* Marca austral: punto-estrella sobre el número */}
        <span
          aria-hidden="true"
          className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs text-celeste/60 transition-opacity duration-500 group-hover/counter:opacity-100"
        >
          ✦
        </span>
        <span className="font-display text-5xl font-semibold tabular-nums text-austral sm:text-6xl">
          {display.toLocaleString("es-AR")}
        </span>
        {suffix && (
          <span className="font-display text-3xl font-semibold text-glaciar sm:text-4xl">
            {suffix}
          </span>
        )}
      </div>
      <p className="mx-auto mt-3 max-w-[12rem] text-sm leading-snug text-piedra">
        {label}
      </p>
    </div>
  );
}

export default Counter;
