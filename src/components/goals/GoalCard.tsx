import { MoreVertical, Trash2, Edit, Target, CheckCircle2, Circle } from 'lucide-react';
import { useState } from 'react';
import { ProgressBar } from '../ui/ProgressBar';
import { Icon } from '../ui/Icon';
import { MilestoneList } from './MilestoneList';
import type { Goal } from '../../types';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onAddMilestone: (goalId: string, title: string) => void;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onEditMilestone: (milestone: { id: string; title: string; completed: boolean }) => void;
  onDeleteMilestone: (goalId: string, milestoneId: string) => void;
}

export function GoalCard({
  goal,
  onEdit,
  onDelete,
  onAddMilestone,
  onToggleMilestone,
  onEditMilestone,
  onDeleteMilestone,
}: GoalCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-6 transition-colors hover:bg-neutral-900 hover:border-neutral-800">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Icon icon={Target} size={18} className="text-neutral-500 flex-shrink-0" />
            <h3 className="font-medium text-neutral-100 truncate">{goal.title}</h3>
          </div>
          {goal.description && (
            <p className="text-sm text-neutral-300 mb-3 line-clamp-2">{goal.description}</p>
          )}
          <ProgressBar value={goal.progress} showLabel color="neutral" className="[&>div:last-child]:bg-neutral-900" />
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
              <div className="absolute right-0 top-full mt-1 z-20 bg-neutral-950 border border-neutral-900 rounded-lg py-1 min-w-[140px]">
                <button
                  onClick={() => { onEdit(goal); setShowMenu(false); }}
                  className="w-full px-3 py-2 text-left text-sm rounded-lg text-neutral-100 hover:bg-neutral-900 flex items-center gap-2"
                >
                  <Icon icon={Edit} size={16} />
                  Edit Goal
                </button>
                <button
                  onClick={() => { onDelete(goal.id); setShowMenu(false); }}
                  className="w-full px-3 py-2 text-left text-sm rounded-lg text-red-400 hover:bg-neutral-900 flex items-center gap-2"
                >
                  <Icon icon={Trash2} size={16} />
                  Delete Goal
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full mt-4 rounded-lg text-left text-sm text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100 flex items-center gap-2"
      >
        <Icon icon={expanded ? CheckCircle2 : Circle} size={16} />
        {expanded ? 'Hide milestones' : `${goal.milestones.length} milestone${goal.milestones.length !== 1 ? 's' : ''}`}
      </button>

      {expanded && (
        <MilestoneList
          milestones={goal.milestones}
          onAddMilestone={title => onAddMilestone(goal.id, title)}
          onToggleMilestone={id => onToggleMilestone(goal.id, id)}
          onEditMilestone={milestone => onEditMilestone(milestone)}
          onDeleteMilestone={id => onDeleteMilestone(goal.id, id)}
        />
      )}
    </div>
  );
}