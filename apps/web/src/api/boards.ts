import { apiClient } from './client';
import type { Board, BoardColumn, PaginatedResponse } from '../types';

interface CreateBoardData {
  projectId: string;
  name: string;
  description?: string;
  viewType?: 'kanban' | 'list' | 'calendar' | 'timeline';
}

interface UpdateBoardData {
  name?: string;
  description?: string;
  viewType?: 'kanban' | 'list' | 'calendar' | 'timeline';
}

interface CreateColumnData {
  boardId: string;
  name: string;
  position: number;
  color?: string;
}

interface UpdateColumnData {
  name?: string;
  position?: number;
  color?: string;
}

export const boardsApi = {
  getAll: async (
    projectId?: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Board>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (projectId) {
      params.append('projectId', projectId);
    }
    const response = await apiClient.get<PaginatedResponse<Board>>(
      `/api/boards?${params}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<Board> => {
    const response = await apiClient.get<Board>(`/api/boards/${id}`);
    return response.data;
  },

  create: async (data: CreateBoardData): Promise<Board> => {
    const response = await apiClient.post<Board>('/api/boards', data);
    return response.data;
  },

  update: async (id: string, data: UpdateBoardData): Promise<Board> => {
    const response = await apiClient.patch<Board>(`/api/boards/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/boards/${id}`);
  },

  getByProject: async (projectId: string): Promise<Board[]> => {
    const response = await apiClient.get<Board[]>(`/api/projects/${projectId}/boards`);
    return response.data;
  },

  getColumns: async (boardId: string): Promise<BoardColumn[]> => {
    const response = await apiClient.get<BoardColumn[]>(`/api/boards/${boardId}/columns`);
    return response.data;
  },

  createColumn: async (data: CreateColumnData): Promise<BoardColumn> => {
    const response = await apiClient.post<BoardColumn>('/api/board-columns', data);
    return response.data;
  },

  updateColumn: async (id: string, data: UpdateColumnData): Promise<BoardColumn> => {
    const response = await apiClient.patch<BoardColumn>(`/api/board-columns/${id}`, data);
    return response.data;
  },

  deleteColumn: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/board-columns/${id}`);
  },

  reorderColumns: async (boardId: string, columnIds: string[]): Promise<void> => {
    await apiClient.post(`/api/boards/${boardId}/columns/reorder`, { columnIds });
  },
};
