import { Clock, Flame } from 'lucide-react';
import { Icon } from '../ui/Icon';
import { formatHours } from '../../utils/date';
import type { PomodoroSession } from '../../types/pomodoro';

interface PomodoroStatsProps {
  sessions: PomodoroSession[];
}

function getDateKey(date: Date): string | null {
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

type SessionWithLegacyPhase = PomodoroSession & { phase?: string };

function isWorkSession(session: PomodoroSession): boolean {
  const phase = (session as SessionWithLegacyPhase).phase;
  return phase === undefined || phase === 'work';
}

export function PomodoroStats({ sessions }: PomodoroStatsProps) {
  const workSessions = sessions.filter(isWorkSession);
  const completedWorkSessions = workSessions.filter(session => session.completed);
  const partialWorkSessions = workSessions.filter(session => !session.completed);
  const totalCompletedFocusMinutes = completedWorkSessions.reduce(
    (total, session) => total + session.durationMinutes,
    0,
  );
  const totalPartialFocusMinutes = partialWorkSessions.reduce(
    (total, session) => total + session.durationMinutes,
    0,
  );

  let streak = 0;
  const today = new Date();

  for (let offset = 0; offset < 365; offset += 1) {
    const checkDate = new Date(today);
    checkDate.setUTCDate(checkDate.getUTCDate() - offset);
    const dateKey = getDateKey(checkDate);
    const hasCompletedSession = dateKey !== null && completedWorkSessions.some(session => {
      const sessionDate = getDateKey(new Date(session.endedAt));
      return sessionDate === dateKey;
    });

    if (hasCompletedSession) {
      streak += 1;
    } else if (offset > 0) {
      break;
    }
  }

  const stats = [
    { label: 'Focus Hours', value: formatHours(totalCompletedFocusMinutes), icon: Clock },
    { label: 'Partial Focus', value: formatHours(totalPartialFocusMinutes), icon: Clock },
    { label: 'Completed Sessions', value: completedWorkSessions.length.toString(), icon: Flame },
    { label: 'Current Streak', value: `${streak} days`, icon: Flame },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-neutral-950 border border-neutral-900 rounded-xl p-6 hover:bg-neutral-900">
          <div className="flex items-center gap-3 mb-2">
            <Icon icon={stat.icon} size={20} className="text-neutral-400" />
            <span className="text-sm text-neutral-400">{stat.label}</span>
          </div>
          <div className="text-2xl font-medium text-neutral-50 font-mono">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
