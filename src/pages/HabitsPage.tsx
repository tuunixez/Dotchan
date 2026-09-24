import { useHabits } from '../hooks/useHabits';
import { HabitList } from '../components/habits';

export function HabitsPage() {
  const { habits, initialized, addHabit, updateHabit, deleteHabit, toggleDailyCheck, toggleWeeklyCheck } = useHabits();

  if (!initialized) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-700" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <HabitList
        habits={habits}
        onAddHabit={addHabit}
        onUpdateHabit={updateHabit}
        onDeleteHabit={deleteHabit}
        onToggleDaily={toggleDailyCheck}
        onToggleWeekly={toggleWeeklyCheck}
      />
    </div>
  );
}