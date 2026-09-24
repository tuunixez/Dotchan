import { useState } from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { Icon } from '../ui/Icon';
import { formatHours } from '../../utils/date';
import type { PomodoroSession } from '../../types';

interface SessionLogProps {
  sessions: PomodoroSession[];
}

type SessionWithLegacyPhase = PomodoroSession & { phase?: string };

export function SessionLog({ sessions }: SessionLogProps) {
  const [showAll, setShowAll] = useState(false);
  const workSessions = sessions.filter(session => {
    const legacyPhase = (session as SessionWithLegacyPhase).phase;
    return legacyPhase === undefined || legacyPhase === 'work';
  });
  const displayedSessions = showAll ? workSessions : workSessions.slice(0, 10);
  const totalFocusMinutes = workSessions
    .filter(session => session.completed)
    .reduce((total, session) => total + session.durationMinutes, 0);

  if (workSessions.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-300">
        <Icon icon={Clock} size={32} className="mx-auto mb-2 text-neutral-600" />
        <p className="text-sm">No Pomodoro sessions logged yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-medium text-neutral-100 mb-6">Recent Sessions</h3>
        <span className="text-xs text-neutral-500">{formatHours(totalFocusMinutes)} total focus</span>
      </div>

      <ul className="space-y-2" role="list">
        {displayedSessions.map(session => {
          const endedAt = new Date(session.endedAt);
          const endedAtLabel = Number.isNaN(endedAt.getTime()) ? 'Unknown date' : endedAt.toLocaleString();
          const status = session.completed ? 'Completed' : 'Partial';

          return (
            <li
              key={session.id}
              className="flex items-center justify-between p-3 bg-neutral-950 border border-neutral-900 rounded-xl hover:bg-neutral-900"
            >
              <div className="flex items-center gap-3">
                <Icon
                  icon={session.completed ? CheckCircle2 : Clock}
                  size={16}
                  className={session.completed ? 'text-neutral-400' : 'text-neutral-600'}
                />
                <div>
                  <p className="text-sm text-neutral-100">{session.durationMinutes} min · {status}</p>
                  <p className="text-xs text-neutral-500">
                    {session.taskTitle && `${session.taskTitle} • `}
                    {endedAtLabel}
                  </p>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  session.completed ? 'bg-neutral-800 text-neutral-200' : 'bg-neutral-900 text-neutral-400'
                }`}
              >
                {status}
              </span>
            </li>
          );
        })}
      </ul>

      {workSessions.length > 10 && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="rounded-lg px-2 py-1.5 text-sm text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100 transition-colors"
        >
          {showAll ? 'Show less' : `Show all (${workSessions.length})`}
        </button>
      )}
    </div>
  );
}
