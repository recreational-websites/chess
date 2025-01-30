export function enumerate<T>(arr: T[]): [T, number][] {
  return arr.map((value, index) => [value, index]);
}
