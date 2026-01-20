import { Task } from '../types';

export const PRIORITY_VARIANT = {
  low: 'info' as const,
  medium: 'default' as const,
  high: 'warning' as const,
  urgent: 'danger' as const,
} as const;

export const PRIORITY_LABEL = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
} as const;

export const STATUS_LABEL = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
  archived: 'Archived',
} as const;

export type PriorityVariant = typeof PRIORITY_VARIANT[Task['priority']];
