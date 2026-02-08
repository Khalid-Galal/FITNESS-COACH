import React, { useState, useEffect } from 'react';

const WORKOUT_STORAGE_KEY = 'fitness_workout_badges';

interface WorkoutDay {
  day: 'Monday' | 'Wednesday' | 'Friday';
  name: string;
  shortName: string;
}

interface WeekWorkouts {
  weekStart: string;
  completed: {
    Monday: boolean;
    Wednesday: boolean;
    Friday: boolean;
  };
}

const WORKOUT_DAYS: WorkoutDay[] = [
  { day: 'Monday', name: 'Full Body A', shortName: 'A' },
  { day: 'Wednesday', name: 'Full Body B', shortName: 'B' },
  { day: 'Friday', name: 'Full Body C', shortName: 'C' },
];

const WorkoutBadges: React.FC = () => {
  const [workoutData, setWorkoutData] = useState<WeekWorkouts[]>([]);

  // Get the start of the current week (Monday)
  const getWeekStart = (date: Date = new Date()): string => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().split('T')[0];
  };

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(WORKOUT_STORAGE_KEY);
    if (saved) {
      try {
        setWorkoutData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse workout data", e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (workoutData.length > 0) {
      localStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify(workoutData));
    }
  }, [workoutData]);

  // Ensure current week exists
  useEffect(() => {
    const currentWeekStart = getWeekStart();
    setWorkoutData(prev => {
      const hasCurrentWeek = prev.some(w => w.weekStart === currentWeekStart);
      if (!hasCurrentWeek) {
        const newWeek: WeekWorkouts = {
          weekStart: currentWeekStart,
          completed: { Monday: false, Wednesday: false, Friday: false },
        };
        return [...prev, newWeek].slice(-8); // Keep last 8 weeks
      }
      return prev;
    });
  }, []);

  const toggleWorkout = (weekStart: string, day: 'Monday' | 'Wednesday' | 'Friday') => {
    setWorkoutData(prev =>
      prev.map(week =>
        week.weekStart === weekStart
          ? { ...week, completed: { ...week.completed, [day]: !week.completed[day] } }
          : week
      )
    );
  };

  const currentWeekStart = getWeekStart();

  // Get display weeks (current + last 3)
  const displayWeeks = workoutData
    .sort((a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime())
    .slice(0, 4);

  // Calculate stats
  const totalWorkouts = displayWeeks.reduce(
    (sum, week) => sum + Object.values(week.completed).filter(Boolean).length,
    0
  );
  const totalPossible = displayWeeks.length * 3;
  const completionRate = totalPossible > 0 ? Math.round((totalWorkouts / totalPossible) * 100) : 0;

  const formatWeekLabel = (weekStart: string): string => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    if (weekStart === currentWeekStart) return 'This Week';

    const prevWeekStart = new Date(currentWeekStart);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);
    if (weekStart === prevWeekStart.toISOString().split('T')[0]) return 'Last Week';

    return `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-slate-800">Workout Tracker</h3>
        <div className="flex items-center gap-2">
          <div className="h-2 w-16 sm:w-24 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">{completionRate}%</span>
        </div>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-4 gap-2 mb-2">
        <div className="text-xs text-slate-400 font-medium"></div>
        {WORKOUT_DAYS.map(workout => (
          <div key={workout.day} className="text-center">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">{workout.name}</span>
            <span className="text-xs text-slate-500 font-medium sm:hidden">{workout.shortName}</span>
          </div>
        ))}
      </div>

      {/* Weeks */}
      <div className="space-y-2">
        {displayWeeks.map(week => {
          const isCurrentWeek = week.weekStart === currentWeekStart;
          const completedCount = Object.values(week.completed).filter(Boolean).length;

          return (
            <div
              key={week.weekStart}
              className={`grid grid-cols-4 gap-2 items-center p-2 rounded-lg ${isCurrentWeek ? 'bg-indigo-50 border border-indigo-100' : 'bg-slate-50'}`}
            >
              <div className="text-xs font-medium text-slate-600 truncate">
                {formatWeekLabel(week.weekStart)}
              </div>

              {WORKOUT_DAYS.map(workout => {
                const isCompleted = week.completed[workout.day];
                return (
                  <button
                    key={workout.day}
                    onClick={() => toggleWorkout(week.weekStart, workout.day)}
                    className={`aspect-square max-w-[48px] mx-auto rounded-lg flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm'
                        : 'bg-white border-2 border-dashed border-slate-200 text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    {isCompleted ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-lg font-bold">{workout.shortName}</span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Achievement badges */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex flex-wrap gap-2 justify-center">
          {totalWorkouts >= 3 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
              🏅 Week Warrior
            </span>
          )}
          {totalWorkouts >= 6 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">
              💪 Consistency King
            </span>
          )}
          {totalWorkouts >= 9 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">
              🔥 On Fire
            </span>
          )}
          {completionRate === 100 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-orange-800 rounded-full text-xs font-medium">
              🏆 Perfect Month
            </span>
          )}
          {totalWorkouts === 0 && (
            <span className="text-xs text-slate-400">Complete workouts to earn badges!</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutBadges;
