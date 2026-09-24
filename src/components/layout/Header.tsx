import { useLocation } from 'react-router-dom';

const PAGE_TITLES: Record<string, string> = {
  '/tasks': 'Tasks',
  '/goals': 'Goals',
  '/habits': 'Habits',
  '/journal': 'Journal',
  '/pomodoro': 'Pomodoro',
  '/analytics': 'Analytics',
};

const PAGE_DESCRIPTIONS: Record<string, string> = {
  '/tasks': 'Manage your daily tasks and track completion history',
  '/goals': 'Set goals with milestones and track progress',
  '/habits': 'Build habits with streaks and daily tracking',
  '/journal': 'Write journal entries with mood tracking',
  '/pomodoro': 'Focus timer with session logging',
  '/analytics': 'View your productivity statistics',
};

export function Header() {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'Dotchan';
  const description = PAGE_DESCRIPTIONS[location.pathname] || '';

  return (
    <header className="min-h-16 bg-black border-b border-neutral-900 flex items-start px-6 py-6">
      <div className="flex-1">
        <h1 className="text-2xl font-medium text-neutral-100 mb-6">{title}</h1>
        {description && (
          <p className="text-sm text-neutral-400">{description}</p>
        )}
      </div>
      <div className="text-sm text-neutral-500">
        {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
      </div>
    </header>
  );
}