import { apiClient } from './client';
import type { AuthResponse } from '../types';

export const authApi = {
  authenticateWithTelegram: async (initData: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/telegram', {
      initData,
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },

  refreshToken: async () => {
    const response = await apiClient.post('/api/auth/refresh');
    return response.data;
  },
};
