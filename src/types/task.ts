export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  dueDate?: string;
}

export interface TaskHistory {
  id: string;
  taskId: string;
  title: string;
  completedAt: string;
  priority: Priority;
}

export const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  high: 'text-red-400',
  medium: 'text-amber-400',
  low: 'text-emerald-400',
};

export const PRIORITY_BG: Record<Priority, string> = {
  high: 'bg-neutral-950',
  medium: 'bg-neutral-950',
  low: 'bg-neutral-950',
};