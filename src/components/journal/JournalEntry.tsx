import { format, parseISO } from 'date-fns';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Input';
import { MoodSelector } from './MoodSelector';
import { MOOD_LABELS } from '../../types/journal';
import type { JournalEntry as JournalEntryValue, Mood } from '../../types';

interface JournalEntryProps {
  entry: JournalEntryValue;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<JournalEntryValue>) => void;
}

export function JournalEntry({ entry, onDelete, onUpdate }: JournalEntryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(entry.content);
  const [mood, setMood] = useState<Mood>(entry.mood);

  const formattedDate = format(parseISO(entry.date), 'MMM d, yyyy');
  const fullDate = format(parseISO(entry.date), 'MMMM d, yyyy');
  const moodLabel = MOOD_LABELS[entry.mood];

  const openDetails = () => {
    setContent(entry.content);
    setMood(entry.mood);
    setIsEditing(false);
    setIsOpen(true);
  };

  const closeDetails = () => {
    setIsEditing(false);
    setIsOpen(false);
  };

  const startEditing = () => {
    setContent(entry.content);
    setMood(entry.mood);
    setIsEditing(true);
  };

  const saveChanges = (event: FormEvent) => {
    event.preventDefault();
    if (!content.trim()) return;

    onUpdate(entry.id, { content: content.trim(), mood });
    setIsEditing(false);
  };

  const deleteEntry = () => {
    if (!window.confirm('Delete this journal entry?')) return;

    onDelete(entry.id);
    closeDetails();
  };

  return (
    <>
      <div
        className="bg-neutral-950 border border-neutral-900 hover:border-neutral-800 rounded-xl p-4 cursor-pointer transition-colors"
        onClick={openDetails}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openDetails();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`Open journal entry from ${fullDate}`}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-neutral-500">{formattedDate}</p>
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-neutral-900 text-neutral-400 border border-neutral-800">
            {moodLabel}
          </span>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeDetails} title="Journal Entry" size="xl">
        <div className="w-full min-w-0 max-w-2xl mx-auto bg-black text-neutral-100 max-h-[80vh] overflow-y-auto overflow-x-hidden break-words">
          {isEditing ? (
            <form onSubmit={saveChanges} className="space-y-5">
              <Textarea
                value={content}
                onChange={event => setContent(event.target.value)}
                className="min-h-32"
                autoFocus
                aria-label="Journal entry text"
              />
              <MoodSelector mood={mood} setMood={setMood} />
              <div className="flex justify-end gap-3 border-t border-neutral-900 pt-4">
                <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save
                </Button>
              </div>
            </form>
          ) : (
            <div className="min-w-0 space-y-6">
              <div className="flex items-center justify-end gap-3">
                <Button type="button" variant="secondary" size="sm" onClick={startEditing}>
                  Edit
                </Button>
                <button
                  type="button"
                  onClick={deleteEntry}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
              <div className="min-w-0 space-y-2">
                <p className="text-sm text-neutral-500">{fullDate}</p>
                <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-neutral-900 text-neutral-400 border border-neutral-800">
                  {moodLabel}
                </span>
              </div>
              <div className="min-w-0 max-w-full overflow-x-hidden">
                <p className="text-sm text-neutral-100 leading-relaxed whitespace-pre-wrap break-words break-all">
                  {entry.content}
                </p>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
