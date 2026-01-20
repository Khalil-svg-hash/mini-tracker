import { apiClient } from './client';
import type { Comment, PaginatedResponse } from '../types';

interface CreateCommentData {
  taskId: string;
  content: string;
}

interface UpdateCommentData {
  content: string;
}

export const commentsApi = {
  getAll: async (
    taskId?: string,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<Comment>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (taskId) {
      params.append('taskId', taskId);
    }
    const response = await apiClient.get<PaginatedResponse<Comment>>(
      `/api/comments?${params}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<Comment> => {
    const response = await apiClient.get<Comment>(`/api/comments/${id}`);
    return response.data;
  },

  create: async (data: CreateCommentData): Promise<Comment> => {
    const response = await apiClient.post<Comment>('/api/comments', data);
    return response.data;
  },

  update: async (id: string, data: UpdateCommentData): Promise<Comment> => {
    const response = await apiClient.patch<Comment>(`/api/comments/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/comments/${id}`);
  },

  getByTask: async (taskId: string): Promise<Comment[]> => {
    const response = await apiClient.get<Comment[]>(`/api/tasks/${taskId}/comments`);
    return response.data;
  },
};
