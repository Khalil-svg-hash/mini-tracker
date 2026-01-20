import { apiClient } from './client';
import type { Project, PaginatedResponse } from '../types';

interface CreateProjectData {
  workspaceId: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

interface UpdateProjectData {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
}

export const projectsApi = {
  getAll: async (
    workspaceId?: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Project>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (workspaceId) {
      params.append('workspaceId', workspaceId);
    }
    const response = await apiClient.get<PaginatedResponse<Project>>(
      `/api/projects?${params}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<Project> => {
    const response = await apiClient.get<Project>(`/api/projects/${id}`);
    return response.data;
  },

  create: async (data: CreateProjectData): Promise<Project> => {
    const response = await apiClient.post<Project>('/api/projects', data);
    return response.data;
  },

  update: async (id: string, data: UpdateProjectData): Promise<Project> => {
    const response = await apiClient.patch<Project>(`/api/projects/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/projects/${id}`);
  },

  getByWorkspace: async (workspaceId: string): Promise<Project[]> => {
    const response = await apiClient.get<Project[]>(
      `/api/workspaces/${workspaceId}/projects`
    );
    return response.data;
  },
};
