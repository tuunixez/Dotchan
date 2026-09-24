import type { ComponentProps } from 'react';
import { useGoals } from '../hooks/useGoals';
import { GoalList } from '../components/goals';

export function GoalsPage() {
  const { goals, initialized, addGoal, updateGoal, deleteGoal, addMilestone, toggleMilestone, deleteMilestone, updateMilestone } = useGoals();

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-full bg-black">
        <div className="rounded-full h-8 w-8 border-2 border-neutral-700" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <GoalList
        goals={goals}
        onAddGoal={addGoal}
        onUpdateGoal={updateGoal}
        onDeleteGoal={deleteGoal}
        onAddMilestone={addMilestone}
        onToggleMilestone={toggleMilestone}
        onEditMilestone={((goalId: string, milestoneId: string, title: string) => updateMilestone(goalId, milestoneId, title)) as unknown as ComponentProps<typeof GoalList>['onEditMilestone']}
        onDeleteMilestone={deleteMilestone}
      />
    </div>
  );
}