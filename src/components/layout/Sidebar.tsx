import { NavLink } from 'react-router-dom';
import {
  CheckSquare,
  Target,
  HeartPulse,
  BookOpen,
  Timer,
  BarChart3,
} from 'lucide-react';
import { Icon } from '../ui/Icon';

const NAV_ITEMS = [
  { path: '/tasks', label: 'Tasks', icon: CheckSquare },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/habits', label: 'Habits', icon: HeartPulse },
  { path: '/journal', label: 'Journal', icon: BookOpen },
  { path: '/pomodoro', label: 'Pomodoro', icon: Timer },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
] as const;

export function Sidebar() {
  return (
    <aside className="w-60 bg-black border-r border-neutral-900 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-neutral-900">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="text-xl font-medium text-neutral-100 tracking-tight">Dotchan</span>
        </NavLink>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ path, label, icon: IconComponent }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }: { isActive: boolean }) => `
              flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${isActive
                ? 'bg-neutral-900 text-neutral-100'
                : 'text-neutral-500 hover:bg-neutral-900 hover:text-neutral-100'
              }
            `}
            title={label}
          >
            <Icon icon={IconComponent} size={20} className="flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-neutral-900">
        <p className="text-xs text-neutral-500 text-center">
          Local-first • No backend • Your data stays yours
        </p>
      </div>
    </aside>
  );
}