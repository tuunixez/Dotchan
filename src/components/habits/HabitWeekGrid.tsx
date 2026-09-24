import { format, addDays, startOfWeek } from 'date-fns';
import { Check } from 'lucide-react';
import { Icon } from '../ui/Icon';
import type { Habit } from '../../types';
import { getDayOfWeek } from '../../utils/date';

interface HabitWeekGridProps {
  habit: Habit;
  onToggleDay: (dateKey: string) => void;
}

export function HabitWeekGrid({ habit, onToggleDay }: HabitWeekGridProps) {
  const todayIndex = getDayOfWeek();
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const weekData = dayLabels.map((day, index) => {
    const date = addDays(weekStart, index);
    const dateKey = format(date, 'yyyy-MM-dd');
    const checked = habit.dailyChecks[dateKey] ?? false;
    const isToday = index === todayIndex;
    const isFuture = date > new Date();

    return { day, index, checked, isToday, isFuture, dateKey };
  });

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {weekData.map(({ day, checked, isToday, isFuture, dateKey }) => (
        <button
          key={dateKey}
          onClick={() => !isFuture && onToggleDay(dateKey)}
          disabled={isFuture}
          className={`
             relative flex flex-col items-center gap-1.5 p-2 min-w-[44px] transition-all
             ${isToday ? 'ring-2 ring-neutral-700' : ''}
             ${checked ? 'text-neutral-100' : 'text-neutral-500'}
             ${isFuture ? 'text-neutral-600 cursor-not-allowed' : 'hover:text-neutral-100 cursor-pointer'}
          `}
          aria-label={`${day}: ${checked ? 'Completed' : 'Not completed'}`}
          aria-pressed={checked}
        >
          <div className={`
             w-10 h-10 rounded-full border flex items-center justify-center transition-all
             ${checked
               ? 'bg-neutral-100 border-neutral-100 text-black'
                : 'border-neutral-800 bg-transparent'
             }
             ${isToday ? 'ring-2 ring-neutral-700' : ''}
          `}>
            {checked && <Icon icon={Check} size={16} />}
          </div>
          <span className={`text-xs font-medium ${isFuture ? 'text-neutral-600' : isToday ? 'text-neutral-100' : 'text-neutral-400'}`}>
            {day}
          </span>
        </button>
      ))}
    </div>
  );
}