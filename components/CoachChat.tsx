import React, { useState, useRef, useEffect } from 'react';
import { getDailyAdvice } from '../services/geminiService';
import { DayOfWeek } from '../types';
import Markdown from 'react-markdown';

const CoachChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [day, setDay] = useState<string>(new Date().toLocaleDateString('en-US', { weekday: 'long' }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    // Simple history management for this session
    const advice = await getDailyAdvice(input, day, []);
    setResponse(advice);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden">
      <div className="bg-indigo-600 p-6 text-white">
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">Daily Coach Check-In</h2>
            <select 
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="bg-indigo-700 text-white text-sm rounded px-2 py-1 border border-indigo-500 outline-none"
            >
                {Object.values(DayOfWeek).map(d => (
                    <option key={d} value={d}>{d}</option>
                ))}
            </select>
        </div>
        <p className="text-indigo-100 opacity-90">
          Wake up, tell me how you feel (sleep, stress, energy levels), and I'll build your day.
        </p>
      </div>

      <div className="p-6">
        {!response && (
            <form onSubmit={handleSubmit} className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
                How are you feeling this morning?
            </label>
            <div className="flex gap-2">
                <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., Slept 5 hours, feeling okay..."
                className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                disabled={loading}
                />
                <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    'Ask Coach'
                )}
                </button>
            </div>
            </form>
        )}

        {response && (
          <div className="animate-fade-in">
             <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-100 prose prose-indigo max-w-none">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-indigo-900 mt-0">Your Plan for {day}</h3>
                    <button 
                        onClick={() => { setResponse(null); setInput(''); }}
                        className="text-xs text-indigo-500 hover:text-indigo-700 underline"
                    >
                        Reset Check-in
                    </button>
                </div>
                <Markdown>{response}</Markdown>
             </div>
          </div>
        )}
        
        {!response && (
            <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => setInput("Slept great, feeling ready!")} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-full transition">
                    Slept great
                </button>
                <button onClick={() => setInput("Slept poorly (<6 hours).")} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-full transition">
                    Low sleep
                </button>
                <button onClick={() => setInput("Feeling a mild flare up starting.")} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-full transition">
                    Mild Flare
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default CoachChat;
