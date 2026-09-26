import axios from 'axios';

interface BackendErrorResponse {
  error?: unknown;
  message?: unknown;
  detail?: unknown;
}

function extractBackendMessage(
  data: unknown,
): string | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const payload = data as BackendErrorResponse;

  if (typeof payload.error === 'string') {
    return payload.error;
  }

  if (typeof payload.message === 'string') {
    return payload.message;
  }

  if (typeof payload.detail === 'string') {
    return payload.detail;
  }

  return null;
}

function normalizeMessage(message: string): string {
  const normalized = message.toLowerCase();

  if (
    normalized.includes('insufficient') ||
    normalized.includes('insufficient balance') ||
    normalized.includes('balance too low')
  ) {
    return 'Insufficient available balance for this withdrawal.';
  }

  if (
    normalized.includes('invalid pin') ||
    normalized.includes('incorrect pin') ||
    normalized.includes('wrong pin') ||
    normalized.includes('pin is invalid')
  ) {
    return 'The wallet PIN is incorrect.';
  }

  if (
    normalized.includes('wallet') &&
    (
      normalized.includes('not found') ||
      normalized.includes('inactive') ||
      normalized.includes('unavailable') ||
      normalized.includes('bound')
    )
  ) {
    return 'Your withdrawal wallet is unavailable. Please check your bound wallet and try again.';
  }

  if (
    normalized.includes('idempotency') ||
    normalized.includes('duplicate withdrawal') ||
    normalized.includes('already processed')
  ) {
    return 'This withdrawal request has already been submitted.';
  }

  if (
    normalized.includes('amount') &&
    (
      normalized.includes('invalid') ||
      normalized.includes('minimum') ||
      normalized.includes('maximum')
    )
  ) {
    return message;
  }

  if (
    normalized.includes('network') &&
    (
      normalized.includes('unsupported') ||
      normalized.includes('inactive')
    )
  ) {
    return 'The selected withdrawal network is currently unavailable.';
  }

  if (
    normalized.includes('withdrawal') &&
    (
      normalized.includes('disabled') ||
      normalized.includes('suspended') ||
      normalized.includes('not allowed')
    )
  ) {
    return 'Withdrawals are currently unavailable for your account.';
  }

  return message;
}

export function getWithdrawalErrorMessage(
  error: unknown,
): string {
  if (axios.isAxiosError(error)) {
    const backendMessage =
      extractBackendMessage(error.response?.data);

    if (backendMessage) {
      return normalizeMessage(backendMessage);
    }

    if (error.response) {
      switch (error.response.status) {
        case 400:
          return 'The withdrawal request is invalid. Please check your details and try again.';

        case 401:
          return 'Your session has expired. Please sign in again.';

        case 403:
          return 'You are not allowed to make this withdrawal.';

        case 404:
          return 'The withdrawal service or wallet could not be found.';

        case 409:
          return 'This withdrawal request has already been submitted.';

        case 422:
          return 'The withdrawal details could not be accepted.';

        case 429:
          return 'Too many withdrawal attempts. Please wait and try again.';

        case 500:
        case 502:
        case 503:
        case 504:
          return 'The withdrawal service is temporarily unavailable. Please try again later.';

        default:
          return 'The withdrawal request could not be completed.';
      }
    }

    if (error.request) {
      return 'Unable to connect to the withdrawal service. Check your connection and try again.';
    }
  }

  if (error instanceof Error) {
    return normalizeMessage(error.message);
  }

  return 'Something went wrong while processing the withdrawal.';
}