export function money(value: number) {
  return `${Math.round(value || 0).toLocaleString("ru-RU")} so'm`;
}

export function quantity(value: number) {
  const rounded = Math.round(value * 1000) / 1000;
  return `${rounded}`;
}

export function parseQuantity(value: string | number) {
  const normalized = String(value ?? "").replace(",", ".").trim();
  const numeric = Number(normalized);
  if (!Number.isFinite(numeric) || numeric <= 0) return 1;
  return numeric;
}
