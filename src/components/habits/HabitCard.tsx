import { MoreVertical, Trash2, Edit, HeartPulse, Calendar, Check } from 'lucide-react';
import { useState } from 'react';
import { Icon } from '../ui/Icon';
import { HabitWeekGrid } from './HabitWeekGrid';
import type { Habit } from '../../types';

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
  onToggleDaily: (id: string, dateKey: string) => void;
  onToggleWeekly: (id: string) => void;
}

export function HabitCard({ habit, onEdit, onDelete, onToggleDaily, onToggleWeekly }: HabitCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const weekKey = new Date().toISOString().split('T')[0];
  const isWeekChecked = habit.weeklyChecks[weekKey] ?? false;

  return (
    <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-6 transition-colors hover:bg-neutral-900">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Icon icon={HeartPulse} size={18} className="text-neutral-500 flex-shrink-0" />
            <h3 className="font-medium text-neutral-100 truncate">{habit.title}</h3>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full bg-neutral-900 text-neutral-400 border border-neutral-800 capitalize`}>
              {habit.frequency}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-neutral-400 mb-4">
            <span className="flex items-center gap-1">
              <Icon icon={Calendar} size={14} />
              {habit.streak} day{habit.streak !== 1 ? 's' : ''} streak
            </span>
            <span className="flex items-center gap-1">
              <Icon icon={Calendar} size={14} />
              Best: {habit.longestStreak}
            </span>
          </div>

          {habit.frequency === 'daily' ? (
            <HabitWeekGrid habit={habit} onToggleDay={dateKey => onToggleDaily(habit.id, dateKey)} />
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => onToggleWeekly(habit.id)}
                className={`
                   w-12 h-12 rounded-full border flex items-center justify-center transition-all
                   ${isWeekChecked
                     ? 'bg-neutral-100 border-neutral-100 text-black'
                      : 'border-neutral-800 bg-transparent text-neutral-400'
                   }
                `}
                aria-label={isWeekChecked ? 'Mark week incomplete' : 'Mark week complete'}
                aria-pressed={isWeekChecked}
              >
                {isWeekChecked && <Icon icon={Check} size={24} />}
              </button>
              <span className="text-sm text-neutral-400">
                {isWeekChecked ? 'Week completed!' : 'Click to complete this week'}
              </span>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={e => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="p-1 text-neutral-500 hover:text-neutral-100 hover:bg-neutral-900 rounded-lg transition-colors"
            aria-label="More options"
          >
            <Icon icon={MoreVertical} size={18} />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 bg-neutral-950 border border-neutral-800 rounded-lg py-1 min-w-[140px] animate-fade-in">
                <button
                  onClick={() => { onEdit(habit); setShowMenu(false); }}
                  className="w-full px-3 py-2 text-left text-sm text-neutral-100 hover:bg-neutral-900 flex items-center gap-2"
                >
                  <Icon icon={Edit} size={16} />
                  Edit Habit
                </button>
                <button
                  onClick={() => { onDelete(habit.id); setShowMenu(false); }}
                  className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-neutral-900 flex items-center gap-2"
                >
                  <Icon icon={Trash2} size={16} />
                  Delete Habit
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}