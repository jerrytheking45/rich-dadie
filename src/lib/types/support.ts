
import type { AxiosError } from 'axios';

/* -------------------------------------------------------------------------- */
/* Enums                                                                      */
/* -------------------------------------------------------------------------- */

export type SupportTicketCategory =
  | 'ACCOUNT'
  | 'DEPOSIT'
  | 'INVESTMENT'
  | 'WITHDRAWAL'
  | 'WALLET'
  | 'PAYMENT'
  | 'VERIFICATION'
  | 'SECURITY'
  | 'OTHER';

export type SupportTicketStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_USER'
  | 'RESOLVED'
  | 'CLOSED';

export type SupportTicketPriority =
  | 'LOW'
  | 'NORMAL'
  | 'HIGH'
  | 'URGENT';

export type SupportTicketEventType =
  | 'CREATED'
  | 'MESSAGE_ADDED'
  | 'STATUS_CHANGED'
  | 'PRIORITY_CHANGED'
  | 'ASSIGNED'
  | 'UNASSIGNED'
  | 'REOPENED'
  | 'RESOLVED'
  | 'CLOSED'
  | 'ATTACHMENT_ADDED';

/* -------------------------------------------------------------------------- */
/* Domain types                                                               */
/* -------------------------------------------------------------------------- */

export interface SupportTicket {
  id: string;
  ticket_number: number;
  user_id: string;
  subject: string;
  category: SupportTicketCategory;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  assigned_to?: string | null;
  resolved_at?: string | null;
  closed_at?: string | null;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  is_internal: boolean;
  seen: boolean;
  seen_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupportAttachment {
  id: string;
  ticket_id: string;
  message_id?: string | null;
  uploaded_by: string;
  file_name: string;
  content_type: string;
  file_size: number;
  storage_key: string;
  created_at: string;
}

export interface SupportTicketEvent {
  id: string;
  ticket_id: string;
  actor_id: string;
  event_type: SupportTicketEventType;
  data?: Record<string, unknown> | null;
  created_at: string;
}

/* -------------------------------------------------------------------------- */
/* Request types                                                              */
/* -------------------------------------------------------------------------- */

export interface CreateSupportTicketRequest {
  subject: string;
  category: SupportTicketCategory;
  message: string;
}

export interface AddSupportMessageRequest {
  message: string;
}

/* -------------------------------------------------------------------------- */
/* Response types                                                             */
/* -------------------------------------------------------------------------- */

export interface CreateSupportTicketResponse {
  message: string;
  ticket: SupportTicket;
}

export interface ListSupportTicketsResponse {
  tickets: SupportTicket[];
  pagination: {
    limit: number;
    offset: number;
  };
}

export interface GetSupportTicketResponse {
  ticket: SupportTicket;
}

export interface GetSupportMessagesResponse {
  messages: SupportMessage[];
}

export interface AddSupportMessageResponse {
  message: SupportMessage;
}

export interface GetSupportAttachmentsResponse {
  attachments: SupportAttachment[];
}

export interface UploadSupportAttachmentResponse {
  message: string;
  attachment: SupportAttachment;
}

export interface GetSupportEventsResponse {
  events: SupportTicketEvent[];
}

/* -------------------------------------------------------------------------- */
/* API error                                                                  */
/* -------------------------------------------------------------------------- */

export interface SupportApiError {
  error?: string;
}

export type SupportRequestError = AxiosError<SupportApiError>;

export interface SupportUnreadCountResponse {
  unread_count: number;
}

export interface MarkSupportMessagesSeenResponse {
  message: string;
}

export interface UploadSupportAttachmentResponse {
  message: string;
  attachment: SupportAttachment;
}