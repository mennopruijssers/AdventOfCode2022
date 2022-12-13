export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

export function isArray<TValue>(value: TValue | TValue[]): value is TValue[] {
  return Array.isArray(value);
}
