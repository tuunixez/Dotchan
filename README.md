# Dotchan

A minimal, fast, local-first productivity web app built with Bun, React, TypeScript, and Tailwind CSS.

## Features

- **Tasks** - CRUD with priority (low/medium/high), daily auto-reset at midnight, completion history
- **Goals** - Create goals with optional milestones, auto-calculated progress bars
- **Habits** - Daily or weekly frequency, 7-day tracking grid, streak counting
- **Journal** - Free-text entries with mood/emotion selector, auto-dated
- **Pomodoro** - Classic 25/5 timer with start/pause/reset, session logging linked to tasks
- **Analytics** - Dark theme with anime illustration, focus hours, task time tracking, mood analytics, streak stats

## Tech Stack

- **Runtime/Package Manager**: Bun
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (via @tailwindcss/vite)
- **Icons**: lucide-react
- **Dates**: date-fns
- **IDs**: uuid
- **Storage**: localStorage only (no backend)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0

### Installation

```bash
bun install
```

### Development

```bash
bun run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
bun run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
bun run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components (Button, Input, Modal, etc.)
│   ├── layout/       # Layout components (Sidebar, Header, Layout)
│   ├── tasks/        # Task components
│   ├── goals/        # Goal components
│   ├── habits/       # Habit components
│   ├── journal/      # Journal components
│   ├── pomodoro/     # Pomodoro components
│   └── analytics/    # Analytics components
├── hooks/            # Custom React hooks for each feature
├── pages/            # Page components
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── App.tsx           # Main app with routing
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## Data Persistence

All data is stored in localStorage with the following keys:
- `dotchan_tasks` - Active tasks
- `dotchan_task_history` - Completed task history
- `dotchan_goals` - Goals with milestones
- `dotchan_habits` - Habits with streaks and check-ins
- `dotchan_journal` - Journal entries
- `dotchan_pomodoro_sessions` - Completed Pomodoro sessions
- `dotchan_pomodoro_state` - Current timer state
- `dotchan_last_reset` - Last daily reset date

## License

MIT