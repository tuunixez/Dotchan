import { useState, useEffect, useCallback } from 'react';
import { generateId } from '../utils/id';
import { getTodayKey } from '../utils/date';
import { storage } from '../utils/storage';
import type { JournalEntry, Mood } from '../types';

const MOOD_ORDER: Mood[] = ['awful', 'bad', 'okay', 'good', 'great'];

function normalizeMood(value: unknown): Mood {
  if (typeof value !== 'string') return 'okay';

  switch (value) {
    case 'awful':
    case '😢':
    case 'terrible':
      return 'awful';
    case 'bad':
    case '😔':
      return 'bad';
    case 'okay':
    case '😐':
      return 'okay';
    case 'good':
    case '🙂':
      return 'good';
    case 'great':
    case '😄':
      return 'great';
    default:
      return 'okay';
  }
}

function compareEntries(a: JournalEntry, b: JournalEntry): number {
  return b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt);
}

function normalizeEntries(value: unknown): JournalEntry[] {
  if (!Array.isArray(value)) return [];

  const entriesByDate = new Map<string, JournalEntry>();

  value.forEach(rawEntry => {
    if (!rawEntry || typeof rawEntry !== 'object' || Array.isArray(rawEntry)) return;

    const record = rawEntry as Record<string, unknown>;
    if (typeof record.date !== 'string' || record.date.length === 0) return;

    const entry: JournalEntry = {
      id: typeof record.id === 'string' && record.id.length > 0 ? record.id : generateId(),
      content: typeof record.content === 'string' ? record.content : '',
      mood: normalizeMood(record.mood),
      date: record.date,
      createdAt: typeof record.createdAt === 'string' ? record.createdAt : '',
    };

    const existing = entriesByDate.get(entry.date);
    if (!existing || compareEntries(entry, existing) < 0) {
      entriesByDate.set(entry.date, entry);
    }
  });

  return Array.from(entriesByDate.values()).sort(compareEntries);
}

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const normalizedEntries = normalizeEntries(storage.journal.get());
    setEntries(normalizedEntries);
    storage.journal.set(normalizedEntries);
    setInitialized(true);
  }, []);

  const saveEntries = useCallback((newEntries: JournalEntry[]) => {
    setEntries(newEntries);
    storage.journal.set(newEntries);
  }, []);

  const addEntry = useCallback((content: string, mood: Mood) => {
    const date = getTodayKey();
    const existingEntry = entries.find(entry => entry.date === date);
    const now = new Date();
    const entry: JournalEntry = {
      id: existingEntry?.id ?? generateId(),
      content,
      mood: normalizeMood(mood),
      date,
      createdAt: existingEntry?.createdAt ?? now.toISOString(),
    };

    saveEntries(
      [entry, ...entries.filter(currentEntry => currentEntry.date !== date)].sort(compareEntries),
    );
  }, [entries, saveEntries]);

  const updateEntry = useCallback((id: string, updates: Partial<JournalEntry>) => {
    saveEntries(entries.map(entry => {
      if (entry.id !== id) return entry;

      return {
        ...entry,
        content: updates.content !== undefined ? updates.content.trim() : entry.content,
        mood: normalizeMood(updates.mood !== undefined ? updates.mood : entry.mood),
      };
    }));
  }, [entries, saveEntries]);

  const deleteEntry = useCallback((id: string) => {
    saveEntries(entries.filter(entry => entry.id !== id));
  }, [entries, saveEntries]);

  const getEntriesByDate = useCallback((date: string) => {
    return entries.filter(entry => entry.date === date);
  }, [entries]);

  const getMonthlyMood = useCallback((month: string) => {
    const monthEntries = entries.filter(entry => entry.date.startsWith(month));
    if (monthEntries.length === 0) return null;

    const moodCounts: Record<Mood, number> = {
      awful: 0,
      bad: 0,
      okay: 0,
      good: 0,
      great: 0,
    };

    monthEntries.forEach(entry => {
      moodCounts[normalizeMood(entry.mood)]++;
    });

    return MOOD_ORDER.reduce(
      (dominant, mood) => moodCounts[mood] > moodCounts[dominant] ? mood : dominant,
      MOOD_ORDER[0],
    );
  }, [entries]);

  return {
    entries,
    initialized,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntriesByDate,
    getMonthlyMood,
  };
}
