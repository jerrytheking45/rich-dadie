
// src/lib/api/adminSupport.ts

import api from './api';

import type {
  AddSupportMessageRequest,
  AddSupportMessageResponse,
  GetSupportAttachmentsResponse,
  GetSupportEventsResponse,
  GetSupportMessagesResponse,
  GetSupportTicketResponse,
  ListSupportTicketsResponse,
  SupportTicketPriority,
  SupportTicketStatus,
  UploadSupportAttachmentResponse,
} from '@/src/lib/types/support';

const ADMIN_SUPPORT_BASE = '/admin/support';

export interface DeleteSupportTicketResponse {
  message: string;
}

export interface UpdateSupportTicketStatusResponse {
  message: string;
}

export interface UpdateSupportTicketPriorityResponse {
  message: string;
}

export interface AssignSupportTicketRequest {
  assigned_to: string | null;
}

export interface AssignSupportTicketResponse {
  message: string;
}

export interface AddStaffSupportMessageRequest
  extends AddSupportMessageRequest {
  is_internal: boolean;
}

export interface AdminSupportListParams {
  limit?: number;
  offset?: number;
}

export interface AdminSupportUnreadCountResponse {
  unread_count: number;
}

export interface MarkAdminSupportMessagesSeenResponse {
  message: string;
}

