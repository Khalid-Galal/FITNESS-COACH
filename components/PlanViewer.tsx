import React from 'react';
import { PLAN_TEXT } from '../constants';

interface PlanViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlanViewer: React.FC<PlanViewerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto p-6 animate-slide-in-right">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white py-4 border-b">
          <h2 className="text-2xl font-bold text-slate-800">Full Reference Plan</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full"
          >
            ✕
          </button>
        </div>
        <div className="prose prose-slate max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm text-slate-600 leading-relaxed">
                {PLAN_TEXT}
            </pre>
        </div>
      </div>
    </div>
  );
};

export default PlanViewer;
