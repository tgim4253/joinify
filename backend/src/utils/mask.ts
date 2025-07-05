export function maskString(
  value: string,
  maskFrom: number = 0,
  maskTo: number = 0
): string {
  if (!value) return value;
  const len = value.length;
  const start = Math.min(maskFrom - 1, len);
  const end = Math.min(len, Math.max(maskTo, start));
  const masked = "*".repeat(end - start);
  
  return value.slice(0, start) + masked + value.slice(end);
}