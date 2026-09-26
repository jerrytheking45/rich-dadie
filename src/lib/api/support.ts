
// src/lib/api/support.ts

import api from './api';

import type {
  AddSupportMessageRequest,
  AddSupportMessageResponse,
  CreateSupportTicketRequest,
  CreateSupportTicketResponse,
  GetSupportAttachmentsResponse,
  GetSupportEventsResponse,
  GetSupportMessagesResponse,
  GetSupportTicketResponse,
  ListSupportTicketsResponse,
  MarkSupportMessagesSeenResponse,
  SupportUnreadCountResponse,
  UploadSupportAttachmentResponse,
} from '@/src/lib/types/support';

const SUPPORT_BASE = '/support';


export const supportApi = {
  /* ------------------------------------------------------------------------ */
  /* Tickets                                                                  */
  /* ------------------------------------------------------------------------ */

  async createTicket(
    data: CreateSupportTicketRequest,
  ): Promise<CreateSupportTicketResponse> {
    const response = await api.post<CreateSupportTicketResponse>(
      `${SUPPORT_BASE}/tickets`,
      data,
    );

    return response.data;
  },

  async listMyTickets(
    limit = 20,
    offset = 0,
  ): Promise<ListSupportTicketsResponse> {
    const response =
      await api.get<ListSupportTicketsResponse>(
        `${SUPPORT_BASE}/tickets`,
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
        `${SUPPORT_BASE}/tickets/${encodeURIComponent(ticketId)}`,
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
        `${SUPPORT_BASE}/tickets/${encodeURIComponent(ticketId)}/messages`,
      );

    return response.data;
  },

  async addMessage(
    ticketId: string,
    data: AddSupportMessageRequest,
  ): Promise<AddSupportMessageResponse> {
    const response =
      await api.post<AddSupportMessageResponse>(
        `${SUPPORT_BASE}/tickets/${encodeURIComponent(ticketId)}/messages`,
        data,
      );

    return response.data;
  },

  /* ------------------------------------------------------------------------ */
  /* Unread messages                                                          */
  /* ------------------------------------------------------------------------ */

async getUnreadCount(): Promise<SupportUnreadCountResponse> {
  const response =
    await api.get<SupportUnreadCountResponse>(
      `${SUPPORT_BASE}/unread-count`,
    );

  return response.data;
},

async markMessagesSeen(
  ticketId: string,
): Promise<MarkSupportMessagesSeenResponse> {
  const response =
    await api.post<MarkSupportMessagesSeenResponse>(
      `${SUPPORT_BASE}/tickets/${encodeURIComponent(
        ticketId,
      )}/messages/seen`,
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
        `${SUPPORT_BASE}/tickets/${encodeURIComponent(ticketId)}/attachments`,
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
        `${SUPPORT_BASE}/tickets/${encodeURIComponent(ticketId)}/attachments`,
        formData,
      );

    return response.data;
  },

  async downloadAttachment(
    ticketId: string,
    attachmentId: string,
  ): Promise<Blob> {
    const response = await api.get<Blob>(
      `${SUPPORT_BASE}/tickets/${encodeURIComponent(
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
        `${SUPPORT_BASE}/tickets/${encodeURIComponent(
          ticketId,
        )}/attachments/${encodeURIComponent(
          attachmentId,
        )}`,
      );

    return response.data;
  },

  /* ------------------------------------------------------------------------ */
  /* Events                                                                   */
  /* ------------------------------------------------------------------------ */

  async getEvents(
    ticketId: string,
  ): Promise<GetSupportEventsResponse> {
    const response =
      await api.get<GetSupportEventsResponse>(
        `${SUPPORT_BASE}/tickets/${encodeURIComponent(ticketId)}/events`,
      );

    return response.data;
  },

async deleteTicket(
  ticketId: string,
): Promise<{ message: string }> {
  const response = await api.delete<{ message: string }>(
    `${SUPPORT_BASE}/tickets/${encodeURIComponent(
      ticketId,
    )}`,
  );

  return response.data;
},

};

export default supportApi;