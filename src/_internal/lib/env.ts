export function env(...names: string[]): string {
  for (const name of names) {
    const result = process.env[name];
    if (typeof result === "string") return result;
  }
  throw new Error(`Error: missing environment variable: ${names}`);
}
