import { useState, type FormEvent } from 'react';
import { Settings } from 'lucide-react';
import { usePomodoro } from '../hooks/usePomodoro';
import { useTasks } from '../hooks/useTasks';
import { PomodoroTimer } from '../components/pomodoro/PomodoroTimer';
import { SessionLog } from '../components/pomodoro/SessionLog';
import { TaskSelector } from '../components/pomodoro/TaskSelector';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { DEFAULT_POMODORO_SETTINGS, POMODORO_LIMITS } from '../types/pomodoro';
import type { PomodoroSettings } from '../types';

export function PomodoroPage() {
  const {
    state,
    sessions,
    settings,
    initialized,
    start,
    cancel,
    skipBreak,
    selectTask,
    updateSettings,
    progress,
    currentSessionNumber,
    nextBreakLabel,
  } = usePomodoro();
  const { tasks } = useTasks();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsDraft, setSettingsDraft] = useState<PomodoroSettings>(settings);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-full bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-700" />
      </div>
    );
  }

  const activeTasks = tasks.filter(task => !task.completed);
  const handleTaskChange = (value: string) => {
    const task = activeTasks.find(candidate => candidate.id === value);
    selectTask(value || undefined, task?.title);
  };
  const openSettings = () => {
    setSettingsDraft(settings);
    setSettingsOpen(true);
  };
  const saveSettings = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateSettings(settingsDraft);
    setSettingsOpen(false);
  };
  const updateDraft = (key: keyof PomodoroSettings, value: string) => {
    setSettingsDraft(current => ({ ...current, [key]: Number(value) }));
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={openSettings}
          className="text-neutral-500 hover:text-neutral-100"
          aria-label="Open Pomodoro settings"
        >
          <Settings size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <TaskSelector
            tasks={activeTasks}
            value={state.taskId ?? ''}
            onChange={handleTaskChange}
            disabled={state.isRunning}
          />
          <div className="mt-6">
            <PomodoroTimer
              state={state}
              settings={settings}
              currentSessionNumber={currentSessionNumber}
              nextBreakLabel={nextBreakLabel}
              progress={progress}
              onStart={start}
              onCancel={cancel}
              onSkipBreak={skipBreak}
            />
          </div>
        </div>
        <div>
          <SessionLog sessions={sessions} />
        </div>
      </div>

      <Modal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Pomodoro Settings"
        size="md"
      >
        <form onSubmit={saveSettings} className="space-y-4">
          <Input
            label="Work minutes"
            type="number"
            min={POMODORO_LIMITS.workMinutes.min}
            max={POMODORO_LIMITS.workMinutes.max}
            step={1}
            value={settingsDraft.workMinutes}
            onChange={event => updateDraft('workMinutes', event.target.value)}
          />
          <Input
            label="Short break minutes"
            type="number"
            min={POMODORO_LIMITS.shortBreakMinutes.min}
            max={POMODORO_LIMITS.shortBreakMinutes.max}
            step={1}
            value={settingsDraft.shortBreakMinutes}
            onChange={event => updateDraft('shortBreakMinutes', event.target.value)}
          />
          <Input
            label="Long break minutes"
            type="number"
            min={POMODORO_LIMITS.longBreakMinutes.min}
            max={POMODORO_LIMITS.longBreakMinutes.max}
            step={1}
            value={settingsDraft.longBreakMinutes}
            onChange={event => updateDraft('longBreakMinutes', event.target.value)}
          />
          <Input
            label="Sessions before long break"
            type="number"
            min={POMODORO_LIMITS.sessionsBeforeLongBreak.min}
            max={POMODORO_LIMITS.sessionsBeforeLongBreak.max}
            step={1}
            value={settingsDraft.sessionsBeforeLongBreak}
            onChange={event => updateDraft('sessionsBeforeLongBreak', event.target.value)}
          />

          <div className="flex items-center justify-between gap-3 pt-4 border-t border-neutral-900">
            <button
              type="button"
              onClick={() => setSettingsDraft({ ...DEFAULT_POMODORO_SETTINGS })}
              className="rounded-lg px-3 py-2 text-sm text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100"
            >
              Reset to defaults
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-neutral-100 text-black hover:bg-neutral-200 rounded-lg px-6 py-2 font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
