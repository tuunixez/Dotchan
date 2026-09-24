import { useTasks } from '../hooks/useTasks';
import { TaskList } from '../components/tasks';
import type { Task } from '../types';

export function TasksPage() {
  const { tasks, initialized, addTask, updateTask, toggleTask, deleteTask } = useTasks();

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-full bg-black">
        <div className="rounded-full h-8 w-8 border-2 border-neutral-700" />
      </div>
    );
  }

  const activeTasks = tasks.filter((t: { completed: boolean }) => !t.completed);
  const completedTasks = tasks.filter((t: { completed: boolean }) => t.completed);

  const handleEditTask = (task: Task) => {
    updateTask(task.id, { ...task });
  };

  return (
    <div className="w-full">
      <TaskList
        tasks={tasks}
        activeTasks={activeTasks}
        completedTasks={completedTasks}
        onAddTask={addTask}
        onToggleTask={toggleTask}
        onEditTask={handleEditTask}
        onDeleteTask={deleteTask}
      />
    </div>
  );
}