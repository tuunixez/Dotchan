import { useState } from 'react';
import { Plus, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { TaskForm } from './TaskForm';
import { TaskItem } from './TaskItem';
import type { Task, Priority } from '../../types';

interface TaskListProps {
  tasks: Task[];
  activeTasks: Task[];
  completedTasks: Task[];
  onAddTask: (title: string, description?: string, priority?: Priority, dueDate?: string) => void;
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskList({
  activeTasks,
  completedTasks,
  onAddTask,
  onToggleTask,
  onEditTask,
  onDeleteTask,
}: TaskListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [showHistory, setShowHistory] = useState(false);

  const getFilteredTasks = () => {
    switch (filter) {
      case 'all':
        return [...activeTasks, ...completedTasks];
      case 'active':
        return activeTasks;
      case 'completed':
        return completedTasks;
      default:
        return activeTasks;
    }
  };

  const getFilterLabel = (filterValue: string): 'all' | 'active' | 'completed' => {
    const validFilters: ('all' | 'active' | 'completed')[] = ['all', 'active', 'completed'];
    return validFilters.includes(filterValue as ('all' | 'active' | 'completed'))
      ? filterValue as ('all' | 'active' | 'completed')
      : 'all';
  };

  const filteredTasks = getFilteredTasks();

  const handleFormSubmit = (title: string, description?: string, priority: Priority = 'medium', dueDate?: string) => {
    if (editingTask) {
      // For editing, we'd need an update function - for now just add new
      onAddTask(title, description, priority, dueDate);
    } else {
      onAddTask(title, description, priority, dueDate);
    }
    setEditingTask(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="primary" onClick={() => { setEditingTask(null); setShowForm(true); }}>
            <Icon icon={Plus} size={18} />
            New Task
          </Button>
          <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-900 rounded-lg p-1">
            {['all', 'active', 'completed'].map(f => {
              const currentFilter = getFilterLabel(f);
              return (
                <button
                  key={f}
                  onClick={() => setFilter(currentFilter)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    filter === currentFilter
                      ? 'bg-neutral-100 text-black'
                      : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              );
            })}
          </div>
        </div>
        <Button variant="ghost" onClick={() => setShowHistory(!showHistory)}>
          <Icon icon={CheckCircle2} size={18} />
          History
        </Button>
      </div>

      {showHistory ? (
        <TaskHistorySection tasks={completedTasks} onToggleTask={onToggleTask} onDeleteTask={onDeleteTask} />
      ) : (
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              {filter === 'completed'
                ? 'No completed tasks yet. Keep going!'
                : filter === 'active'
                ? 'No active tasks. Great job!'
                : 'No tasks yet. Create your first task to get started.'}
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggleTask}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))
          )}
        </div>
      )}

      <TaskForm
        isOpen={showForm || !!editingTask}
        onClose={() => { setShowForm(false); setEditingTask(null); }}
        onSubmit={handleFormSubmit}
        initialData={editingTask || undefined}
        isEditing={!!editingTask}
      />
    </div>
  );
}

function TaskHistorySection({ tasks, onToggleTask, onDeleteTask }: { tasks: Task[]; onToggleTask: (id: string) => void; onDeleteTask: (id: string) => void }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500">
        No completed tasks in history yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-2xl font-medium text-neutral-100 mb-6">Completed History</h3>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggleTask}
          onEdit={undefined as unknown as (task: Task) => void}
          onDelete={onDeleteTask}
        />
      ))}
    </div>
  );
}