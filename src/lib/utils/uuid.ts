
//src/lib/utils/uuid.ts

export const ZERO_UUID = '00000000-0000-0000-0000-000000000000';

export function isZeroUUID(id: string | undefined): boolean {
  return id === ZERO_UUID;
}