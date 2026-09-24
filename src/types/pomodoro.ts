export type PomodoroPhase = 'work' | 'break' | 'idle';
export type PomodoroBreakType = 'short' | 'long';

export interface PomodoroSettings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
}

export interface PomodoroSession {
  id: string;
  taskId?: string;
  taskTitle?: string;
  durationMinutes: number;
  completed: boolean;
  startedAt: Date;
  endedAt: Date;
}

export interface PomodoroState {
  phase: PomodoroPhase;
  timeRemaining: number;
  isRunning: boolean;
  sessionsCompleted: number;
  breakType: PomodoroBreakType | null;
  taskId?: string;
  taskTitle?: string;
  phaseStartedAt?: string;
  phaseDuration: number;
}

export const DEFAULT_POMODORO_SETTINGS: PomodoroSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
};

export const POMODORO_LIMITS = {
  workMinutes: { min: 1, max: 120 },
  shortBreakMinutes: { min: 1, max: 60 },
  longBreakMinutes: { min: 1, max: 60 },
  sessionsBeforeLongBreak: { min: 2, max: 10 },
} as const;

export const PHASE_LABELS: Record<PomodoroPhase, string> = {
  work: 'Focus',
  break: 'Break',
  idle: 'Ready',
};
