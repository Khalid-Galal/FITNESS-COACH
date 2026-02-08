import React, { useState, useEffect } from 'react';
import { getRecentLogs, getStats, DailyLogEntry } from '../services/dailyLogService';

const DailyLogHistory: React.FC = () => {
  const [logs, setLogs] = useState<DailyLogEntry[]>([]);
  const [stats, setStats] = useState(getStats(30));
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const loadData = () => {
      setLogs(getRecentLogs(showAll ? 90 : 14));
      setStats(getStats(30));
    };

    loadData();

    // Listen for storage changes
    const handleStorage = () => loadData();
    window.addEventListener('storage', handleStorage);

    // Also refresh periodically
    const interval = setInterval(loadData, 5000);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, [showAll]);

  const getCompletionCount = (log: DailyLogEntry): number => {
    return [log.protein, log.steps, log.water, log.workout].filter(Boolean).length;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (dateStr === today) return 'Today';
    if (dateStr === yesterday) return 'Yesterday';

    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const GoalIcon: React.FC<{ completed: boolean; label: string; color: string }> = ({
    completed,
    label,
    color,
  }) => (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
        completed
          ? `${color} text-white shadow-sm`
          : 'bg-slate-100 text-slate-300'
      }`}
      title={label}
    >
      {completed ? '✓' : label.charAt(0)}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-slate-800">Daily Goal History</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Last 30 days:</span>
          <span className="text-sm font-semibold text-emerald-600">{stats.perfectRate}% perfect</span>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="text-center p-2 bg-indigo-50 rounded-lg">
          <div className="text-lg font-bold text-indigo-600">{stats.proteinRate}%</div>
          <div className="text-xs text-slate-500">Protein</div>
        </div>
        <div className="text-center p-2 bg-emerald-50 rounded-lg">
          <div className="text-lg font-bold text-emerald-600">{stats.stepsRate}%</div>
          <div className="text-xs text-slate-500">Steps</div>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">{stats.waterRate}%</div>
          <div className="text-xs text-slate-500">Water</div>
        </div>
        <div className="text-center p-2 bg-amber-50 rounded-lg">
          <div className="text-lg font-bold text-amber-600">{stats.workoutRate}%</div>
          <div className="text-xs text-slate-500">Workout</div>
        </div>
      </div>

      {/* Log Entries */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-2 text-slate-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-sm">No logs yet. Complete daily goals to see history!</p>
          </div>
        ) : (
          logs.map((log) => {
            const count = getCompletionCount(log);
            return (
              <div
                key={log.date}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  count === 4
                    ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200'
                    : count >= 3
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-white border-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-left min-w-[80px]">
                    <div className="text-sm font-medium text-slate-700">
                      {formatDate(log.date)}
                    </div>
                    <div className="text-xs text-slate-400">{count}/4 goals</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <GoalIcon completed={log.protein} label="Protein" color="bg-indigo-500" />
                  <GoalIcon completed={log.steps} label="Steps" color="bg-emerald-500" />
                  <GoalIcon completed={log.water} label="Water" color="bg-blue-500" />
                  <GoalIcon completed={log.workout} label="Workout" color="bg-amber-500" />
                </div>

                {count === 4 && (
                  <span className="text-lg ml-2" title="Perfect day!">
                    🌟
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Show More Button */}
      {logs.length > 0 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 py-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
        >
          {showAll ? 'Show less' : 'Show more history'}
        </button>
      )}
    </div>
  );
};

export default DailyLogHistory;
