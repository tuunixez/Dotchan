import { useState, useEffect, useCallback } from 'react';
import { generateId } from '../utils/id';
import { storage, performDailyReset } from '../utils/storage';
import type { Task, TaskHistory, Priority } from '../types';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [history, setHistory] = useState<TaskHistory[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    performDailyReset();
    setTasks(storage.tasks.get());
    setHistory(storage.taskHistory.get());
    setInitialized(true);
  }, []);

  const saveTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
    storage.tasks.set(newTasks);
  }, []);

  const saveHistory = useCallback((newHistory: TaskHistory[]) => {
    setHistory(newHistory);
    storage.taskHistory.set(newHistory);
  }, []);

  const addTask = useCallback((title: string, description?: string, priority: Priority = 'medium', dueDate?: string) => {
    const newTask: Task = {
      id: generateId(),
      title,
      description,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate,
    };
    saveTasks([...tasks, newTask]);
  }, [tasks, saveTasks]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    saveTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  }, [tasks, saveTasks]);

  const toggleTask = useCallback((id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const now = new Date().toISOString();
    const updatedTasks = tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? now : undefined } : t
    );
    saveTasks(updatedTasks);

    if (!task.completed) {
      const historyEntry: TaskHistory = {
        id: generateId(),
        taskId: task.id,
        title: task.title,
        completedAt: now,
        priority: task.priority,
      };
      saveHistory([historyEntry, ...history].slice(0, 500));
    }
  }, [tasks, history, saveTasks, saveHistory]);

  const deleteTask = useCallback((id: string) => {
    saveTasks(tasks.filter(t => t.id !== id));
  }, [tasks, saveTasks]);

  const clearHistory = useCallback(() => {
    saveHistory([]);
  }, [saveHistory]);

  const getActiveTasks = useCallback(() => tasks.filter(t => !t.completed), [tasks]);
  const getCompletedTasks = useCallback(() => tasks.filter(t => t.completed), [tasks]);

  return {
    tasks,
    history,
    initialized,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    clearHistory,
    getActiveTasks,
    getCompletedTasks,
  };
}