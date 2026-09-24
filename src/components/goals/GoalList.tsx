import { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { GoalForm } from './GoalForm';
import { GoalCard } from './GoalCard';
import type { Goal } from '../../types';

interface GoalListProps {
  goals: Goal[];
  onAddGoal: (title: string, description?: string) => void;
  onUpdateGoal: (id: string, updates: Partial<Goal>) => void;
  onDeleteGoal: (id: string) => void;
  onAddMilestone: (goalId: string, title: string) => void;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onEditMilestone: (milestone: { id: string; title: string; completed: boolean }) => void;
  onDeleteMilestone: (goalId: string, milestoneId: string) => void;
}

export function GoalList({
  goals,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
  onAddMilestone,
  onToggleMilestone,
  onEditMilestone,
  onDeleteMilestone,
}: GoalListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const handleFormSubmit = (title: string, description?: string) => {
    if (editingGoal) {
      onUpdateGoal(editingGoal.id, { title, description });
    } else {
      onAddGoal(title, description);
    }
    setEditingGoal(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="primary" onClick={() => { setEditingGoal(null); setShowForm(true); }}>
          <Icon icon={Plus} size={18} />
          New Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">
          <Icon icon={Target} size={48} className="mx-auto mb-4 text-neutral-600" />
          <p className="text-lg text-neutral-100">No goals yet</p>
          <p className="text-sm text-neutral-400 mt-1">Create your first goal to start tracking progress</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={setEditingGoal}
              onDelete={onDeleteGoal}
              onAddMilestone={onAddMilestone}
              onToggleMilestone={onToggleMilestone}
              onEditMilestone={onEditMilestone}
              onDeleteMilestone={onDeleteMilestone}
            />
          ))}
        </div>
      )}

      <GoalForm
        isOpen={showForm || !!editingGoal}
        onClose={() => { setShowForm(false); setEditingGoal(null); }}
        onSubmit={handleFormSubmit}
        initialData={editingGoal || undefined}
        isEditing={!!editingGoal}
      />
    </div>
  );
}