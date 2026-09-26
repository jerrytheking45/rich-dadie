// src/lib/support/supportUnreadEvents.ts

export const SUPPORT_UNREAD_CHANGED_EVENT =
  'investment:support-unread-changed';

export function notifySupportUnreadChanged(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(
    new Event(SUPPORT_UNREAD_CHANGED_EVENT),
  );
}