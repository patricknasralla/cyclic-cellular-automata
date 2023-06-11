/**
 * Clamps the given value between the given minimum and maximum values.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Returns the given value wrapped around the given minimum and maximum values.
 */
export function wrapValue(value: number, max: number, min = 0): number {
  const range = max - min;
  return ((value - min) % range + range) % range + min;
}
