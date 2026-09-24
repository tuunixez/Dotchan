import { formatHours } from '../../utils/date';
import type { Task } from '../../types';

interface TaskTimeChartProps {
  tasks: Task[];
  completedTaskTimes: Record<string, number>;
  partialTaskTimes: Record<string, number>;
}

function getMinutes(record: Record<string, number>, taskId: string): number {
  const value = record[taskId];
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function TaskTimeChart({ tasks, completedTaskTimes, partialTaskTimes }: TaskTimeChartProps) {
  const tasksWithTime = tasks
    .map(task => {
      const completedMinutes = getMinutes(completedTaskTimes, task.id);
      const partialMinutes = getMinutes(partialTaskTimes, task.id);
      return {
        ...task,
        completedMinutes,
        partialMinutes,
        totalMinutes: completedMinutes + partialMinutes,
      };
    })
    .filter(task => task.totalMinutes > 0)
    .sort((a, b) => b.totalMinutes - a.totalMinutes);

  if (tasksWithTime.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-300">
        <p className="text-sm">No focus time tracked yet</p>
        <p className="text-xs mt-1">Complete or partially focus on a linked task to see data</p>
      </div>
    );
  }

  const maxTime = Math.max(...tasksWithTime.map(task => task.totalMinutes));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-medium text-neutral-50 mb-6">Task Focus Time</h3>
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-neutral-500" />
            Completed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-neutral-400" />
            Partial
          </span>
        </div>
      </div>
      <div className="space-y-3">
        {tasksWithTime.map((task, index) => {
          const completedWidth = (task.completedMinutes / maxTime) * 100;
          const partialWidth = (task.partialMinutes / maxTime) * 100;

          return (
            <div key={task.id} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500 font-mono">{index + 1}.</span>
                  <span className="text-sm text-neutral-50 truncate max-w-[200px]">{task.title}</span>
                  <span className="px-1.5 py-0.5 text-xs rounded-full text-neutral-400">
                    {task.priority}
                  </span>
                </div>
                <span className="text-sm font-mono text-neutral-400">{formatHours(task.totalMinutes)}</span>
              </div>
              <div
                className="h-2 flex overflow-hidden rounded-full bg-neutral-900"
                role="img"
                aria-label={`${task.title}: ${formatHours(task.completedMinutes)} completed, ${formatHours(task.partialMinutes)} partial`}
              >
                {task.completedMinutes > 0 && (
                  <div
                    className="h-full bg-neutral-500"
                    style={{ width: `${completedWidth}%` }}
                  />
                )}
                {task.partialMinutes > 0 && (
                  <div
                    className="h-full bg-neutral-400"
                    style={{ width: `${partialWidth}%` }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
