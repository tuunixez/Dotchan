import { MOOD_OPTIONS } from '../../utils/constants';
import { MOOD_LABELS } from '../../types/journal';
import { ProgressBar } from '../ui/ProgressBar';
import type { Mood } from '../../types';

interface MoodChartProps {
  monthlyMood: Mood | null;
  moodCounts: Record<Mood, number>;
}

export function MoodChart({ monthlyMood, moodCounts }: MoodChartProps) {
  const total = MOOD_OPTIONS.reduce((sum, mood) => sum + (moodCounts[mood] ?? 0), 0);

  if (total === 0) {
    return (
      <div className="text-center py-8 text-neutral-300">
        <p className="text-sm">No journal entries this month</p>
        <p className="text-xs mt-1">Start journaling to track your mood</p>
      </div>
    );
  }

  const maxCount = Math.max(...MOOD_OPTIONS.map(mood => moodCounts[mood] ?? 0));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-medium text-neutral-50 mb-6">Monthly Mood</h3>
        {monthlyMood && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-50">
              {MOOD_LABELS[monthlyMood]}
            </span>
            <span className="text-xs text-neutral-500">(dominant)</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {MOOD_OPTIONS.map(mood => (
          <div key={mood} className="flex items-center gap-3">
            <span className="text-sm font-medium w-16 text-neutral-50">
              {MOOD_LABELS[mood]}
            </span>
            <ProgressBar
              value={moodCounts[mood] ?? 0}
              max={maxCount}
              color="neutral"
              className="flex-1 h-2 [&>div:last-child]:bg-neutral-900"
            />
            <span className="text-xs text-neutral-500 font-mono w-12 text-right">
              {moodCounts[mood] ?? 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
