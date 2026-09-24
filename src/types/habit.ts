export type Frequency = 'daily' | 'weekly';

export interface Habit {
  id: string;
  title: string;
  frequency: Frequency;
  streak: number;
  longestStreak: number;
  dailyChecks: Record<string, boolean>;
  weeklyChecks: Record<string, boolean>;
  createdAt: string;
  lastCompletedAt?: string;
}