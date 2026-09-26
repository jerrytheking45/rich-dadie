
//src/lib/utils/uniquekey.ts

/**
 * Returns a unique React key.
 *
 * If the provided ID is valid and not the zero UUID,
 * it is used directly. Otherwise, a fallback using the
 * index ensures uniqueness across the list.
 */
export function getUniqueKey(
  id: string | undefined,
  index: number,
): string {
  const zeroUUID = '00000000-0000-0000-0000-000000000000';

  if (id && id !== zeroUUID) {
    return id;
  }

  return `fallback-${index}`;
}

