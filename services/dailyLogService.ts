// Daily Log Storage Service
// Manages historical daily goal completions

export interface DailyLogEntry {
  date: string; // YYYY-MM-DD format
  protein: boolean;
  steps: boolean;
  water: boolean;
  workout: boolean;
  waterGlasses?: number;
  notes?: string;
  updatedAt: string; // ISO timestamp
}

const DAILY_LOGS_KEY = 'fitness_daily_logs';
const MAX_LOGS = 365; // Keep up to 1 year of history

// Get all daily logs
export const getDailyLogs = (): DailyLogEntry[] => {
  try {
    const saved = localStorage.getItem(DAILY_LOGS_KEY);
    if (saved) {
      return JSON.parse(saved) as DailyLogEntry[];
    }
  } catch (e) {
    console.error('Failed to parse daily logs', e);
  }
  return [];
};

// Get log for a specific date
export const getLogForDate = (date: string): DailyLogEntry | null => {
  const logs = getDailyLogs();
  return logs.find(log => log.date === date) || null;
};

// Get today's log
export const getTodayLog = (): DailyLogEntry | null => {
  const today = new Date().toISOString().split('T')[0];
  return getLogForDate(today);
};

// Save or update a daily log
export const saveDailyLog = (entry: Partial<DailyLogEntry> & { date: string }): DailyLogEntry => {
  const logs = getDailyLogs();
  const existingIndex = logs.findIndex(log => log.date === entry.date);

  const now = new Date().toISOString();

  if (existingIndex >= 0) {
    // Update existing entry
    const updated: DailyLogEntry = {
      ...logs[existingIndex],
      ...entry,
      updatedAt: now,
    };
    logs[existingIndex] = updated;
    saveLogs(logs);
    return updated;
  } else {
    // Create new entry
    const newEntry: DailyLogEntry = {
      date: entry.date,
      protein: entry.protein ?? false,
      steps: entry.steps ?? false,
      water: entry.water ?? false,
      workout: entry.workout ?? false,
      waterGlasses: entry.waterGlasses,
      notes: entry.notes,
      updatedAt: now,
    };
    logs.unshift(newEntry);

    // Trim to max logs
    if (logs.length > MAX_LOGS) {
      logs.length = MAX_LOGS;
    }

    saveLogs(logs);
    return newEntry;
  }
};

// Update a specific goal for today
export const updateTodayGoal = (
  goal: 'protein' | 'steps' | 'water' | 'workout',
  value: boolean,
  extras?: { waterGlasses?: number }
): DailyLogEntry => {
  const today = new Date().toISOString().split('T')[0];
  const existing = getLogForDate(today);

  return saveDailyLog({
    date: today,
    protein: existing?.protein ?? false,
    steps: existing?.steps ?? false,
    water: existing?.water ?? false,
    workout: existing?.workout ?? false,
    waterGlasses: existing?.waterGlasses,
    ...existing,
    [goal]: value,
    ...extras,
  });
};

// Get logs for date range
export const getLogsForRange = (startDate: string, endDate: string): DailyLogEntry[] => {
  const logs = getDailyLogs();
  return logs.filter(log => log.date >= startDate && log.date <= endDate);
};

// Get logs for last N days
export const getRecentLogs = (days: number): DailyLogEntry[] => {
  const logs = getDailyLogs();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const cutoffStr = cutoffDate.toISOString().split('T')[0];

  return logs
    .filter(log => log.date >= cutoffStr)
    .sort((a, b) => b.date.localeCompare(a.date));
};

// Calculate stats
export const getStats = (days: number = 30) => {
  const logs = getRecentLogs(days);

  const totalDays = logs.length;
  const proteinDays = logs.filter(l => l.protein).length;
  const stepsDays = logs.filter(l => l.steps).length;
  const waterDays = logs.filter(l => l.water).length;
  const workoutDays = logs.filter(l => l.workout).length;
  const perfectDays = logs.filter(l => l.protein && l.steps && l.water && l.workout).length;

  return {
    totalDays,
    proteinDays,
    stepsDays,
    waterDays,
    workoutDays,
    perfectDays,
    proteinRate: totalDays ? Math.round((proteinDays / totalDays) * 100) : 0,
    stepsRate: totalDays ? Math.round((stepsDays / totalDays) * 100) : 0,
    waterRate: totalDays ? Math.round((waterDays / totalDays) * 100) : 0,
    workoutRate: totalDays ? Math.round((workoutDays / totalDays) * 100) : 0,
    perfectRate: totalDays ? Math.round((perfectDays / totalDays) * 100) : 0,
  };
};

// Export all logs (for backup)
export const exportLogs = (): DailyLogEntry[] => {
  return getDailyLogs();
};

// Import logs (from backup)
export const importLogs = (logs: DailyLogEntry[], merge: boolean = true): void => {
  if (merge) {
    const existing = getDailyLogs();
    const existingDates = new Set(existing.map(l => l.date));

    // Add logs that don't exist yet
    const newLogs = logs.filter(l => !existingDates.has(l.date));
    const merged = [...existing, ...newLogs]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, MAX_LOGS);

    saveLogs(merged);
  } else {
    saveLogs(logs.slice(0, MAX_LOGS));
  }
};

// Clear all logs
export const clearLogs = (): void => {
  localStorage.removeItem(DAILY_LOGS_KEY);
};

// Private helper to save logs
const saveLogs = (logs: DailyLogEntry[]): void => {
  localStorage.setItem(DAILY_LOGS_KEY, JSON.stringify(logs));
};

// Migrate existing checklist data to new log format
export const migrateExistingData = (): void => {
  // Migrate from old fitness_daily_checklist if exists
  const oldChecklist = localStorage.getItem('fitness_daily_checklist');
  if (oldChecklist) {
    try {
      const data = JSON.parse(oldChecklist);
      if (data.date) {
        const existing = getLogForDate(data.date);
        if (!existing) {
          saveDailyLog({
            date: data.date,
            protein: data.protein ?? false,
            steps: data.steps ?? false,
            water: data.water ?? false,
            workout: data.workout ?? false,
          });
        }
      }
    } catch (e) {
      console.error('Failed to migrate checklist data', e);
    }
  }

  // Migrate from streak data if it has historical entries
  const streakData = localStorage.getItem('fitness_streak_data');
  if (streakData) {
    try {
      const data = JSON.parse(streakData);
      if (data.days && Array.isArray(data.days)) {
        data.days.forEach((day: { date: string; completedGoals: number }) => {
          const existing = getLogForDate(day.date);
          if (!existing && day.completedGoals > 0) {
            // We don't know which specific goals, but we can mark based on count
            saveDailyLog({
              date: day.date,
              protein: day.completedGoals >= 1,
              steps: day.completedGoals >= 2,
              water: day.completedGoals >= 3,
              workout: day.completedGoals >= 4,
            });
          }
        });
      }
    } catch (e) {
      console.error('Failed to migrate streak data', e);
    }
  }
};
