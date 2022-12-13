export function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function isArray<T>(value: T | T[]): value is T[] {
  return Array.isArray(value);
}
