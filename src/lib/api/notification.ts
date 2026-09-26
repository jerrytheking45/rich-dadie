
// src/lib/api/notification.ts

import api from './api';
import { toCamelCase } from './utils';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, unknown> | null;
}

export interface NotificationPagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface NotificationListResponse {
  notifications: Notification[];
  pagination: NotificationPagination;
}

export const notificationApi = {
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get(
      '/investment/notifications/unread-count',
    );

    return Number(response.data.unread_count ?? 0);
  },

  getNotifications: async (
    page = 1,
    pageSize = 20,
  ): Promise<NotificationListResponse> => {
    const response = await api.get(
      '/investment/notifications',
      {
        params: {
          page,
          page_size: pageSize,
        },
      },
    );

    const data = response.data;

    return {
      notifications: toCamelCase<Notification[]>(
        data.notifications ?? [],
      ),
      pagination: {
        page: Number(data.pagination?.page ?? page),
        pageSize: Number(
          data.pagination?.page_size ?? pageSize,
        ),
        total: Number(data.pagination?.total ?? 0),
      },
    };
  },

  markAsRead: async (
    notificationId: string,
  ): Promise<void> => {
    await api.put(
      `/investment/notifications/${notificationId}/read`,
    );
  },

  markAllAsRead: async (): Promise<void> => {
    await api.put(
      '/investment/notifications/read-all',
    );
  },

  deleteNotification: async (
    notificationId: string,
  ): Promise<void> => {
    await api.delete(
      `/investment/notifications/${notificationId}`,
    );
  },
};