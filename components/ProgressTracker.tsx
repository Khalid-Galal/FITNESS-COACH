import React, { useState, useEffect, useRef } from 'react';
import { exportLogs, importLogs, DailyLogEntry } from '../services/dailyLogService';

interface MetricEntry {
  id: number;
  date: string;
  waist: string;
  weight: string;
  photosTaken: boolean;
}

const STORAGE_KEY = 'fitness_progress_metrics';
const CHECKLIST_STORAGE_KEY = 'fitness_daily_checklist';
const WORKOUT_STORAGE_KEY = 'fitness_workout_badges';
const WATER_STORAGE_KEY = 'fitness_water_intake';

const ProgressTracker: React.FC = () => {
  const [entries, setEntries] = useState<MetricEntry[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    waist: '',
    weight: '',
    photosTaken: false
  });

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse metrics", e);
      }
    }
  }, []);

  // Save to local storage whenever entries change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate that at least one metric is provided
    if (!formData.waist && !formData.weight && !formData.photosTaken) return;
    
    const newEntry: MetricEntry = {
      id: Date.now(),
      date: formData.date,
      waist: formData.waist,
      weight: formData.weight,
      photosTaken: formData.photosTaken
    };

    // Add new entry and sort by date descending
    setEntries(prev => [newEntry, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    
    // Reset form fields
    setFormData(prev => ({
      ...prev,
      waist: '',
      weight: '',
      photosTaken: false
    }));
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleExport = () => {
    const exportData = {
      version: 2,
      exportedAt: new Date().toISOString(),
      progressMetrics: entries,
      dailyChecklist: JSON.parse(localStorage.getItem(CHECKLIST_STORAGE_KEY) || '{}'),
      dailyLogs: exportLogs(), // All historical daily goal logs
      workoutBadges: JSON.parse(localStorage.getItem(WORKOUT_STORAGE_KEY) || '[]'),
      waterIntake: JSON.parse(localStorage.getItem(WATER_STORAGE_KEY) || '{}'),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitness-coach-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importData = JSON.parse(event.target?.result as string);

        // Import progress metrics (weight/waist)
        if (importData.progressMetrics && Array.isArray(importData.progressMetrics)) {
          setEntries(importData.progressMetrics);
        }

        // Import daily checklist (today's status)
        if (importData.dailyChecklist) {
          localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(importData.dailyChecklist));
        }

        // Import daily logs history (new in version 2)
        if (importData.dailyLogs && Array.isArray(importData.dailyLogs)) {
          importLogs(importData.dailyLogs as DailyLogEntry[], true); // Merge with existing
        }

        // Import workout badges
        if (importData.workoutBadges && Array.isArray(importData.workoutBadges)) {
          localStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify(importData.workoutBadges));
        }

        // Import water intake
        if (importData.waterIntake) {
          localStorage.setItem(WATER_STORAGE_KEY, JSON.stringify(importData.waterIntake));
        }

        alert('Data imported successfully! Refresh the page to see all updates.');
      } catch (err) {
        alert('Failed to import data. Please check the file format.');
        console.error('Import error:', err);
      }
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-slate-800">Weekly Progress Tracker</h3>
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full self-start sm:self-auto">Local History</span>
      </div>
      
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mb-6 sm:mb-8 p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-100">
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:border-indigo-500 text-base"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Waist <span className="text-xs text-slate-400 font-normal">(cm)</span>
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="95.5"
              value={formData.waist}
              onChange={(e) => setFormData({...formData, waist: e.target.value})}
              className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:border-indigo-500 text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Weight <span className="text-xs text-slate-400 font-normal">(kg)</span>
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="82.0"
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
              className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:border-indigo-500 text-base"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.photosTaken}
              onChange={(e) => setFormData({...formData, photosTaken: e.target.checked})}
              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-slate-700">Photos taken? <span className="text-xs text-slate-400">(Front/Side)</span></span>
          </label>

          <button
            type="submit"
            className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto min-h-[48px]"
          >
            Log Entry
          </button>
        </div>
      </form>

      {/* History - Mobile Cards / Desktop Table */}
      {entries.length === 0 ? (
        <div className="px-4 py-6 text-center text-slate-400 italic">
          No entries yet. Start tracking your wins!
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3">
            {entries.map((entry) => (
              <div key={entry.id} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-slate-800">
                    {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-slate-400 text-xs block">Waist</span>
                    <span className="text-slate-700 font-medium">{entry.waist ? `${entry.waist} cm` : '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">Weight</span>
                    <span className="text-slate-700 font-medium">{entry.weight ? `${entry.weight} kg` : '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">Photos</span>
                    {entry.photosTaken ? (
                      <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium">Done</span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Waist</th>
                  <th className="px-4 py-3 font-semibold">Weight</th>
                  <th className="px-4 py-3 font-semibold">Photos</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      {entry.waist ? `${entry.waist} cm` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {entry.weight ? `${entry.weight} kg` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {entry.photosTaken ? (
                        <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium">Done</span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Data Management */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="text-xs text-slate-500">Backup your progress data</span>
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-none text-sm px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors min-h-[44px]"
            >
              Import
            </button>
            <button
              onClick={handleExport}
              className="flex-1 sm:flex-none text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors min-h-[44px]"
            >
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;