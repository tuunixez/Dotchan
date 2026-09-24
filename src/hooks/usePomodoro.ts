import { useCallback, useEffect, useRef, useState } from 'react';
import { generateId } from '../utils/id';
import { storage } from '../utils/storage';
import { DEFAULT_POMODORO_SETTINGS, PHASE_LABELS, POMODORO_LIMITS } from '../types/pomodoro';
import type { PomodoroBreakType, PomodoroPhase, PomodoroSession, PomodoroSettings, PomodoroState } from '../types';

type UnknownRecord = Record<string, unknown>;

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
  if (!(value instanceof Date) && typeof value !== 'string' && typeof value !== 'number') return null;
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getPhaseDuration(
  phase: PomodoroPhase,
  breakType: PomodoroBreakType | null,
  settings: PomodoroSettings,
): number {
  if (phase === 'break') {
    return (breakType === 'long' ? settings.longBreakMinutes : settings.shortBreakMinutes) * 60;
  }
  return settings.workMinutes * 60;
}

function createIdleState(settings: PomodoroSettings): PomodoroState {
  const phaseDuration = getPhaseDuration('idle', null, settings);
  return {
    phase: 'idle',
    timeRemaining: phaseDuration,
    isRunning: false,
    sessionsCompleted: 0,
    breakType: null,
    phaseDuration,
  };
}

function normalizeSettings(settings: PomodoroSettings): PomodoroSettings {
  const clamp = (key: keyof PomodoroSettings): number => {
    const value = settings[key];
    const limits = POMODORO_LIMITS[key];
    return Number.isFinite(value)
      ? Math.min(limits.max, Math.max(limits.min, Math.round(value)))
      : DEFAULT_POMODORO_SETTINGS[key];
  };

  return {
    workMinutes: clamp('workMinutes'),
    shortBreakMinutes: clamp('shortBreakMinutes'),
    longBreakMinutes: clamp('longBreakMinutes'),
    sessionsBeforeLongBreak: clamp('sessionsBeforeLongBreak'),
  };
}

function normalizeState(value: unknown, settings: PomodoroSettings): PomodoroState {
  if (!isRecord(value)) return createIdleState(settings);

  const savedPhase = value.phase;
  const requestedPhase: PomodoroPhase = savedPhase === 'work' || savedPhase === 'break' || savedPhase === 'idle'
    ? savedPhase
    : 'idle';
  const isRunning = value.isRunning === true && requestedPhase !== 'idle';
  const phase: PomodoroPhase = isRunning ? requestedPhase : 'idle';
  const breakType: PomodoroBreakType | null = phase === 'break'
    ? value.breakType === 'long' ? 'long' : 'short'
    : null;
  const phaseDuration = isRunning
    ? (() => {
        const savedDuration = toFiniteNumber(value.phaseDuration);
        return savedDuration !== null && savedDuration > 0
          ? Math.round(savedDuration)
          : getPhaseDuration(phase, breakType, settings);
      })()
    : getPhaseDuration('idle', null, settings);
  const timeRemaining = isRunning
    ? (() => {
        const savedTime = toFiniteNumber(value.timeRemaining);
        const nextTime = savedTime === null ? phaseDuration : Math.round(savedTime);
        return Math.min(phaseDuration, Math.max(0, nextTime));
      })()
    : phaseDuration;
  const savedStartedAt = toDate(value.phaseStartedAt);
  const phaseStartedAt = isRunning
    ? (savedStartedAt ?? new Date(Date.now() - (phaseDuration - timeRemaining) * 1000)).toISOString()
    : undefined;
  const savedSessions = toFiniteNumber(value.sessionsCompleted);
  const sessionsCompleted = savedSessions === null
    ? 0
    : Math.min(settings.sessionsBeforeLongBreak, Math.max(0, Math.round(savedSessions)));
  const taskId = typeof value.taskId === 'string' && value.taskId.length > 0 ? value.taskId : undefined;
  const taskTitle = typeof value.taskTitle === 'string' && value.taskTitle.length > 0 ? value.taskTitle : undefined;

  return {
    phase,
    timeRemaining,
    isRunning,
    sessionsCompleted,
    breakType,
    ...(taskId ? { taskId } : {}),
    ...(taskTitle ? { taskTitle } : {}),
    ...(phaseStartedAt ? { phaseStartedAt } : {}),
    phaseDuration,
  };
}

