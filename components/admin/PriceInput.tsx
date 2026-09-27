"use client";

import { useState } from "react";

function formatCop(value: string | number | null | undefined) {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits ? Number(digits).toLocaleString("es-CO") : "";
}

export default function PriceInput({ name, label, defaultValue, required = false }: {
  name: string;
  label: string;
  defaultValue?: string | number | null;
  required?: boolean;
}) {
  const [display, setDisplay] = useState(formatCop(defaultValue));
  const raw = display.replace(/\D/g, "");
  return (
    <label className="admin-field">
      <span>{label}</span>
      <input className="admin-input" name={name} inputMode="numeric" value={display} required={required} placeholder="Ej: 65.900" onChange={(event) => setDisplay(formatCop(event.target.value))} />
      <input type="hidden" name={`${name}_raw`} value={raw} />
    </label>
  );
}
