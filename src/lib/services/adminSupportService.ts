
import adminSupportApi from '@/src/lib/api/adminSupport';

import type {
  AddStaffSupportMessageRequest,
} from '@/src/lib/api/adminSupport';

import type {
  SupportTicketPriority,
  SupportTicketStatus,
} from '@/src/lib/types/support';

const MAX_MESSAGE_LENGTH = 10000;

export const adminSupportService = {
  async listTickets(
    limit = 20,
    offset = 0,
  ) {
    return adminSupportApi.listTickets(limit, offset);
  },

  async getTicket(ticketId: string) {
    return adminSupportApi.getTicket(ticketId);
  },

  async getMessages(ticketId: string) {
    return adminSupportApi.getMessages(ticketId);
  },

  async markSupportMessagesSeen(ticketId: string) {
    return adminSupportApi.markSupportMessagesSeen(ticketId);
  },

  async addMessage(
    ticketId: string,
    message: string,
    isInternal = false,
  ) {
    const value = message.trim();

    if (!value) {
      throw new Error('Message is required.');
    }

    if (value.length > MAX_MESSAGE_LENGTH) {
      throw new Error(
        `Message must not exceed ${MAX_MESSAGE_LENGTH} characters.`,
      );
    }

    const data: AddStaffSupportMessageRequest = {
      message: value,
      is_internal: isInternal,
    };

    return adminSupportApi.addMessage(ticketId, data);
  },

  async getAttachments(ticketId: string) {
    return adminSupportApi.getAttachments(ticketId);
  },

  async getEvents(ticketId: string) {
    return adminSupportApi.getEvents(ticketId);
  },

  async updateStatus(
    ticketId: string,
    status: SupportTicketStatus,
  ) {
    return adminSupportApi.updateStatus(
      ticketId,
      status,
    );
  },

  async updatePriority(
    ticketId: string,
    priority: SupportTicketPriority,
  ) {
    return adminSupportApi.updatePriority(
      ticketId,
      priority,
    );
  },

  async assignTicket(
    ticketId: string,
    assignedTo: string | null,
  ) {
    return adminSupportApi.assignTicket(
      ticketId,
      assignedTo,
    );
  },

  async deleteTicket(ticketId: string) {
  return adminSupportApi.deleteTicket(ticketId);
},

async uploadAttachment(
  ticketId: string,
  file: File,
  messageId?: string,
) {
  return adminSupportApi.uploadAttachment(
    ticketId,
    file,
    messageId,
  );
},

async downloadAttachment(
  ticketId: string,
  attachmentId: string,
) {
  return adminSupportApi.downloadAttachment(
    ticketId,
    attachmentId,
  );
},

  async deleteAttachment(
    ticketId: string,
    attachmentId: string,
  ) {
    return adminSupportApi.deleteAttachment(
      ticketId,
      attachmentId,
    );
  },
  
};

export default adminSupportService;

