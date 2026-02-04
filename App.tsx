import React, { useState } from 'react';
import CoachChat from './components/CoachChat';
import DailyChecklist from './components/DailyChecklist';
import ProgressTracker from './components/ProgressTracker';
import PlanViewer from './components/PlanViewer';

const App: React.FC = () => {
  const [showPlan, setShowPlan] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-10">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                F
             </div>
             <h1 className="text-lg font-bold text-slate-800 tracking-tight">Fitness Coach</h1>
          </div>
          <button 
            onClick={() => setShowPlan(true)}
            className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
          >
            View Full Plan
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        
        {/* Quick Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
              <span className="block text-xs text-slate-400 uppercase font-semibold mb-1">Calories</span>
              <span className="block text-lg font-bold text-slate-800">1900-2100</span>
           </div>
           <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
              <span className="block text-xs text-slate-400 uppercase font-semibold mb-1">Protein</span>
              <span className="block text-lg font-bold text-indigo-600">135g</span>
           </div>
           <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
              <span className="block text-xs text-slate-400 uppercase font-semibold mb-1">Water</span>
              <span className="block text-lg font-bold text-blue-500">2.5L</span>
           </div>
           <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
              <span className="block text-xs text-slate-400 uppercase font-semibold mb-1">Waist Goal</span>
              <span className="block text-lg font-bold text-green-600">-6cm</span>
           </div>
        </div>

        {/* AI Interface */}
        <CoachChat />

        {/* Daily Tracking */}
        <DailyChecklist />

        {/* Weekly Progress Tracker */}
        <ProgressTracker />

        {/* Workout Quick Reference (Static) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 opacity-80 hover:opacity-100 transition-opacity">
           <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Workout Reference</h3>
           <div className="space-y-4">
             <details className="group">
               <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-slate-700 hover:text-indigo-600">
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
               <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-slate-700 hover:text-indigo-600">
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
               <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-slate-700 hover:text-indigo-600">
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