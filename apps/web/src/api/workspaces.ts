import { apiClient } from './client';
import type { Workspace, PaginatedResponse } from '../types';

interface CreateWorkspaceData {
  name: string;
  description?: string;
}

interface UpdateWorkspaceData {
  name?: string;
  description?: string;
}

interface AddMemberData {
  userId: string;
  role: 'admin' | 'member';
}

export const workspacesApi = {
  getAll: async (page = 1, limit = 10): Promise<PaginatedResponse<Workspace>> => {
    const response = await apiClient.get<PaginatedResponse<Workspace>>(
      `/api/workspaces?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<Workspace> => {
    const response = await apiClient.get<Workspace>(`/api/workspaces/${id}`);
    return response.data;
  },

  create: async (data: CreateWorkspaceData): Promise<Workspace> => {
    const response = await apiClient.post<Workspace>('/api/workspaces', data);
    return response.data;
  },

  update: async (id: string, data: UpdateWorkspaceData): Promise<Workspace> => {
    const response = await apiClient.patch<Workspace>(`/api/workspaces/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/workspaces/${id}`);
  },

  addMember: async (workspaceId: string, data: AddMemberData) => {
    const response = await apiClient.post(
      `/api/workspaces/${workspaceId}/members`,
      data
    );
    return response.data;
  },

  removeMember: async (workspaceId: string, memberId: string) => {
    await apiClient.delete(`/api/workspaces/${workspaceId}/members/${memberId}`);
  },

  updateMemberRole: async (workspaceId: string, memberId: string, role: string) => {
    const response = await apiClient.patch(
      `/api/workspaces/${workspaceId}/members/${memberId}`,
      { role }
    );
    return response.data;
  },
};
