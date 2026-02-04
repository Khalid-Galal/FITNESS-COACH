import React, { useState } from 'react';

const DailyChecklist: React.FC = () => {
  const [checklist, setChecklist] = useState({
    protein: false,
    steps: false,
    water: false,
    workout: false,
    sleepRecorded: false,
  });

  const toggle = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Daily Tracking</h3>
      <div className="space-y-3">
        <button 
          onClick={() => toggle('protein')}
          className={`w-full flex items-center p-3 rounded-lg border transition-all ${checklist.protein ? 'bg-green-50 border-green-200 text-green-700' : 'hover:bg-slate-50 border-slate-200'}`}
        >
          <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${checklist.protein ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
            {checklist.protein && <span className="text-white text-xs">✓</span>}
          </div>
          <span className="flex-1 text-left">Hit 135g Protein</span>
        </button>

        <button 
          onClick={() => toggle('steps')}
          className={`w-full flex items-center p-3 rounded-lg border transition-all ${checklist.steps ? 'bg-green-50 border-green-200 text-green-700' : 'hover:bg-slate-50 border-slate-200'}`}
        >
          <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${checklist.steps ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
            {checklist.steps && <span className="text-white text-xs">✓</span>}
          </div>
          <span className="flex-1 text-left">Steps Goal (Start: 6.5k → Goal: 10k)</span>
        </button>

        <button 
          onClick={() => toggle('water')}
          className={`w-full flex items-center p-3 rounded-lg border transition-all ${checklist.water ? 'bg-green-50 border-green-200 text-green-700' : 'hover:bg-slate-50 border-slate-200'}`}
        >
          <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${checklist.water ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
            {checklist.water && <span className="text-white text-xs">✓</span>}
          </div>
          <span className="flex-1 text-left">Drink 2.5L - 3.0L Water</span>
        </button>

        <button 
          onClick={() => toggle('workout')}
          className={`w-full flex items-center p-3 rounded-lg border transition-all ${checklist.workout ? 'bg-green-50 border-green-200 text-green-700' : 'hover:bg-slate-50 border-slate-200'}`}
        >
          <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${checklist.workout ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
            {checklist.workout && <span className="text-white text-xs">✓</span>}
          </div>
          <span className="flex-1 text-left">Completed Prescribed Activity</span>
        </button>
      </div>
    </div>
  );
};

export default DailyChecklist;
