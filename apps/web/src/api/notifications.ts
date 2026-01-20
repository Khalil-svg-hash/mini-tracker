import { apiClient } from './client';
import type { Notification, PaginatedResponse } from '../types';

interface NotificationFilters {
  isRead?: boolean;
  type?: string;
  page?: number;
  limit?: number;
}

export const notificationsApi = {
  getAll: async (
    filters: NotificationFilters = {}
  ): Promise<PaginatedResponse<Notification>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
    const response = await apiClient.get<PaginatedResponse<Notification>>(
      `/api/notifications?${params}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<Notification> => {
    const response = await apiClient.get<Notification>(`/api/notifications/${id}`);
    return response.data;
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const response = await apiClient.patch<Notification>(
      `/api/notifications/${id}/read`
    );
    return response.data;
  },

  markAsUnread: async (id: string): Promise<Notification> => {
    const response = await apiClient.patch<Notification>(
      `/api/notifications/${id}/unread`
    );
    return response.data;
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.post('/api/notifications/read-all');
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/notifications/${id}`);
  },

  deleteAll: async (): Promise<void> => {
    await apiClient.delete('/api/notifications');
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get<{ count: number }>(
      '/api/notifications/unread-count'
    );
    return response.data.count;
  },
};
