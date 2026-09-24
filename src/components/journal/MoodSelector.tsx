import { MOOD_OPTIONS } from '../../utils/constants';
import { MOOD_LABELS } from '../../types';
import type { Mood } from '../../types';

interface MoodSelectorProps {
  mood: Mood;
  setMood: (mood: Mood) => void;
}

export function MoodSelector({ mood, setMood }: MoodSelectorProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {MOOD_OPTIONS.map(value => {
        const label = MOOD_LABELS[value];
        const isSelected = mood === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => setMood(value)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${isSelected
              ? 'border-neutral-100 bg-neutral-100 text-black'
              : 'border-neutral-900 bg-neutral-950 text-neutral-500 hover:bg-neutral-900 hover:text-neutral-300'}`}
            aria-pressed={isSelected}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
