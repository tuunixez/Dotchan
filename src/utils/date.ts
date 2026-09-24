import { format, addDays, startOfWeek, parseISO } from 'date-fns';

export function formatDate(date: Date | string, pattern = 'yyyy-MM-dd'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern);
}

export function formatDateTime(date: Date | string): string {
  return formatDate(date, 'yyyy-MM-dd HH:mm');
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatHours(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function getTodayKey(): string {
  return formatDate(new Date());
}

export function getWeekKey(date = new Date()): string {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  return formatDate(weekStart);
}

export function isNewDay(lastResetKey: string): boolean {
  return lastResetKey !== getTodayKey();
}

export function getDayOfWeek(date = new Date()): number {
  return date.getDay();
}

export function getDaysInWeek(): string[] {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
}

export function getDateKey(dayOffset: number): string {
  return formatDate(addDays(new Date(), dayOffset));
}