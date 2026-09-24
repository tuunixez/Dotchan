import { useState, FormEvent } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Input';
import { MoodSelector } from './MoodSelector';
import type { Mood } from '../../types';

interface JournalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, mood: Mood) => void;
}

export function JournalForm({ isOpen, onClose, onSubmit }: JournalFormProps) {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood>('okay');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim(), mood);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setContent('');
    setMood('okay');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Journal Entry" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          label="What's on your mind?"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write about your day..."
          autoFocus
          rows={3}
          className="resize-none"
        />
        <MoodSelector mood={mood} setMood={setMood} />
        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-900">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">Save Entry</Button>
        </div>
      </form>
    </Modal>
  );
}