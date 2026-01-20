import { apiClient } from './client';
import type { Task, CalendarEvent } from '../types';

interface DateRangeParams {
  startDate: string;
  endDate: string;
  workspaceId?: string;
  projectId?: string;
  boardId?: string;
}

export const calendarApi = {
  getTasksByDateRange: async (params: DateRangeParams): Promise<Task[]> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value);
      }
    });
    const response = await apiClient.get<Task[]>(`/api/calendar/tasks?${queryParams}`);
    return response.data;
  },

  getEvents: async (params: DateRangeParams): Promise<CalendarEvent[]> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value);
      }
    });
    const response = await apiClient.get<CalendarEvent[]>(
      `/api/calendar/events?${queryParams}`
    );
    return response.data;
  },

  getUpcomingTasks: async (days = 7): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>(
      `/api/calendar/upcoming?days=${days}`
    );
    return response.data;
  },

  getOverdueTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>('/api/calendar/overdue');
    return response.data;
  },
};
