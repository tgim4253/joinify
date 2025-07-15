export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const isAdmin = (user: any) => user?.role === "admin";

export const generateUniqueKey = (base: string, keys: Set<string>): string => {
  let candidate = base;
  while (keys.has(candidate)) {
    candidate = `${candidate}1`;
  }
  return candidate;
}