import React, { useState } from 'react';
import CoachChat from './components/CoachChat';
import DailyChecklist from './components/DailyChecklist';
import ProgressTracker from './components/ProgressTracker';
import PlanViewer from './components/PlanViewer';
import ProgressChart from './components/ProgressChart';
import DailyProgressRings from './components/DailyProgressRings';
import WeeklyStreakCalendar from './components/WeeklyStreakCalendar';
import WaterIntakeMeter from './components/WaterIntakeMeter';
import WorkoutBadges from './components/WorkoutBadges';
import DailyLogHistory from './components/DailyLogHistory';

const App: React.FC = () => {
  const [showPlan, setShowPlan] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-10">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-8 h-8">
               <rect width="100" height="100" rx="20" fill="#1e1b4b"/>
               <circle cx="50" cy="50" r="30" fill="none" stroke="#4338ca" strokeWidth="6"/>
               <circle cx="50" cy="50" r="30" fill="none" stroke="#818cf8" strokeWidth="6" strokeDasharray="140 188" strokeLinecap="round" transform="rotate(-90 50 50)"/>
               <g fill="#a5b4fc">
                 <rect x="35" y="46" width="8" height="8" rx="1"/>
                 <rect x="57" y="46" width="8" height="8" rx="1"/>
                 <rect x="41" y="48" width="18" height="4" rx="1"/>
               </g>
             </svg>
             <h1 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">Fitness Coach</h1>
          </div>
          <button
            onClick={() => setShowPlan(true)}
            className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-slate-50 min-h-[44px]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden sm:inline">View Full Plan</span>
            <span className="sm:hidden">Plan</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">

        {/* Quick Status Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
           <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-100 text-center">
              <span className="block text-xs text-slate-400 uppercase font-semibold mb-1">Calories</span>
              <span className="block text-base sm:text-lg font-bold text-slate-800">1900-2100</span>
           </div>
           <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-100 text-center">
              <span className="block text-xs text-slate-400 uppercase font-semibold mb-1">Protein</span>
              <span className="block text-base sm:text-lg font-bold text-indigo-600">135g</span>
           </div>
           <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-100 text-center">
              <span className="block text-xs text-slate-400 uppercase font-semibold mb-1">Water</span>
              <span className="block text-base sm:text-lg font-bold text-blue-500">2.5L</span>
           </div>
           <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-100 text-center">
              <span className="block text-xs text-slate-400 uppercase font-semibold mb-1">Waist Goal</span>
              <span className="block text-base sm:text-lg font-bold text-green-600">-6cm</span>
           </div>
        </div>

        {/* AI Interface */}
        <CoachChat />

        {/* Daily Progress Rings - Interactive Goals */}
        <DailyProgressRings />

        {/* Two Column Layout for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Water Intake Meter */}
          <WaterIntakeMeter />

          {/* Weekly Streak Calendar */}
          <WeeklyStreakCalendar />
        </div>

        {/* Workout Badges */}
        <WorkoutBadges />

        {/* Progress Trend Chart */}
        <ProgressChart entries={[]} />

        {/* Daily Goal History */}
        <DailyLogHistory />

        {/* Weekly Progress Tracker - Data Entry */}
        <ProgressTracker />

        {/* Daily Tracking - Old checklist (hidden on mobile, shown as backup) */}
        <div className="hidden lg:block">
          <DailyChecklist />
        </div>

        {/* Workout Quick Reference (Static) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 opacity-90 hover:opacity-100 transition-opacity">
           <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-4">Quick Workout Reference</h3>
           <div className="space-y-4">
             <details className="group">
               <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-slate-700 hover:text-indigo-600 py-2">
                 <span>Full Body A (Monday)</span>
                 <span className="transition group-open:rotate-180">
                   <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                 </span>
               </summary>
               <div className="text-slate-600 mt-3 pl-4 border-l-2 border-indigo-100 text-sm space-y-1">
                 <p>1. Goblet Squat: 3×8–12</p>
                 <p>2. Push-ups: 3×6–12</p>
                 <p>3. 1-Arm Row: 3×8–12/side</p>
                 <p>4. RDL: 3×8–12</p>
                 <p>5. Suitcase Carry: 3×30–45s/side</p>
               </div>
             </details>

             <details className="group">
               <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-slate-700 hover:text-indigo-600 py-2">
                 <span>Full Body B (Wednesday)</span>
                 <span className="transition group-open:rotate-180">
                   <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                 </span>
               </summary>
               <div className="text-slate-600 mt-3 pl-4 border-l-2 border-indigo-100 text-sm space-y-1">
                 <p>1. Split Squat: 3×8–12/side</p>
                 <p>2. Overhead Press: 3×6–12</p>
                 <p>3. Band Row: 3×10–15</p>
                 <p>4. Glute Bridge: 3×10–15</p>
                 <p>5. Calves: 2×12–20</p>
               </div>
             </details>

             <details className="group">
               <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-slate-700 hover:text-indigo-600 py-2">
                 <span>Full Body C (Friday)</span>
                 <span className="transition group-open:rotate-180">
                   <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                 </span>
               </summary>
               <div className="text-slate-600 mt-3 pl-4 border-l-2 border-indigo-100 text-sm space-y-1">
                 <p>1. Step-ups: 3×8–12/side</p>
                 <p>2. Incline Push-up: 3×8–12</p>
                 <p>3. Band Lat Pulldown: 3×10–15</p>
                 <p>4. Good Morning: 3×10–15</p>
                 <p>5. Arms/Shoulders: 2×12–15</p>
               </div>
             </details>
           </div>
        </div>

      </main>

      <PlanViewer isOpen={showPlan} onClose={() => setShowPlan(false)} />
    </div>
  );
};

export default App;
