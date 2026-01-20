import { apiClient } from './client';
import type { Task, PaginatedResponse } from '../types';

interface CreateTaskData {
  boardId: string;
  columnId?: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'todo' | 'in_progress' | 'done' | 'archived';
  assigneeId?: string;
  dueDate?: string;
  startDate?: string;
  estimatedHours?: number;
  tags?: string[];
}

interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'todo' | 'in_progress' | 'done' | 'archived';
  columnId?: string;
  position?: number;
  assigneeId?: string;
  dueDate?: string;
  startDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
}

interface TaskFilters {
  boardId?: string;
  columnId?: string;
  assigneeId?: string;
  status?: string;
  priority?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const tasksApi = {
  getAll: async (filters: TaskFilters = {}): Promise<PaginatedResponse<Task>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
    const response = await apiClient.get<PaginatedResponse<Task>>(
      `/api/tasks?${params}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<Task> => {
    const response = await apiClient.get<Task>(`/api/tasks/${id}`);
    return response.data;
  },

  create: async (data: CreateTaskData): Promise<Task> => {
    const response = await apiClient.post<Task>('/api/tasks', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTaskData): Promise<Task> => {
    const response = await apiClient.patch<Task>(`/api/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/tasks/${id}`);
  },

  getByBoard: async (boardId: string): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>(`/api/boards/${boardId}/tasks`);
    return response.data;
  },

  getByColumn: async (columnId: string): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>(`/api/board-columns/${columnId}/tasks`);
    return response.data;
  },

  moveTask: async (
    taskId: string,
    columnId: string,
    position: number
  ): Promise<Task> => {
    const response = await apiClient.post<Task>(`/api/tasks/${taskId}/move`, {
      columnId,
      position,
    });
    return response.data;
  },

  reorderTasks: async (columnId: string, taskIds: string[]): Promise<void> => {
    await apiClient.post(`/api/board-columns/${columnId}/tasks/reorder`, { taskIds });
  },

  assignTask: async (taskId: string, assigneeId: string): Promise<Task> => {
    const response = await apiClient.post<Task>(`/api/tasks/${taskId}/assign`, {
      assigneeId,
    });
    return response.data;
  },

  unassignTask: async (taskId: string): Promise<Task> => {
    const response = await apiClient.post<Task>(`/api/tasks/${taskId}/unassign`);
    return response.data;
  },

  addAttachment: async (taskId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/api/tasks/${taskId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteAttachment: async (taskId: string, attachmentId: string): Promise<void> => {
    await apiClient.delete(`/api/tasks/${taskId}/attachments/${attachmentId}`);
  },
};
