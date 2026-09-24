import { Select } from '../ui/Select';
import { Icon } from '../ui/Icon';
import { Target } from 'lucide-react';
import type { Task } from '../../types';

interface TaskSelectorProps {
  tasks: Task[];
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export function TaskSelector({ tasks, value, onChange, disabled }: TaskSelectorProps) {
  const options = [
    { value: '', label: 'No task selected (free focus)' },
    ...tasks.map(task => ({ value: task.id, label: task.title })),
  ];

  return (
    <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-6 hover:bg-neutral-900">
      <h3 className="text-2xl font-medium text-neutral-100 mb-6 flex items-center gap-2">
        <Icon icon={Target} size={16} className="text-neutral-600" />
        Attach to task
      </h3>
      <Select
        value={value}
        onChange={event => onChange(event.target.value)}
        options={options}
        aria-label="Link Pomodoro session to task"
        disabled={disabled}
        className="bg-neutral-950 rounded-lg hover:bg-neutral-900"
      />
    </div>
  );
}
