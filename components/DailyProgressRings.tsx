import React, { useState, useEffect } from 'react';

const CHECKLIST_STORAGE_KEY = 'fitness_daily_checklist';

interface DailyChecklistData {
  date: string;
  protein: boolean;
  steps: boolean;
  water: boolean;
  workout: boolean;
}

interface RingProps {
  progress: number;
  color: string;
  bgColor: string;
  size: number;
  strokeWidth: number;
  icon: React.ReactNode;
  label: string;
  completed: boolean;
  onClick?: () => void;
}

const Ring: React.FC<RingProps> = ({ progress, color, bgColor, size, strokeWidth, icon, label, completed, onClick }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center transition-transform active:scale-95 ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={bgColor}
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        {/* Icon in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`transition-colors duration-300 ${completed ? 'text-current' : 'text-slate-400'}`} style={{ color: completed ? color : undefined }}>
            {icon}
          </div>
        </div>
      </div>
      <span className={`text-xs mt-2 font-medium transition-colors ${completed ? 'text-slate-700' : 'text-slate-400'}`}>
        {label}
      </span>
    </button>
  );
};

const DailyProgressRings: React.FC = () => {
  const [checklist, setChecklist] = useState<DailyChecklistData>({
    date: new Date().toISOString().split('T')[0],
    protein: false,
    steps: false,
    water: false,
    workout: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date === new Date().toISOString().split('T')[0]) {
          setChecklist(parsed);
        }
      } catch (e) {
        console.error("Failed to parse checklist", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checklist));
  }, [checklist]);

  const toggle = (key: keyof Omit<DailyChecklistData, 'date'>) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = [checklist.protein, checklist.steps, checklist.water, checklist.workout].filter(Boolean).length;
  const totalProgress = completedCount / 4;

  const ringSize = 64;
  const strokeWidth = 5;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-slate-800">Today's Goals</h3>
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 sm:w-24 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${totalProgress * 100}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">{completedCount}/4</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        <Ring
          progress={checklist.protein ? 1 : 0}
          color="#6366f1"
          bgColor="#e0e7ff"
          size={ringSize}
          strokeWidth={strokeWidth}
          completed={checklist.protein}
          onClick={() => toggle('protein')}
          label="Protein"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          }
        />

        <Ring
          progress={checklist.steps ? 1 : 0}
          color="#10b981"
          bgColor="#d1fae5"
          size={ringSize}
          strokeWidth={strokeWidth}
          completed={checklist.steps}
          onClick={() => toggle('steps')}
          label="Steps"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />

        <Ring
          progress={checklist.water ? 1 : 0}
          color="#3b82f6"
          bgColor="#dbeafe"
          size={ringSize}
          strokeWidth={strokeWidth}
          completed={checklist.water}
          onClick={() => toggle('water')}
          label="Water"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          }
        />

        <Ring
          progress={checklist.workout ? 1 : 0}
          color="#f59e0b"
          bgColor="#fef3c7"
          size={ringSize}
          strokeWidth={strokeWidth}
          completed={checklist.workout}
          onClick={() => toggle('workout')}
          label="Workout"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          }
        />
      </div>

      {completedCount === 4 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-100 text-center animate-fade-in">
          <span className="text-emerald-700 font-medium text-sm">
            Perfect day! All goals completed!
          </span>
        </div>
      )}
    </div>
  );
};

export default DailyProgressRings;
