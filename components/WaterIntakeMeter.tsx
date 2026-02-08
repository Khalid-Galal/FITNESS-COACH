import React, { useState, useEffect } from 'react';
import { updateTodayGoal, getTodayLog } from '../services/dailyLogService';

const WATER_STORAGE_KEY = 'fitness_water_intake';

interface WaterData {
  date: string;
  glasses: number; // Each glass = 250ml
}

const GLASS_SIZE = 250; // ml
const DAILY_GOAL = 2500; // ml (2.5L)
const MAX_GLASSES = Math.ceil(3000 / GLASS_SIZE); // Support up to 3L

const WaterIntakeMeter: React.FC = () => {
  const [waterData, setWaterData] = useState<WaterData>({
    date: new Date().toISOString().split('T')[0],
    glasses: 0,
  });

  // Load from localStorage and daily log service
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];

    // First try to get from today's log
    const todayLog = getTodayLog();
    if (todayLog?.waterGlasses !== undefined) {
      setWaterData({ date: today, glasses: todayLog.waterGlasses });
      return;
    }

    // Fallback to old localStorage
    const saved = localStorage.getItem(WATER_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date === today) {
          setWaterData(parsed);
        } else {
          // Reset for new day
          setWaterData({ date: today, glasses: 0 });
        }
      } catch (e) {
        console.error("Failed to parse water data", e);
      }
    }
  }, []);

  // Save to localStorage and daily log service
  useEffect(() => {
    localStorage.setItem(WATER_STORAGE_KEY, JSON.stringify(waterData));

    const currentMl = waterData.glasses * GLASS_SIZE;
    const isGoalMet = currentMl >= DAILY_GOAL;

    // Save to daily log history with water glasses count
    updateTodayGoal('water', isGoalMet, { waterGlasses: waterData.glasses });

    // Also update the daily checklist water status (for backward compatibility)
    const checklistData = localStorage.getItem('fitness_daily_checklist');
    if (checklistData) {
      try {
        const checklist = JSON.parse(checklistData);
        const today = new Date().toISOString().split('T')[0];
        if (checklist.date === today) {
          checklist.water = isGoalMet;
          localStorage.setItem('fitness_daily_checklist', JSON.stringify(checklist));
        }
      } catch (e) {
        console.error("Failed to update checklist", e);
      }
    }
  }, [waterData]);

  const addGlass = () => {
    if (waterData.glasses < MAX_GLASSES) {
      setWaterData(prev => ({ ...prev, glasses: prev.glasses + 1 }));
    }
  };

  const removeGlass = () => {
    if (waterData.glasses > 0) {
      setWaterData(prev => ({ ...prev, glasses: prev.glasses - 1 }));
    }
  };

  const currentMl = waterData.glasses * GLASS_SIZE;
  const progress = Math.min(currentMl / DAILY_GOAL, 1);
  const progressPercent = Math.round(progress * 100);
  const isGoalMet = currentMl >= DAILY_GOAL;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-slate-800">Water Intake</h3>
        <span className={`text-sm font-medium ${isGoalMet ? 'text-emerald-600' : 'text-slate-500'}`}>
          {(currentMl / 1000).toFixed(1)}L / {(DAILY_GOAL / 1000).toFixed(1)}L
        </span>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {/* Water Bottle Visualization */}
        <div className="relative flex-shrink-0">
          <svg width="60" height="120" viewBox="0 0 60 120" className="drop-shadow-sm">
            {/* Bottle outline */}
            <path
              d="M20 15 L20 5 L40 5 L40 15 L45 25 L45 110 Q45 115 40 115 L20 115 Q15 115 15 110 L15 25 Z"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="2"
            />

            {/* Water fill - clip path */}
            <defs>
              <clipPath id="bottleClip">
                <path d="M21 16 L21 6 L39 6 L39 16 L44 25 L44 109 Q44 114 39 114 L21 114 Q16 114 16 109 L16 25 Z" />
              </clipPath>
            </defs>

            {/* Water fill */}
            <rect
              x="15"
              y={115 - (progress * 100)}
              width="30"
              height={progress * 100}
              fill="url(#waterGradient)"
              clipPath="url(#bottleClip)"
              className="transition-all duration-500 ease-out"
            />

            {/* Water gradient */}
            <defs>
              <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>

            {/* Bottle cap */}
            <rect x="22" y="2" width="16" height="5" rx="2" fill="#94a3b8" />

            {/* Water wave effect */}
            {progress > 0 && (
              <ellipse
                cx="30"
                cy={115 - (progress * 100)}
                rx="13"
                ry="3"
                fill="#93c5fd"
                className="animate-pulse"
              />
            )}
          </svg>

          {/* Percentage badge */}
          <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isGoalMet ? 'bg-emerald-500 text-white' : 'bg-blue-100 text-blue-600'}`}>
            {isGoalMet ? '✓' : `${progressPercent}%`}
          </div>
        </div>

        {/* Controls and glasses */}
        <div className="flex-1">
          {/* Glass count */}
          <div className="flex flex-wrap gap-1 mb-3">
            {Array.from({ length: MAX_GLASSES }).map((_, i) => (
              <div
                key={i}
                className={`w-6 h-8 rounded-sm border-2 transition-all duration-300 ${
                  i < waterData.glasses
                    ? 'bg-blue-400 border-blue-500'
                    : 'bg-slate-50 border-slate-200'
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={removeGlass}
              disabled={waterData.glasses === 0}
              className="flex-1 py-2 px-3 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[44px] text-sm font-medium"
            >
              - Glass
            </button>
            <button
              onClick={addGlass}
              disabled={waterData.glasses >= MAX_GLASSES}
              className="flex-1 py-2 px-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[44px] text-sm font-medium"
            >
              + Glass
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-2 text-center">
            Each glass = {GLASS_SIZE}ml
          </p>
        </div>
      </div>

      {isGoalMet && (
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100 text-center animate-fade-in">
          <span className="text-blue-700 font-medium text-sm">
            💧 Daily water goal achieved!
          </span>
        </div>
      )}
    </div>
  );
};

export default WaterIntakeMeter;
