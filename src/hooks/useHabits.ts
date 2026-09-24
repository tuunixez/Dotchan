import { useState, useEffect, useCallback } from 'react';
import { generateId } from '../utils/id';
import { getTodayKey, getWeekKey, getDayOfWeek, getDaysInWeek } from '../utils/date';
import { storage } from '../utils/storage';
import type { Habit, Frequency } from '../types';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setHabits(storage.habits.get());
    setInitialized(true);
  }, []);

  const saveHabits = useCallback((newHabits: Habit[]) => {
    setHabits(newHabits);
    storage.habits.set(newHabits);
  }, []);

  const addHabit = useCallback((title: string, frequency: Frequency = 'daily') => {
    const todayKey = getTodayKey();
    const weekKey = getWeekKey();
    const newHabit: Habit = {
      id: generateId(),
      title,
      frequency,
      streak: 0,
      longestStreak: 0,
      dailyChecks: frequency === 'daily' ? { [todayKey]: false } : {},
      weeklyChecks: frequency === 'weekly' ? { [weekKey]: false } : {},
      createdAt: new Date().toISOString(),
    };
    saveHabits([...habits, newHabit]);
  }, [habits, saveHabits]);

  const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
    saveHabits(habits.map(h => h.id === id ? { ...h, ...updates } : h));
  }, [habits, saveHabits]);

  const deleteHabit = useCallback((id: string) => {
    saveHabits(habits.filter(h => h.id !== id));
  }, [habits, saveHabits]);

  const toggleDailyCheck = useCallback((id: string) => {
    const todayKey = getTodayKey();
    saveHabits(habits.map(h => {
      if (h.id !== id || h.frequency !== 'daily') return h;
      const wasChecked = h.dailyChecks[todayKey] ?? false;
      const dailyChecks = { ...h.dailyChecks, [todayKey]: !wasChecked };
      const allChecked = Object.values(dailyChecks).every(v => v);
      let { streak, longestStreak, lastCompletedAt } = h;

      if (!wasChecked && allChecked) {
        streak += 1;
        longestStreak = Math.max(longestStreak, streak);
        lastCompletedAt = new Date().toISOString();
      }

      return { ...h, dailyChecks, streak, longestStreak, lastCompletedAt };
    }));
  }, [habits, saveHabits]);

  const toggleWeeklyCheck = useCallback((id: string) => {
    const weekKey = getWeekKey();
    saveHabits(habits.map(h => {
      if (h.id !== id || h.frequency !== 'weekly') return h;
      const wasChecked = h.weeklyChecks[weekKey] ?? false;
      const weeklyChecks = { ...h.weeklyChecks, [weekKey]: !wasChecked };
      let { streak, longestStreak, lastCompletedAt } = h;

      if (!wasChecked) {
        streak += 1;
        longestStreak = Math.max(longestStreak, streak);
        lastCompletedAt = new Date().toISOString();
      }

      return { ...h, weeklyChecks, streak, longestStreak, lastCompletedAt };
    }));
  }, [habits, saveHabits]);

  const getHabitWeekData = useCallback((habit: Habit) => {
    if (habit.frequency !== 'daily') return null;

    const days = getDaysInWeek();
    const todayIndex = getDayOfWeek();
    const weekData = days.map((day, index) => {
      const offset = index - todayIndex;

      // Better approach: calculate each day's date
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() + offset);
      const dateStr = baseDate.toISOString().split('T')[0];

      return {
        day,
        index,
        checked: habit.dailyChecks[dateStr] ?? false,
        isToday: index === todayIndex,
        isFuture: index > todayIndex,
        dateKey: dateStr,
      };
    });

    return weekData;
  }, []);

  return {
    habits,
    initialized,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleDailyCheck,
    toggleWeeklyCheck,
    getHabitWeekData,
  };
}