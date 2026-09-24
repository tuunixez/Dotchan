import { formatTime } from '../../utils/date';
import { PHASE_LABELS } from '../../types/pomodoro';
import type { PomodoroSettings, PomodoroState } from '../../types';

interface PomodoroTimerProps {
  state: PomodoroState;
  settings: PomodoroSettings;
  currentSessionNumber: number;
  nextBreakLabel: string;
  progress: number;
  onStart: () => void;
  onCancel: () => void;
  onSkipBreak: () => void;
}

export function PomodoroTimer({
  state,
  settings,
  currentSessionNumber,
  nextBreakLabel,
  progress,
  onStart,
  onCancel,
  onSkipBreak,
}: PomodoroTimerProps) {
  const isIdle = state.phase === 'idle' && !state.isRunning;
  const isWorkRunning = state.phase === 'work' && state.isRunning;
  const isBreakRunning = state.phase === 'break' && state.isRunning;
  const displayTime = isIdle ? settings.workMinutes * 60 : state.timeRemaining;
  const phaseDuration = isIdle ? settings.workMinutes * 60 : state.phaseDuration;
  const displayProgress = isIdle
    ? 0
    : Math.min(100, Math.max(0, phaseDuration > 0 ? progress : 0));

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-6 text-center hover:bg-neutral-900">
        <div className="mb-6">
          <span className="inline-block px-4 py-1.5 text-sm font-medium rounded-full bg-neutral-800 text-neutral-300">
            {PHASE_LABELS[state.phase]}
          </span>
        </div>

        <div className="text-6xl font-light text-neutral-100">
          {formatTime(displayTime)}
        </div>

        <div className="h-1.5 mt-6 bg-neutral-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-neutral-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${displayProgress}%` }}
            role="progressbar"
            aria-valuenow={Math.round(displayProgress)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          {isIdle && (
            <button
              type="button"
              onClick={onStart}
              className="bg-neutral-100 text-black hover:bg-neutral-200 rounded-lg px-6 py-2 font-medium"
            >
              Start
            </button>
          )}
          {isWorkRunning && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-neutral-900 hover:bg-neutral-800 text-neutral-100 border border-neutral-800 rounded-lg px-6 py-2"
            >
              Cancel
            </button>
          )}
          {isBreakRunning && (
            <>
              <button
                type="button"
                onClick={onSkipBreak}
                className="bg-neutral-900 hover:bg-neutral-800 text-neutral-100 border border-neutral-800 rounded-lg px-6 py-2"
              >
                Skip break
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="bg-neutral-900 hover:bg-neutral-800 text-neutral-100 border border-neutral-800 rounded-lg px-6 py-2"
              >
                Cancel
              </button>
            </>
          )}
        </div>

        {isIdle && (
          <p className="mt-6 text-sm text-neutral-500">
            Session {currentSessionNumber} of {settings.sessionsBeforeLongBreak} · Next: {nextBreakLabel}
          </p>
        )}
      </div>
    </div>
  );
}