function getPhaseStartedAt(state: PomodoroState, now: Date): Date {
  const savedStartedAt = toDate(state.phaseStartedAt);
  const elapsedSeconds = Math.max(0, state.phaseDuration - state.timeRemaining);
  return savedStartedAt ?? new Date(now.getTime() - elapsedSeconds * 1000);
}

export function usePomodoro() {
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_POMODORO_SETTINGS);
  const [state, setState] = useState<PomodoroState>(() => createIdleState(DEFAULT_POMODORO_SETTINGS));
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [initialized, setInitialized] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const stateRef = useRef(state);
  const settingsRef = useRef(settings);
  const sessionsRef = useRef(sessions);

  const saveState = useCallback((newState: PomodoroState) => {
    stateRef.current = newState;
    setState(newState);
    storage.pomodoroState.set(newState);
  }, []);

  const saveSessions = useCallback((newSessions: PomodoroSession[]) => {
    sessionsRef.current = newSessions;
    setSessions(newSessions);
    storage.pomodoroSessions.set(newSessions);
  }, []);

  const saveSettings = useCallback((newSettings: PomodoroSettings) => {
    settingsRef.current = newSettings;
    setSettings(newSettings);
    storage.pomodoroSettings.set(newSettings);
  }, []);

  useEffect(() => {
    const savedSettings = storage.pomodoroSettings.get();
    const savedSessions = storage.pomodoroSessions.get();
    const savedState = normalizeState(storage.pomodoroState.get(), savedSettings);

    settingsRef.current = savedSettings;
    sessionsRef.current = savedSessions;
    stateRef.current = savedState;
    setSettings(savedSettings);
    setSessions(savedSessions);
    setState(savedState);
    storage.pomodoroSettings.set(savedSettings);
    storage.pomodoroSessions.set(savedSessions);
    storage.pomodoroState.set(savedState);
    setInitialized(true);
  }, []);

  const tick = useCallback(() => {
    const current = stateRef.current;
    if (!current.isRunning) return;

    const now = new Date();
    if (current.timeRemaining > 1) {
      saveState({ ...current, timeRemaining: current.timeRemaining - 1 });
      return;
    }

    if (current.phase === 'work') {
      const startedAt = getPhaseStartedAt(current, now);
      const session: PomodoroSession = {
        id: generateId(),
        ...(current.taskId ? { taskId: current.taskId } : {}),
        ...(current.taskTitle ? { taskTitle: current.taskTitle } : {}),
        durationMinutes: current.phaseDuration / 60,
        completed: true,
        startedAt,
        endedAt: now,
      };
      const completedSessions = current.sessionsCompleted + 1;
      const breakType: PomodoroBreakType = completedSessions >= settingsRef.current.sessionsBeforeLongBreak
        ? 'long'
        : 'short';
      const breakDuration = getPhaseDuration('break', breakType, settingsRef.current);
      const nextState: PomodoroState = {
        phase: 'break',
        timeRemaining: breakDuration,
        isRunning: true,
        sessionsCompleted: completedSessions,
        breakType,
        ...(current.taskId ? { taskId: current.taskId } : {}),
        ...(current.taskTitle ? { taskTitle: current.taskTitle } : {}),
        phaseStartedAt: now.toISOString(),
        phaseDuration: breakDuration,
      };
      saveSessions([session, ...sessionsRef.current]);
      saveState(nextState);
      return;
    }

    if (current.phase === 'break') {
      const workDuration = getPhaseDuration('idle', null, settingsRef.current);
      const nextState: PomodoroState = {
        phase: 'idle',
        timeRemaining: workDuration,
        isRunning: false,
        sessionsCompleted: current.breakType === 'long' ? 0 : current.sessionsCompleted,
        breakType: null,
        ...(current.taskId ? { taskId: current.taskId } : {}),
        ...(current.taskTitle ? { taskTitle: current.taskTitle } : {}),
        phaseDuration: workDuration,
      };
      saveState(nextState);
    }
  }, [saveSessions, saveState]);

  useEffect(() => {
    if (initialized && state.isRunning) {
      intervalRef.current = window.setInterval(tick, 1000);
    } else if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [initialized, state.isRunning, tick]);

  const start = useCallback(() => {
    const current = stateRef.current;
    if (current.phase !== 'idle' || current.isRunning) return;

    const phaseDuration = getPhaseDuration('work', null, settingsRef.current);
    saveState({
      ...current,
      phase: 'work',
      timeRemaining: phaseDuration,
      isRunning: true,
      breakType: null,
      phaseStartedAt: new Date().toISOString(),
      phaseDuration,
    });
  }, [saveState]);

  const cancel = useCallback(() => {
    const current = stateRef.current;
    if (!current.isRunning || current.phase === 'idle') return;

    const now = new Date();
    if (current.phase === 'work') {
      const startedAt = getPhaseStartedAt(current, now);
      const durationMinutes = Math.max(1, Math.round((now.getTime() - startedAt.getTime()) / 60000));
      const session: PomodoroSession = {
        id: generateId(),
        ...(current.taskId ? { taskId: current.taskId } : {}),
        ...(current.taskTitle ? { taskTitle: current.taskTitle } : {}),
        durationMinutes,
        completed: false,
        startedAt,
        endedAt: now,
      };
      saveSessions([session, ...sessionsRef.current]);
    }

    const workDuration = getPhaseDuration('idle', null, settingsRef.current);
    saveState({
      phase: 'idle',
      timeRemaining: workDuration,
      isRunning: false,
      sessionsCompleted: current.phase === 'break' && current.breakType === 'long' ? 0 : current.sessionsCompleted,
      breakType: null,
      phaseDuration: workDuration,
    });
  }, [saveSessions, saveState]);

  const skipBreak = useCallback(() => {
    const current = stateRef.current;
    if (!current.isRunning || current.phase !== 'break') return;

    const workDuration = getPhaseDuration('idle', null, settingsRef.current);
    saveState({
      phase: 'idle',
      timeRemaining: workDuration,
      isRunning: false,
      sessionsCompleted: current.breakType === 'long' ? 0 : current.sessionsCompleted,
      breakType: null,
      ...(current.taskId ? { taskId: current.taskId } : {}),
      ...(current.taskTitle ? { taskTitle: current.taskTitle } : {}),
      phaseDuration: workDuration,
    });
  }, [saveState]);

  const selectTask = useCallback((taskId?: string, taskTitle?: string) => {
    const current = stateRef.current;
    if (current.isRunning) return;

    saveState({
      ...current,
      taskId: taskId || undefined,
      taskTitle: taskId ? taskTitle : undefined,
    });
  }, [saveState]);

  const updateSettings = useCallback((newSettings: PomodoroSettings) => {
    const normalizedSettings = normalizeSettings(newSettings);
    saveSettings(normalizedSettings);

    const current = stateRef.current;
    if (current.phase === 'idle' && !current.isRunning) {
      const phaseDuration = getPhaseDuration('idle', null, normalizedSettings);
      saveState({
        ...current,
        timeRemaining: phaseDuration,
        phaseDuration,
      });
    }
  }, [saveSettings, saveState]);

  const resetSettings = useCallback(() => {
    updateSettings(DEFAULT_POMODORO_SETTINGS);
  }, [updateSettings]);

  const getProgress = useCallback(() => {
    const current = stateRef.current;
    if (current.phaseDuration <= 0) return 0;
    return Math.min(100, Math.max(0, ((current.phaseDuration - current.timeRemaining) / current.phaseDuration) * 100));
  }, []);

  const getPhaseLabel = useCallback(() => PHASE_LABELS[state.phase], [state.phase]);
  const progress = state.phaseDuration > 0
    ? Math.min(100, Math.max(0, ((state.phaseDuration - state.timeRemaining) / state.phaseDuration) * 100))
    : 0;
  const currentSessionNumber = Math.min(
    settings.sessionsBeforeLongBreak,
    Math.max(1, state.sessionsCompleted + 1),
  );
  const nextBreakLabel = state.sessionsCompleted + 1 >= settings.sessionsBeforeLongBreak
    ? 'Long break'
    : 'Short break';

  return {
    state,
    sessions,
    settings,
    initialized,
    start,
    cancel,
    skipBreak,
    selectTask,
    updateSettings,
    resetSettings,
    getPhaseLabel,
    getProgress,
    progress,
    currentSessionNumber,
    nextBreakLabel,
  };
}
