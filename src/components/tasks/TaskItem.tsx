import { format } from 'date-fns';
import { parseISO } from 'date-fns';
import { MoreVertical, Trash2, Edit, Calendar } from 'lucide-react';
import { useState } from 'react';
import { Icon } from '../ui/Icon';
import type { Task } from '../../types';
import { PRIORITY_COLORS } from '../../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const isOverdue = task.dueDate && !task.completed && parseISO(task.dueDate) < new Date();

  return (
    <div className="group relative bg-neutral-950 border border-neutral-900 rounded-xl p-6 transition-colors hover:bg-neutral-900 hover:border-neutral-800">
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className={`
            flex-shrink-0 mt-1 w-5 h-5 rounded border-2 transition-colors
            ${task.completed
              ? 'bg-neutral-100 border-neutral-100 text-black'
              : 'border-neutral-700 hover:border-neutral-500'
            }
          `}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.completed && (
            <svg className="w-4 h-4 mx-auto my-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <h3 className={`
              flex-1 font-medium text-sm leading-relaxed transition-colors
              ${task.completed ? 'text-neutral-500 line-through' : 'text-neutral-100'}
            `}>
              {task.title}
            </h3>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full border border-neutral-800 bg-neutral-950 ${PRIORITY_COLORS[task.priority]}`}>
              {task.priority}
            </span>
          </div>

          {task.description && (
            <p className={`mt-1 text-sm leading-relaxed ${task.completed ? 'text-neutral-500' : 'text-neutral-300'}`}>
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <Icon icon={Calendar} size={12} />
              Created {format(parseISO(task.createdAt), 'MMM d, yyyy')}
            </span>
            {task.dueDate && (
              <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-400' : 'text-neutral-500'}`}>
                <Icon icon={Calendar} size={12} />
                Due {format(parseISO(task.dueDate), 'MMM d, yyyy')}
              </span>
            )}
            {task.completed && task.completedAt && (
              <span className="flex items-center gap-1">
                <Icon icon={Calendar} size={12} />
                Completed {format(parseISO(task.completedAt), 'MMM d, yyyy')}
              </span>
            )}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={e => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="p-1 text-neutral-500 hover:text-neutral-100 hover:bg-neutral-900 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            aria-label="More options"
          >
            <Icon icon={MoreVertical} size={18} />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 bg-neutral-950 border border-neutral-900 rounded-lg py-1 min-w-[140px]">
                <button
                  onClick={() => { onEdit(task); setShowMenu(false); }}
                  className="w-full px-3 py-2 text-left text-sm rounded-lg text-neutral-100 hover:bg-neutral-900 flex items-center gap-2"
                >
                  <Icon icon={Edit} size={16} />
                  Edit
                </button>
                <button
                  onClick={() => { onDelete(task.id); setShowMenu(false); }}
                  className="w-full px-3 py-2 text-left text-sm rounded-lg text-red-400 hover:bg-neutral-900 flex items-center gap-2"
                >
                  <Icon icon={Trash2} size={16} />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}