import { useState, FormEvent } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import type { Frequency } from '../../types';

interface HabitFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, frequency: Frequency) => void;
  initialData?: { title: string; frequency: Frequency };
  isEditing?: boolean;
}

export function HabitForm({ isOpen, onClose, onSubmit, isEditing = false }: HabitFormProps) {
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('daily');

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title.trim(), frequency);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setFrequency('daily');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Habit' : 'New Habit'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What habit do you want to build?"
          autoFocus
          required
        />
        <Select
          label="Frequency"
          value={frequency}
          onChange={e => setFrequency(e.target.value as Frequency)}
          options={frequencyOptions}
        />
        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-900">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {isEditing ? 'Save Changes' : 'Create Habit'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}