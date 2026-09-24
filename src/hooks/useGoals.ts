import { useState, useEffect, useCallback } from 'react';
import { generateId } from '../utils/id';
import { storage } from '../utils/storage';
import type { Goal, Milestone } from '../types';

function calculateProgress(milestones: Milestone[]): number {
  if (milestones.length === 0) return 0;
  const completed = milestones.filter(m => m.completed).length;
  return Math.round((completed / milestones.length) * 100);
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setGoals(storage.goals.get());
    setInitialized(true);
  }, []);

  const saveGoals = useCallback((newGoals: Goal[]) => {
    setGoals(newGoals);
    storage.goals.set(newGoals);
  }, []);

  const addGoal = useCallback((title: string, description?: string) => {
    const newGoal: Goal = {
      id: generateId(),
      title,
      description,
      milestones: [],
      createdAt: new Date().toISOString(),
      progress: 0,
    };
    saveGoals([...goals, newGoal]);
  }, [goals, saveGoals]);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    saveGoals(goals.map(g => g.id === id ? { ...g, ...updates } : g));
  }, [goals, saveGoals]);

  const deleteGoal = useCallback((id: string) => {
    saveGoals(goals.filter(g => g.id !== id));
  }, [goals, saveGoals]);

  const addMilestone = useCallback((goalId: string, title: string) => {
    saveGoals(goals.map(g => {
      if (g.id !== goalId) return g;
      const newMilestone: Milestone = {
        id: generateId(),
        title,
        completed: false,
      };
      const milestones = [...g.milestones, newMilestone];
      return { ...g, milestones, progress: calculateProgress(milestones) };
    }));
  }, [goals, saveGoals]);

  const toggleMilestone = useCallback((goalId: string, milestoneId: string) => {
    saveGoals(goals.map(g => {
      if (g.id !== goalId) return g;
      const milestones = g.milestones.map(m =>
        m.id === milestoneId ? { ...m, completed: !m.completed, completedAt: !m.completed ? new Date().toISOString() : undefined } : m
      );
      return { ...g, milestones, progress: calculateProgress(milestones) };
    }));
  }, [goals, saveGoals]);

  const deleteMilestone = useCallback((goalId: string, milestoneId: string) => {
    saveGoals(goals.map(g => {
      if (g.id !== goalId) return g;
      const milestones = g.milestones.filter(m => m.id !== milestoneId);
      return { ...g, milestones, progress: calculateProgress(milestones) };
    }));
  }, [goals, saveGoals]);

  const updateMilestone = useCallback((goalId: string, milestoneId: string, title: string) => {
    saveGoals(goals.map(g => {
      if (g.id !== goalId) return g;
      const milestones = g.milestones.map(m =>
        m.id === milestoneId ? { ...m, title } : m
      );
      return { ...g, milestones };
    }));
  }, [goals, saveGoals]);

  return {
    goals,
    initialized,
    addGoal,
    updateGoal,
    deleteGoal,
    addMilestone,
    toggleMilestone,
    deleteMilestone,
    updateMilestone,
  };
}