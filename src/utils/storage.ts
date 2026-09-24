import { STORAGE_KEYS } from './constants';
import { getTodayKey, isNewDay } from './date';
import { DEFAULT_POMODORO_SETTINGS, POMODORO_LIMITS } from '../types/pomodoro';
import type { Task, TaskHistory, Goal, Habit, JournalEntry, PomodoroSession, PomodoroSettings, PomodoroState } from '../types';

type StorageKey = keyof typeof STORAGE_KEYS;

type UnknownRecord = Record<string, unknown>;

function getStorageKey(key: StorageKey): string {
  return STORAGE_KEYS[key];
}

function readFromStorage<T>(key: StorageKey, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(getStorageKey(key));
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function writeToStorage<T>(key: StorageKey, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getStorageKey(key), JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to write to localStorage (${key}):`, error);
  }
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  if (typeof value === 'string' && value.trim() === '') return null;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function toDate(value: unknown): Date | null {
  if (!(value instanceof Date) && typeof value !== 'string' && typeof value !== 'number') {
    return null;
  }
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeSettings(value: unknown): PomodoroSettings {
  const record = isRecord(value) ? value : {};

  const clamp = (key: keyof PomodoroSettings): number => {
    const numericValue = toFiniteNumber(record[key]);
    const limits = POMODORO_LIMITS[key];
    const fallback = DEFAULT_POMODORO_SETTINGS[key];
    if (numericValue === null) return fallback;
    return Math.min(limits.max, Math.max(limits.min, Math.round(numericValue)));
  };

  return {
    workMinutes: clamp('workMinutes'),
    shortBreakMinutes: clamp('shortBreakMinutes'),
    longBreakMinutes: clamp('longBreakMinutes'),
    sessionsBeforeLongBreak: clamp('sessionsBeforeLongBreak'),
  };
}

function normalizeSession(value: unknown): PomodoroSession | null {
  if (!isRecord(value) || typeof value.id !== 'string' || value.id.length === 0) return null;
  if (value.phase !== undefined && value.phase !== 'work') return null;

  let durationMinutes: number | null = null;
  let completed: boolean | null = null;
  let startedAt: Date | null = null;
  let endedAt: Date | null = null;

  if (typeof value.completed === 'boolean' && value.durationMinutes !== undefined) {
    durationMinutes = toFiniteNumber(value.durationMinutes);
    completed = value.completed;
    startedAt = toDate(value.startedAt);
    endedAt = toDate(value.endedAt);
  } else if (value.phase === 'work') {
    durationMinutes = toFiniteNumber(value.duration);
    completed = true;
    endedAt = toDate(value.completedAt);
    if (endedAt !== null && durationMinutes !== null) {
      startedAt = new Date(endedAt.getTime() - durationMinutes * 60 * 1000);
    }
  }

  if (
    durationMinutes === null ||
    durationMinutes <= 0 ||
    completed === null ||
    startedAt === null ||
    endedAt === null
  ) {
    return null;
  }

  const taskId = typeof value.taskId === 'string' && value.taskId.length > 0 ? value.taskId : undefined;
  const taskTitle = typeof value.taskTitle === 'string' && value.taskTitle.length > 0 ? value.taskTitle : undefined;

  return {
    id: value.id,
    ...(taskId ? { taskId } : {}),
    ...(taskTitle ? { taskTitle } : {}),
    durationMinutes,
    completed,
    startedAt,
    endedAt,
  };
}

function normalizeSessions(value: unknown): PomodoroSession[] {
  if (!Array.isArray(value)) return [];
  return value
    .map(normalizeSession)
    .filter((session): session is PomodoroSession => session !== null);
}

export const storage = {
  tasks: {
    get: (): Task[] => readFromStorage('TASKS', []),
    set: (tasks: Task[]) => writeToStorage('TASKS', tasks),
  },
  taskHistory: {
    get: (): TaskHistory[] => readFromStorage('TASK_HISTORY', []),
    set: (history: TaskHistory[]) => writeToStorage('TASK_HISTORY', history),
  },
  goals: {
    get: (): Goal[] => readFromStorage('GOALS', []),
    set: (goals: Goal[]) => writeToStorage('GOALS', goals),
  },
  habits: {
    get: (): Habit[] => readFromStorage('HABITS', []),
    set: (habits: Habit[]) => writeToStorage('HABITS', habits),
  },
  journal: {
    get: (): JournalEntry[] => readFromStorage('JOURNAL', []),
    set: (entries: JournalEntry[]) => writeToStorage('JOURNAL', entries),
  },
  pomodoroSessions: {
    get: (): PomodoroSession[] => normalizeSessions(readFromStorage<unknown>('POMODORO_SESSIONS', [])),
    set: (sessions: PomodoroSession[]) => writeToStorage('POMODORO_SESSIONS', sessions),
  },
  pomodoroSettings: {
    get: (): PomodoroSettings => normalizeSettings(readFromStorage<unknown>('POMODORO_SETTINGS', DEFAULT_POMODORO_SETTINGS)),
    set: (settings: PomodoroSettings) => writeToStorage('POMODORO_SETTINGS', normalizeSettings(settings)),
  },
  pomodoroState: {
    get: (): PomodoroState | null => readFromStorage('POMODORO_STATE', null),
    set: (state: PomodoroState | null) => writeToStorage('POMODORO_STATE', state),
  },
  lastReset: {
    get: (): string => readFromStorage('LAST_RESET', ''),
    set: (date: string) => writeToStorage('LAST_RESET', date),
  },
};

export function performDailyReset(): void {
  const today = getTodayKey();
  const lastReset = storage.lastReset.get();

  if (!isNewDay(lastReset)) return;

  const tasks = storage.tasks.get();
  const history = storage.taskHistory.get();
  const habits = storage.habits.get();

  const completedTasks = tasks.filter(t => t.completed);
  const activeTasks = tasks.map(t => ({ ...t, completed: false }));

  const newHistory: TaskHistory[] = completedTasks.map(task => ({
    id: crypto.randomUUID(),
    taskId: task.id,
    title: task.title,
    completedAt: new Date().toISOString(),
    priority: task.priority,
  }));

  const updatedHabits = habits.map(habit => {
    if (habit.frequency === 'daily') {
      const todayKey = getTodayKey();
      const allDaysChecked = Object.keys(habit.dailyChecks).length === 7 &&
        Object.values(habit.dailyChecks).every(v => v);

      if (allDaysChecked) {
        return {
          ...habit,
          streak: habit.streak + 1,
          longestStreak: Math.max(habit.longestStreak, habit.streak + 1),
          dailyChecks: { [todayKey]: false },
          lastCompletedAt: new Date().toISOString(),
        };
      }
      return {
        ...habit,
        dailyChecks: { [todayKey]: false },
      };
    }
    return habit;
  });

  storage.tasks.set(activeTasks);
  storage.taskHistory.set([...newHistory, ...history].slice(0, 500));
  storage.habits.set(updatedHabits);
  storage.lastReset.set(today);
}
