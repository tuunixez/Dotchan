import { Clock } from 'lucide-react';
import { Icon } from '../ui/Icon';
import { formatHours } from '../../utils/date';

interface FocusHoursCardProps {
  hours: number;
}

export function FocusHoursCard({ hours }: FocusHoursCardProps) {
  return (
    <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-6 text-center hover:bg-neutral-900">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Icon icon={Clock} size={24} className="text-neutral-600" />
        <h3 className="text-2xl font-medium text-neutral-100 mb-6">Today's Focus</h3>
      </div>
      <div className="text-5xl font-medium font-mono text-neutral-100 mb-2">
        {formatHours(hours * 60)}
      </div>
      <p className="text-sm text-neutral-500">Total focus time from Pomodoro sessions</p>
    </div>
  );
}
