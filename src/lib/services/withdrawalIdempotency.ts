
// src/lib/services/withdrawalIdempotency.ts

const IDEMPOTENCY_KEY_PREFIX = 'withdrawal';

export function generateWithdrawalIdempotencyKey(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return `${IDEMPOTENCY_KEY_PREFIX}_${crypto.randomUUID()}`;
  }

  // Fallback for environments where randomUUID is unavailable.
  return `${IDEMPOTENCY_KEY_PREFIX}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2)}_${Math.random().toString(36).slice(2)}`;
}