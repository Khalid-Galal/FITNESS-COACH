import React, { useState, useEffect, useMemo } from 'react';

const STREAK_STORAGE_KEY = 'fitness_streak_data';

interface DayData {
  date: string;
  completedGoals: number; // 0-4
}

interface StreakData {
  days: DayData[];
  currentStreak: number;
  longestStreak: number;
}

const WeeklyStreakCalendar: React.FC = () => {
  const [streakData, setStreakData] = useState<StreakData>({
    days: [],
    currentStreak: 0,
    longestStreak: 0,
  });

  // Load streak data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STREAK_STORAGE_KEY);
    if (saved) {
      try {
        setStreakData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse streak data", e);
      }
    }
  }, []);

  // Check daily checklist and update streak
  useEffect(() => {
    const checklistData = localStorage.getItem('fitness_daily_checklist');
    if (checklistData) {
      try {
        const checklist = JSON.parse(checklistData);
        const today = new Date().toISOString().split('T')[0];

        if (checklist.date === today) {
          const completedGoals = [checklist.protein, checklist.steps, checklist.water, checklist.workout].filter(Boolean).length;

          setStreakData(prev => {
            const existingIndex = prev.days.findIndex(d => d.date === today);
            const newDays = [...prev.days];

            if (existingIndex >= 0) {
              newDays[existingIndex] = { date: today, completedGoals };
            } else {
              newDays.push({ date: today, completedGoals });
            }

            // Keep only last 35 days
            const sortedDays = newDays
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 35);

            // Calculate streaks
            let currentStreak = 0;
            let longestStreak = prev.longestStreak;
            let tempStreak = 0;

            const todayDate = new Date(today);
            for (let i = 0; i < 35; i++) {
              const checkDate = new Date(todayDate);
              checkDate.setDate(checkDate.getDate() - i);
              const dateStr = checkDate.toISOString().split('T')[0];
              const dayData = sortedDays.find(d => d.date === dateStr);

              if (dayData && dayData.completedGoals >= 3) {
                tempStreak++;
                if (i === 0 || currentStreak > 0) {
                  currentStreak = tempStreak;
                }
              } else if (i === 0) {
                // Today not completed yet, check if yesterday continues streak
                continue;
              } else {
                if (tempStreak > longestStreak) {
                  longestStreak = tempStreak;
                }
                if (currentStreak > 0) break;
                tempStreak = 0;
              }
            }

            if (tempStreak > longestStreak) {
              longestStreak = tempStreak;
            }

            const newData = { days: sortedDays, currentStreak, longestStreak };
            localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(newData));
            return newData;
          });
        }
      } catch (e) {
        console.error("Failed to update streak", e);
      }
    }
  }, []);

  // Generate calendar weeks
  const calendarWeeks = useMemo(() => {
    const weeks: { date: Date; completedGoals: number; isToday: boolean; isFuture: boolean }[][] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Start from 4 weeks ago, on Sunday
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 28);
    // Adjust to previous Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());

    for (let week = 0; week < 5; week++) {
      const weekDays: { date: Date; completedGoals: number; isToday: boolean; isFuture: boolean }[] = [];
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + week * 7 + day);

        const dateStr = currentDate.toISOString().split('T')[0];
        const dayData = streakData.days.find(d => d.date === dateStr);

        weekDays.push({
          date: currentDate,
          completedGoals: dayData?.completedGoals || 0,
          isToday: currentDate.getTime() === today.getTime(),
          isFuture: currentDate.getTime() > today.getTime(),
        });
      }
      weeks.push(weekDays);
    }

    return weeks;
  }, [streakData.days]);

  const getColorClass = (completedGoals: number, isFuture: boolean): string => {
    if (isFuture) return 'bg-slate-50';
    if (completedGoals === 0) return 'bg-slate-100';
    if (completedGoals === 1) return 'bg-emerald-100';
    if (completedGoals === 2) return 'bg-emerald-200';
    if (completedGoals === 3) return 'bg-emerald-400';
    return 'bg-emerald-500';
  };

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-slate-800">Activity Streak</h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-2xl">🔥</span>
            <div>
              <span className="font-bold text-orange-500">{streakData.currentStreak}</span>
              <span className="text-slate-400 text-xs ml-1">current</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-2xl">🏆</span>
            <div>
              <span className="font-bold text-amber-500">{streakData.longestStreak}</span>
              <span className="text-slate-400 text-xs ml-1">best</span>
            </div>
          </div>
        </div>
      </div>

      {/* Day labels */}
      <div className="flex gap-1 mb-1">
        {dayLabels.map((label, i) => (
          <div key={i} className="flex-1 text-center text-xs text-slate-400">
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="space-y-1">
        {calendarWeeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex gap-1">
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`flex-1 aspect-square rounded-sm sm:rounded-md ${getColorClass(day.completedGoals, day.isFuture)} ${day.isToday ? 'ring-2 ring-indigo-500 ring-offset-1' : ''} transition-colors`}
                title={`${day.date.toLocaleDateString()}: ${day.completedGoals}/4 goals`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 mt-3 text-xs text-slate-400">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-slate-100" />
        <div className="w-3 h-3 rounded-sm bg-emerald-100" />
        <div className="w-3 h-3 rounded-sm bg-emerald-200" />
        <div className="w-3 h-3 rounded-sm bg-emerald-400" />
        <div className="w-3 h-3 rounded-sm bg-emerald-500" />
        <span>More</span>
      </div>

      <p className="text-xs text-slate-400 mt-2 text-center">
        Complete 3+ daily goals to build your streak
      </p>
    </div>
  );
};

export default WeeklyStreakCalendar;
