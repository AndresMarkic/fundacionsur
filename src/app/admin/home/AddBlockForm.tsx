"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { BLOCK_TYPES, BLOCK_LABELS, type BlockType } from "@/lib/blocks";
import { addBlock } from "./actions";

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-full bg-glaciar px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-austral disabled:opacity-60"
    >
      <span aria-hidden="true">+</span>
      {pending ? "Agregando…" : "Agregar bloque"}
    </button>
  );
}

/** Selector de tipo + botón para crear un bloque nuevo al final del orden. */
export function AddBlockForm() {
  const [type, setType] = useState<BlockType>(BLOCK_TYPES[0]);

  return (
    <form
      action={() => addBlock(type)}
      className="flex flex-wrap items-center gap-3"
    >
      <select
        aria-label="Tipo de bloque"
        value={type}
        onChange={(e) => setType(e.target.value as BlockType)}
        className="rounded-lg border border-piedra/30 bg-white px-3 py-2.5 text-sm text-austral outline-none focus:border-glaciar focus:ring-2 focus:ring-glaciar/20"
      >
        {BLOCK_TYPES.map((t) => (
          <option key={t} value={t}>
            {BLOCK_LABELS[t]}
          </option>
        ))}
      </select>
      <AddButton />
    </form>
  );
}