export const adminSupportApi = {
  /* ------------------------------------------------------------------------ */
  /* Tickets                                                                  */
  /* ------------------------------------------------------------------------ */

  async listTickets(
    limit = 20,
    offset = 0,
  ): Promise<ListSupportTicketsResponse> {
    const response =
      await api.get<ListSupportTicketsResponse>(
        `${ADMIN_SUPPORT_BASE}/tickets`,
        {
          params: {
            limit,
            offset,
          },
        },
      );

    return response.data;
  }, 

  async getTicket(
    ticketId: string,
  ): Promise<GetSupportTicketResponse> {
    const response =
      await api.get<GetSupportTicketResponse>(
        `${ADMIN_SUPPORT_BASE}/tickets/${encodeURIComponent(
          ticketId,
        )}`,
      );

    return response.data;
  },

  /* ------------------------------------------------------------------------ */
  /* Messages                                                                 */
  /* ------------------------------------------------------------------------ */

  async getMessages(
    ticketId: string,
  ): Promise<GetSupportMessagesResponse> {
    const response =
      await api.get<GetSupportMessagesResponse>(
        `${ADMIN_SUPPORT_BASE}/tickets/${encodeURIComponent(
          ticketId,
        )}/messages`,
      );

    return response.data;
  },

  async addMessage(
    ticketId: string,
    data: AddStaffSupportMessageRequest,
  ): Promise<AddSupportMessageResponse> {
    const response =
      await api.post<AddSupportMessageResponse>(
        `${ADMIN_SUPPORT_BASE}/tickets/${encodeURIComponent(
          ticketId,
        )}/messages`,
        data,
      );

    return response.data;
  },

  /* ------------------------------------------------------------------------ */
  /* Read receipts                                                            */
  /* ------------------------------------------------------------------------ */

  async markSupportMessagesSeen(
  ticketId: string,
): Promise<MarkAdminSupportMessagesSeenResponse> {
  const response =
    await api.post<MarkAdminSupportMessagesSeenResponse>(
      `${ADMIN_SUPPORT_BASE}/tickets/${encodeURIComponent(ticketId)}/messages/seen`,
    );

  return response.data;
},

  /* ------------------------------------------------------------------------ */
  /* Unread messages                                                          */
  /* ------------------------------------------------------------------------ */

  async getUnreadSupportCount(): Promise<AdminSupportUnreadCountResponse> {
    const response =
      await api.get<AdminSupportUnreadCountResponse>(
        `${ADMIN_SUPPORT_BASE}/unread-count`,
      );

    return response.data;
  },

  /* ------------------------------------------------------------------------ */
  /* Attachments                                                              */
  /* ------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------ */
  /* Attachments                                                              */
  /* ------------------------------------------------------------------------ */

  async getAttachments(
    ticketId: string,
  ): Promise<GetSupportAttachmentsResponse> {
    const response =
      await api.get<GetSupportAttachmentsResponse>(
        `${ADMIN_SUPPORT_BASE}/tickets/${encodeURIComponent(
          ticketId,
        )}/attachments`,
      );

    return response.data;
  },

  async uploadAttachment(
    ticketId: string,
    file: File,
    messageId?: string,
  ): Promise<UploadSupportAttachmentResponse> {
    const formData = new FormData();

    formData.append('file', file);

    if (messageId) {
      formData.append('message_id', messageId);
    }

    const response =
      await api.post<UploadSupportAttachmentResponse>(
        `${ADMIN_SUPPORT_BASE}/tickets/${encodeURIComponent(
          ticketId,
        )}/attachments`,
        formData,
      );

    return response.data;
  },

  async downloadAttachment(
    ticketId: string,
    attachmentId: string,
  ): Promise<Blob> {
    const response =
      await api.get<Blob>(
        `${ADMIN_SUPPORT_BASE}/tickets/${encodeURIComponent(
          ticketId,
        )}/attachments/${encodeURIComponent(attachmentId)}`,
        {
          responseType: 'blob',
        },
      );

    return response.data;
  },

    async deleteAttachment(
    ticketId: string,
    attachmentId: string,
  ): Promise<{ message: string }> {
    const response =
      await api.delete<{ message: string }>(
        `${ADMIN_SUPPORT_BASE}/tickets/${encodeURIComponent(
          ticketId,
        )}/attachments/${encodeURIComponent(
          attachmentId,
        )}`,
      );

    return response.data;
  },

  /* ------------------------------------------------------------------------ */
  /* Events / audit history                                                   */
  /* ------------------------------------------------------------------------ */

  async getEvents(
    ticketId: string,
  ): Promise<GetSupportEventsResponse> {
    const response =
      await api.get<GetSupportEventsResponse>(
        `${ADMIN_SUPPORT_BASE}/tickets/${encodeURIComponent(
          ticketId,
        )}/events`,
      );

    return response.data;
  },

  /* ------------------------------------------------------------------------ */
  /* Status                                                                    */
  /* ------------------------------------------------------------------------ */

  async updateStatus(
    ticketId: string,
    status: SupportTicketStatus,
  ): Promise<UpdateSupportTicketStatusResponse> {
    const response =
      await api.patch<UpdateSupportTicketStatusResponse>(
        `${ADMIN_SUPPORT_BASE}/tickets/${encodeURIComponent(
          ticketId,
        )}/status`,
        {
          status,
        },
      );

    return response.data;
  },

  /* ------------------------------------------------------------------------ */
  /* Priority                                                                  */
  /* ------------------------------------------------------------------------ */

  async updatePriority(
    ticketId: string,
    priority: SupportTicketPriority,
  ): Promise<UpdateSupportTicketPriorityResponse> {
    const response =
      await api.patch<UpdateSupportTicketPriorityResponse>(
        `${ADMIN_SUPPORT_BASE}/tickets/${encodeURIComponent(
          ticketId,
        )}/priority`,
        {
          priority,
        },
      );

    return response.data;
  },

  /* ------------------------------------------------------------------------ */
  /* Assignment                                                                */
  /* ------------------------------------------------------------------------ */

  async assignTicket(
    ticketId: string,
    assignedTo: string | null,
  ): Promise<AssignSupportTicketResponse> {
    const response =
      await api.patch<AssignSupportTicketResponse>(
        `${ADMIN_SUPPORT_BASE}/tickets/${encodeURIComponent(
          ticketId,
        )}/assignment`,
        {
          assigned_to: assignedTo,
        },
      );

    return response.data;
  },

  async deleteTicket(
  ticketId: string,
): Promise<DeleteSupportTicketResponse> {
  const response =
    await api.delete<DeleteSupportTicketResponse>(
      `${ADMIN_SUPPORT_BASE}/tickets/${encodeURIComponent(
        ticketId,
      )}`,
    );

  return response.data;
},

};

export default adminSupportApi;

