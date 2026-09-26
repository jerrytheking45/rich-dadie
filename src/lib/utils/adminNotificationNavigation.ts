import type { Notification } from '@/src/lib/api/notification';

type NotificationWithResource = Notification & {
  ticketId?: string | null;
  ticket_id?: string | null;

  depositId?: string | null;
  deposit_id?: string | null;

  withdrawalId?: string | null;
  withdrawal_id?: string | null;

  resourceId?: string | null;
  resource_id?: string | null;

  resourceType?: string | null;
  resource_type?: string | null;

  metadata?: Record<string, unknown> | null;
};

const SUPPORT_NOTIFICATION_TYPES = new Set([
  'support_ticket_created',
  'ticket_created',
  'new_ticket',
]);

const DEPOSIT_NOTIFICATION_TYPES = new Set([
  'deposit_submitted',
  'deposit_confirmed',
  'deposit_credited',
  'deposit_failed',
  'deposit_rejected',
]);

const WITHDRAWAL_NOTIFICATION_TYPES = new Set([
  'withdrawal_requested',
  'withdrawal_processing',
  'withdrawal_broadcast',
  'withdrawal_confirming',
  'withdrawal_completed',
  'withdrawal_failed',
  'withdrawal_cancelled',
  'withdrawal_rejected',
]);

function getString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();

  return trimmed || null;
}

function getObject(
  value: unknown,
): Record<string, unknown> {
  if (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value)
  ) {
    return value as Record<string, unknown>;
  }

  return {};
}

function firstString(
  ...values: unknown[]
): string | null {
  for (const value of values) {
    const result = getString(value);

    if (result) {
      return result;
    }
  }

  return null;
}

export function getNotificationTarget(
  notification: Notification,
): string | null {
  const item =
    notification as NotificationWithResource;

  const type =
    getString(item.type)?.toLowerCase() ?? '';

  const data = getObject(item.data);
  const metadata = getObject(item.metadata);

  const ticketId = firstString(
    item.ticketId,
    item.ticket_id,

    data.ticketId,
    data.ticket_id,
    data.supportTicketId,
    data.support_ticket_id,

    metadata.ticketId,
    metadata.ticket_id,
    metadata.supportTicketId,
    metadata.support_ticket_id,
  );

  const depositId = firstString(
    item.depositId,
    item.deposit_id,

    data.depositId,
    data.deposit_id,

    metadata.depositId,
    metadata.deposit_id,
  );

  const withdrawalId = firstString(
    item.withdrawalId,
    item.withdrawal_id,

    data.withdrawalId,
    data.withdrawal_id,

    metadata.withdrawalId,
    metadata.withdrawal_id,
  );

  const resourceId = firstString(
    item.resourceId,
    item.resource_id,

    data.resourceId,
    data.resource_id,

    metadata.resourceId,
    metadata.resource_id,
  );

  const resourceType = (
    firstString(
      item.resourceType,
      item.resource_type,

      data.resourceType,
      data.resource_type,

      metadata.resourceType,
      metadata.resource_type,
    ) ?? ''
  ).toLowerCase();

  /*
   * SUPPORT
   *
   * Existing support notification behavior.
   */
  if (SUPPORT_NOTIFICATION_TYPES.has(type)) {
    if (ticketId) {
      return `/admin/support/tickets/${encodeURIComponent(
        ticketId,
      )}`;
    }

    if (
      resourceId &&
      (
        resourceType === 'ticket' ||
        resourceType === 'support_ticket' ||
        resourceType === 'support-ticket'
      )
    ) {
      return `/admin/support/tickets/${encodeURIComponent(
        resourceId,
      )}`;
    }

    return null;
  }

  /*
   * DEPOSITS
   */
  if (DEPOSIT_NOTIFICATION_TYPES.has(type)) {
    if (depositId) {
      return `/admin/deposits/${encodeURIComponent(
        depositId,
      )}`;
    }

    if (
      resourceId &&
      (
        resourceType === 'deposit' ||
        resourceType === 'account_deposit' ||
        resourceType === 'account-deposit'
      )
    ) {
      return `/admin/deposits/${encodeURIComponent(
        resourceId,
      )}`;
    }

    return null;
  }

  /*
   * WITHDRAWALS
   */
  if (WITHDRAWAL_NOTIFICATION_TYPES.has(type)) {
    if (withdrawalId) {
      return `/admin/withdrawals/${encodeURIComponent(
        withdrawalId,
      )}`;
    }

    if (
      resourceId &&
      resourceType === 'withdrawal'
    ) {
      return `/admin/withdrawals/${encodeURIComponent(
        resourceId,
      )}`;
    }

    return null;
  }

  /*
   * Other notification types intentionally
   * have no destination.
   */
  return null;
}