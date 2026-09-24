import { useState, FormEvent } from 'react';
import { Plus, CheckCircle2, Trash2, Edit } from 'lucide-react';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Modal } from '../ui/Modal';
import type { Milestone } from '../../types';

interface MilestoneListProps {
  milestones: Milestone[];
  onAddMilestone: (title: string) => void;
  onToggleMilestone: (id: string) => void;
  onEditMilestone: (milestone: Milestone) => void;
  onDeleteMilestone: (id: string) => void;
}

export function MilestoneList({ milestones, onAddMilestone, onToggleMilestone, onEditMilestone, onDeleteMilestone }: MilestoneListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    if (editingMilestone) {
      onEditMilestone({ ...editingMilestone, title: newTitle.trim() });
    } else {
      onAddMilestone(newTitle.trim());
    }
    setNewTitle('');
    setShowForm(false);
    setEditingMilestone(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-2xl font-medium text-neutral-100 mb-6">Milestones</h4>
        <Button variant="ghost" size="sm" onClick={() => { setEditingMilestone(null); setShowForm(true); }}>
          <Icon icon={Plus} size={16} />
          Add
        </Button>
      </div>

      {milestones.length === 0 ? (
        <p className="text-sm text-neutral-500 text-center py-4">No milestones yet. Add one to track progress.</p>
      ) : (
        <ul className="space-y-2" role="list">
          {milestones.map(milestone => (
            <li key={milestone.id} className="flex items-center gap-3 p-3 bg-neutral-950 border border-neutral-900 rounded-xl group transition-colors hover:bg-neutral-900 hover:border-neutral-800">
              <button
                onClick={() => onToggleMilestone(milestone.id)}
                className={`
                  flex-shrink-0 w-5 h-5 rounded border-2 transition-colors
                  ${milestone.completed
                    ? 'bg-neutral-100 border-neutral-100 text-black'
                    : 'border-neutral-700 hover:border-neutral-500'
                  }
                `}
                aria-label={milestone.completed ? 'Mark incomplete' : 'Mark complete'}
              >
                {milestone.completed && (
                  <Icon icon={CheckCircle2} size={16} className="mx-auto my-[1px]" />
                )}
              </button>
              <span className={`
                flex-1 text-sm transition-colors
                ${milestone.completed ? 'text-neutral-500 line-through' : 'text-neutral-100'}
              `}>
                {milestone.title}
              </span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => { setEditingMilestone(milestone); setNewTitle(milestone.title); setShowForm(true); }}
                  className="p-1 text-neutral-500 hover:text-neutral-100 hover:bg-neutral-900 rounded-lg"
                  aria-label="Edit milestone"
                >
                  <Icon icon={Edit} size={14} />
                </button>
                <button
                  onClick={() => onDeleteMilestone(milestone.id)}
                  className="p-1 text-neutral-500 hover:text-red-400 hover:bg-neutral-900 rounded-lg"
                  aria-label="Delete milestone"
                >
                  <Icon icon={Trash2} size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingMilestone(null); setNewTitle(''); }}
        title={editingMilestone ? 'Edit Milestone' : 'New Milestone'}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Milestone title"
            autoFocus
            className="w-full px-3 py-2 bg-neutral-950 border border-neutral-900 hover:border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-700 focus:border-neutral-700 disabled:text-neutral-600"
            required
          />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditingMilestone(null); setNewTitle(''); }}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingMilestone ? 'Save' : 'Add'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
