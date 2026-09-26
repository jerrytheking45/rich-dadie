
// src/lib/api/utils.ts
export function toCamelCase<T>(obj: unknown): T {
  if (Array.isArray(obj)) {
    return obj.map((v) => toCamelCase(v)) as unknown as T;
  }
  if (obj !== null && typeof obj === 'object') {
    const newObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      newObj[camelKey] = toCamelCase(value);
    }
    return newObj as T;
  }
  return obj as T;
}