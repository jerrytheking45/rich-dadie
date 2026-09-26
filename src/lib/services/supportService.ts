
import { supportApi } from '@/src/lib/api/support';

import type {
  CreateSupportTicketRequest,
  SupportTicketCategory,
} from '@/src/lib/types/support';

const MAX_SUBJECT_LENGTH = 255;
const MAX_MESSAGE_LENGTH = 10000;

export const supportService = {
  async createTicket(
    data: CreateSupportTicketRequest,
  ) {
    const subject = data.subject.trim();
    const message = data.message.trim();

    if (!subject) {
      throw new Error('Subject is required.');
    }

    if (subject.length > MAX_SUBJECT_LENGTH) {
      throw new Error(
        `Subject must not exceed ${MAX_SUBJECT_LENGTH} characters.`,
      );
    }

    if (!message) {
      throw new Error('Message is required.');
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      throw new Error(
        `Message must not exceed ${MAX_MESSAGE_LENGTH} characters.`,
      );
    }

    return supportApi.createTicket({
      subject,
      category: data.category,
      message,
    });
  },

  async listMyTickets(
    limit = 20,
    offset = 0,
  ) {
    return supportApi.listMyTickets(limit, offset);
  },

  async getTicket(ticketId: string) {
    return supportApi.getTicket(ticketId);
  },

  async getMessages(ticketId: string) {
    return supportApi.getMessages(ticketId);
  },

  async addMessage(
    ticketId: string,
    message: string,
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

    return supportApi.addMessage(ticketId, {
      message: value,
    });
  },

  async markMessagesSeen(ticketId: string) {
return supportApi.markMessagesSeen(ticketId);
},

async getUnreadCount() {
return supportApi.getUnreadCount();
},

  async getAttachments(ticketId: string) {
    return supportApi.getAttachments(ticketId);
  },

  async getEvents(ticketId: string) {
    return supportApi.getEvents(ticketId);
  },
  
  async deleteTicket(ticketId: string) {
  return supportApi.deleteTicket(ticketId);
},

async uploadAttachment(
  ticketId: string,
  file: File,
  messageId?: string,
) {
  return supportApi.uploadAttachment(
    ticketId,
    file,
    messageId,
  );
},

async downloadAttachment(
  ticketId: string,
  attachmentId: string,
) {
  return supportApi.downloadAttachment(
    ticketId,
    attachmentId,
  );
},

  async deleteAttachment(
    ticketId: string,
    attachmentId: string,
  ) {
    return supportApi.deleteAttachment(
      ticketId,
      attachmentId,
    );
  },
  
  getCategories(): Array<{
    value: SupportTicketCategory;
    label: string;
  }> {
    return [
      {
        value: 'ACCOUNT',
        label: 'Account',
      },
      {
        value: 'DEPOSIT',
        label: 'Deposit',
      },
      {
        value: 'INVESTMENT',
        label: 'Investment',
      },
      {
        value: 'WITHDRAWAL',
        label: 'Withdrawal',
      },
      {
        value: 'WALLET',
        label: 'Wallet',
      },
      {
        value: 'PAYMENT',
        label: 'Payment',
      },
      {
        value: 'VERIFICATION',
        label: 'Verification',
      },
      {
        value: 'SECURITY',
        label: 'Security',
      },
      {
        value: 'OTHER',
        label: 'Other',
      },
    ];
  },
};