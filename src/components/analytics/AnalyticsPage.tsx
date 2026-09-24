import { useTasks } from '../../hooks/useTasks';
import { useHabits } from '../../hooks/useHabits';
import { useJournal } from '../../hooks/useJournal';
import { usePomodoro } from '../../hooks/usePomodoro';
import { Zap } from 'lucide-react';
import { FocusHoursCard } from './FocusHoursCard';
import { TaskTimeChart } from './TaskTimeChart';
import { MoodChart } from './MoodChart';
import { PomodoroStats } from './PomodoroStats';
import { formatHours } from '../../utils/date';
import type { Mood, PomodoroSession } from '../../types';

function getDateKey(value: Date | string): string | null {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}

function isWorkSession(session: PomodoroSession): boolean {
  const phase = (session as PomodoroSession & { phase?: string }).phase;
  return phase === undefined || phase === 'work';
}

export function AnalyticsPage() {
  const { tasks } = useTasks();
  const { habits } = useHabits();
  const { entries, getMonthlyMood } = useJournal();
  const { sessions } = usePomodoro();

  const today = getDateKey(new Date()) ?? '';
  const workSessions = sessions.filter(isWorkSession);
  const completedWorkSessions = workSessions.filter(session => session.completed);
  const todayCompletedWorkSessions = completedWorkSessions.filter(
    session => getDateKey(session.endedAt)?.startsWith(today),
  );
  const todayFocusMinutes = todayCompletedWorkSessions.reduce(
    (total, session) => total + session.durationMinutes,
    0,
  );
  const todayFocusHours = todayFocusMinutes / 60;

  const completedTaskTimes: Record<string, number> = {};
  const partialTaskTimes: Record<string, number> = {};
  workSessions
    .filter(session => session.taskId)
    .forEach(session => {
      if (!session.taskId) return;
      const target = session.completed ? completedTaskTimes : partialTaskTimes;
      target[session.taskId] = (target[session.taskId] || 0) + session.durationMinutes;
    });

  const monthKey = today.substring(0, 7);
  const monthlyMood = getMonthlyMood(monthKey);

  const moodCounts: Record<Mood, number> = {
    awful: 0, bad: 0, okay: 0, good: 0, great: 0,
  };
  entries
    .filter(entry => entry.date.startsWith(monthKey))
    .forEach(entry => {
      moodCounts[entry.mood] += 1;
    });

  const monthlyCompletedWorkSessions = completedWorkSessions.filter(
    session => getDateKey(session.endedAt)?.startsWith(monthKey),
  );
  const monthFocusMinutes = monthlyCompletedWorkSessions.reduce(
    (total, session) => total + session.durationMinutes,
    0,
  );
  const allTimeFocusMinutes = completedWorkSessions.reduce(
    (total, session) => total + session.durationMinutes,
    0,
  );

  const totalHabits = habits.length;
  const activeDailyHabits = habits.filter(habit => habit.frequency === 'daily').length;
  const activeWeeklyHabits = habits.filter(habit => habit.frequency === 'weekly').length;
  const longestStreak = Math.max(...habits.map(habit => habit.longestStreak), 0);

  const activeTasks = tasks.filter(task => !task.completed).length;
  const completedToday = tasks.filter(task => task.completed && task.completedAt?.startsWith(today)).length;
  const totalCompleted = tasks.filter(task => task.completed).length;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <div className="bg-neutral-950 border border-neutral-900 rounded-xl overflow-hidden h-[400px] flex items-center justify-center hover:bg-neutral-900">
            <Zap className="w-20 h-20 text-neutral-700" aria-hidden="true" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <FocusHoursCard hours={todayFocusHours} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-6 hover:bg-neutral-900">
              <h3 className="text-2xl font-medium text-neutral-100 mb-6">Task Summary</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-medium text-neutral-100 font-mono">{activeTasks}</div>
                  <div className="text-xs text-neutral-500">Active</div>
                </div>
                <div>
                  <div className="text-2xl font-medium text-emerald-400 font-mono">{completedToday}</div>
                  <div className="text-xs text-neutral-500">Done Today</div>
                </div>
                <div>
                  <div className="text-2xl font-medium text-neutral-400 font-mono">{totalCompleted}</div>
                  <div className="text-xs text-neutral-500">All Time</div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-6 hover:bg-neutral-900">
              <h3 className="text-2xl font-medium text-neutral-100 mb-6">This Month</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-medium text-neutral-100 font-mono">{formatHours(monthFocusMinutes)}</div>
                  <div className="text-xs text-neutral-500">Focus Hours</div>
                </div>
                <div>
                  <div className="text-2xl font-medium text-emerald-400 font-mono">{entries.filter(entry => entry.date.startsWith(monthKey)).length}</div>
                  <div className="text-xs text-neutral-500">Journal Entries</div>
                </div>
                <div>
                  <div className="text-2xl font-medium text-neutral-400 font-mono">{monthlyCompletedWorkSessions.length}</div>
                  <div className="text-xs text-neutral-500">Pomodoros</div>
                </div>
              </div>
            </div>
          </div>

          <PomodoroStats sessions={sessions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-6 hover:bg-neutral-900">
            <TaskTimeChart
              tasks={tasks}
              completedTaskTimes={completedTaskTimes}
              partialTaskTimes={partialTaskTimes}
            />
          </div>

          <div className="mt-6 bg-neutral-950 border border-neutral-900 rounded-xl p-6 hover:bg-neutral-900">
            <h3 className="text-2xl font-medium text-neutral-100 mb-6">Habit Streaks</h3>
            <div className="space-y-3">
              {habits.length === 0 ? (
                <p className="text-sm text-neutral-500 text-center py-4">No habits yet</p>
              ) : (
                habits.map(habit => (
                  <div key={habit.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{habit.frequency === 'daily' ? '📅' : '📆'}</span>
                      <div>
                        <p className="text-sm text-neutral-100 truncate max-w-[180px]">{habit.title}</p>
                        <p className="text-xs text-neutral-500">
                          {habit.streak} day streak • Best: {habit.longestStreak}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-medium text-emerald-400">{habit.streak}</div>
                      <div className="text-xs text-neutral-500">current</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-6 hover:bg-neutral-900">
            <MoodChart monthlyMood={monthlyMood} moodCounts={moodCounts} />
          </div>

          <div className="mt-6 bg-neutral-950 border border-neutral-900 rounded-xl p-6 hover:bg-neutral-900">
            <h3 className="text-2xl font-medium text-neutral-100 mb-6">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-400">Total tasks created</span>
                <span className="text-neutral-100 font-mono">{tasks.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Total goals</span>
                <span className="text-neutral-100 font-mono">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Total habits</span>
                <span className="text-neutral-100 font-mono">{totalHabits} ({activeDailyHabits} daily, {activeWeeklyHabits} weekly)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Total journal entries</span>
                <span className="text-neutral-100 font-mono">{entries.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">All-time focus hours</span>
                <span className="text-neutral-100 font-mono">{formatHours(allTimeFocusMinutes)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Longest habit streak</span>
                <span className="text-neutral-100 font-mono">{longestStreak} days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
