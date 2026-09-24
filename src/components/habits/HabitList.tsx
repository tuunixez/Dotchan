import { useState } from 'react';
import { Plus, HeartPulse } from 'lucide-react';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { HabitForm } from './HabitForm';
import { HabitCard } from './HabitCard';
import type { Habit } from '../../types';

interface HabitListProps {
  habits: Habit[];
  onAddHabit: (title: string, frequency: 'daily' | 'weekly') => void;
  onUpdateHabit: (id: string, updates: Partial<Habit>) => void;
  onDeleteHabit: (id: string) => void;
  onToggleDaily: (id: string, dateKey: string) => void;
  onToggleWeekly: (id: string) => void;
}

export function HabitList({
  habits,
  onAddHabit,
  onUpdateHabit,
  onDeleteHabit,
  onToggleDaily,
  onToggleWeekly,
}: HabitListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const handleFormSubmit = (title: string, frequency: 'daily' | 'weekly') => {
    if (editingHabit) {
      onUpdateHabit(editingHabit.id, { title, frequency });
    } else {
      onAddHabit(title, frequency);
    }
    setEditingHabit(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="primary" onClick={() => { setEditingHabit(null); setShowForm(true); }}>
          <Icon icon={Plus} size={18} />
          New Habit
        </Button>
      </div>

      {habits.length === 0 ? (
        <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-6 py-12 text-center text-neutral-500">
          <Icon icon={HeartPulse} size={48} className="mx-auto mb-4 text-neutral-500" />
          <p className="text-lg text-neutral-100">No habits yet</p>
          <p className="text-sm text-neutral-400 mt-1">Create your first habit to start building streaks</p>
        </div>
      ) : (
        <div className="space-y-4">
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onEdit={setEditingHabit}
              onDelete={onDeleteHabit}
              onToggleDaily={onToggleDaily}
              onToggleWeekly={onToggleWeekly}
            />
          ))}
        </div>
      )}

      <HabitForm
        isOpen={showForm || !!editingHabit}
        onClose={() => { setShowForm(false); setEditingHabit(null); }}
        onSubmit={handleFormSubmit}
        initialData={editingHabit || undefined}
        isEditing={!!editingHabit}
      />
    </div>
  );
}