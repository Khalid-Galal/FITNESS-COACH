import React, { useState, useEffect } from 'react';

const CHECKLIST_STORAGE_KEY = 'fitness_daily_checklist';

interface DailyChecklistData {
  date: string;
  protein: boolean;
  steps: boolean;
  water: boolean;
  workout: boolean;
}

const getToday = () => new Date().toISOString().split('T')[0];

const DailyChecklist: React.FC = () => {
  const [checklist, setChecklist] = useState<DailyChecklistData>({
    date: getToday(),
    protein: false,
    steps: false,
    water: false,
    workout: false,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Reset if it's a new day
        if (parsed.date === getToday()) {
          setChecklist(parsed);
        }
      } catch (e) {
        console.error("Failed to parse checklist", e);
      }
    }
  }, []);

  // Save to localStorage whenever checklist changes
  useEffect(() => {
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checklist));
  }, [checklist]);

  const toggle = (key: keyof Omit<DailyChecklistData, 'date'>) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-4">Daily Tracking</h3>
      <div className="space-y-2 sm:space-y-3">
        <button
          onClick={() => toggle('protein')}
          className={`w-full flex items-center p-3 sm:p-4 rounded-lg border transition-all min-h-[52px] ${checklist.protein ? 'bg-green-50 border-green-200 text-green-700' : 'hover:bg-slate-50 border-slate-200 active:bg-slate-100'}`}
        >
          <div className={`w-6 h-6 rounded border mr-3 flex items-center justify-center flex-shrink-0 ${checklist.protein ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
            {checklist.protein && <span className="text-white text-sm">✓</span>}
          </div>
          <span className="flex-1 text-left text-sm sm:text-base">Hit 135g Protein</span>
        </button>

        <button
          onClick={() => toggle('steps')}
          className={`w-full flex items-center p-3 sm:p-4 rounded-lg border transition-all min-h-[52px] ${checklist.steps ? 'bg-green-50 border-green-200 text-green-700' : 'hover:bg-slate-50 border-slate-200 active:bg-slate-100'}`}
        >
          <div className={`w-6 h-6 rounded border mr-3 flex items-center justify-center flex-shrink-0 ${checklist.steps ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
            {checklist.steps && <span className="text-white text-sm">✓</span>}
          </div>
          <span className="flex-1 text-left text-sm sm:text-base">Steps Goal (6.5k → 10k)</span>
        </button>

        <button
          onClick={() => toggle('water')}
          className={`w-full flex items-center p-3 sm:p-4 rounded-lg border transition-all min-h-[52px] ${checklist.water ? 'bg-green-50 border-green-200 text-green-700' : 'hover:bg-slate-50 border-slate-200 active:bg-slate-100'}`}
        >
          <div className={`w-6 h-6 rounded border mr-3 flex items-center justify-center flex-shrink-0 ${checklist.water ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
            {checklist.water && <span className="text-white text-sm">✓</span>}
          </div>
          <span className="flex-1 text-left text-sm sm:text-base">Drink 2.5L - 3.0L Water</span>
        </button>

        <button
          onClick={() => toggle('workout')}
          className={`w-full flex items-center p-3 sm:p-4 rounded-lg border transition-all min-h-[52px] ${checklist.workout ? 'bg-green-50 border-green-200 text-green-700' : 'hover:bg-slate-50 border-slate-200 active:bg-slate-100'}`}
        >
          <div className={`w-6 h-6 rounded border mr-3 flex items-center justify-center flex-shrink-0 ${checklist.workout ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
            {checklist.workout && <span className="text-white text-sm">✓</span>}
          </div>
          <span className="flex-1 text-left text-sm sm:text-base">Completed Prescribed Activity</span>
        </button>
      </div>
    </div>
  );
};

export default DailyChecklist;
