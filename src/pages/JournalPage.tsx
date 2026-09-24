import { useJournal } from '../hooks/useJournal';
import { JournalList } from '../components/journal';

export function JournalPage() {
  const { entries, initialized, addEntry, updateEntry, deleteEntry } = useJournal();

  if (!initialized) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-700" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <JournalList
        entries={entries}
        onAddEntry={addEntry}
        onUpdateEntry={updateEntry}
        onDeleteEntry={deleteEntry}
      />
    </div>
  );
}