export const STORAGE_KEYS = {
  TASKS: 'dotchan_tasks',
  TASK_HISTORY: 'dotchan_task_history',
  GOALS: 'dotchan_goals',
  HABITS: 'dotchan_habits',
  JOURNAL: 'dotchan_journal',
  POMODORO_SESSIONS: 'dotchan_pomodoro_sessions',
  POMODORO_STATE: 'dotchan_pomodoro_state',
  POMODORO_SETTINGS: 'dotchan_pomodoro_settings',
  LAST_RESET: 'dotchan_last_reset',
} as const;

export const PRIORITY_OPTIONS = ['low', 'medium', 'high'] as const;
export const FREQUENCY_OPTIONS = ['daily', 'weekly'] as const;
export const MOOD_OPTIONS = ['awful', 'bad', 'okay', 'good', 'great'] as const;

export const THEME = {
  background: 'bg-black',
  card: 'bg-neutral-950',
  border: 'border-neutral-900',
  textPrimary: 'text-neutral-100',
  textSecondary: 'text-neutral-400',
  textMuted: 'text-neutral-500',
  accent: 'neutral',
} as const;