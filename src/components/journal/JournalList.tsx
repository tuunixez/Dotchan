import { format, parseISO } from 'date-fns';
import { useState } from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { JournalForm } from './JournalForm';
import { JournalEntry } from './JournalEntry';
import type { JournalEntry as JournalEntryType, Mood } from '../../types';

interface JournalListProps {
  entries: JournalEntryType[];
  onAddEntry: (content: string, mood: Mood) => void;
  onDeleteEntry: (id: string) => void;
  onUpdateEntry: (id: string, updates: Partial<JournalEntryType>) => void;
}

export function JournalList({ entries, onAddEntry, onDeleteEntry, onUpdateEntry }: JournalListProps) {
  const [showForm, setShowForm] = useState(false);
  const sortedEntries = [...entries].sort((a, b) => (
    b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)
  ));
  const groupedEntries = new Map<string, JournalEntryType[]>();

  sortedEntries.forEach(entry => {
    const month = format(parseISO(entry.date), 'MMMM yyyy');
    const monthEntries = groupedEntries.get(month) ?? [];
    monthEntries.push(entry);
    groupedEntries.set(month, monthEntries);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="primary" onClick={() => setShowForm(true)}>
          <Icon icon={Plus} size={18} />
          New Entry
        </Button>
      </div>

      {sortedEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-500">
          <BookOpen className="w-12 h-12 mb-4 text-neutral-500" aria-hidden="true" />
          <p>No journal entries yet</p>
        </div>
      ) : (
        Array.from(groupedEntries.entries()).map(([month, monthEntries]) => (
          <section key={month} className="space-y-3">
            <h2 className="text-sm text-neutral-500 uppercase tracking-wide">{month}</h2>
            {monthEntries.map(entry => (
              <JournalEntry
                key={entry.id}
                entry={entry}
                onDelete={onDeleteEntry}
                onUpdate={onUpdateEntry}
              />
            ))}
          </section>
        ))
      )}

      <JournalForm isOpen={showForm} onClose={() => setShowForm(false)} onSubmit={onAddEntry} />
    </div>
  );
}
