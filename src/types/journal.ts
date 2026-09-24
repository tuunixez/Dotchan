export type Mood = 'awful' | 'bad' | 'okay' | 'good' | 'great';

export interface JournalEntry {
  id: string;
  content: string;
  mood: Mood;
  date: string;
  createdAt: string;
}

export const MOOD_LABELS: Record<Mood, string> = {
  awful: 'Awful',
  bad: 'Bad',
  okay: 'Okay',
  good: 'Good',
  great: 'Great',
};
