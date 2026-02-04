import React, { useState, useEffect } from 'react';

interface MetricEntry {
  id: number;
  date: string;
  waist: string;
  weight: string;
  photosTaken: boolean;
}

const STORAGE_KEY = 'fitness_progress_metrics';

const ProgressTracker: React.FC = () => {
  const [entries, setEntries] = useState<MetricEntry[]>([]);
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Weekly Progress Tracker</h3>
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Local History</span>
      </div>
      
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input 
              type="date" 
              required
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
          <div>
             {/* Spacer or additional header info could go here */}
             <div className="hidden md:block text-xs text-slate-400 mt-7">
               Track weekly to see true trends.
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Waist <span className="text-xs text-slate-400 font-normal">(cm)</span>
            </label>
            <input 
              type="number" 
              step="0.1"
              placeholder="e.g. 95.5"
              value={formData.waist}
              onChange={(e) => setFormData({...formData, waist: e.target.value})}
              className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Weight <span className="text-xs text-slate-400 font-normal">(kg)</span>
            </label>
            <input 
              type="number" 
              step="0.1"
              placeholder="e.g. 82.0"
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
              className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.photosTaken}
              onChange={(e) => setFormData({...formData, photosTaken: e.target.checked})}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-slate-700">Photos taken? <span className="text-xs text-slate-400">(Front/Side)</span></span>
          </label>
          
          <button 
            type="submit" 
            className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Log Entry
          </button>
        </div>
      </form>

      {/* History Table */}
      <div className="overflow-x-auto">
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
            {entries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400 italic">
                  No entries yet. Start tracking your wins!
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgressTracker;