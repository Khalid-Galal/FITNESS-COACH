import React from 'react';
import { PLAN_TEXT } from '../constants';

interface PlanViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlanViewer: React.FC<PlanViewerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end" onClick={onClose}>
      <div
        className="w-full sm:max-w-2xl bg-white h-full shadow-2xl overflow-y-auto animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center sticky top-0 bg-white p-4 sm:p-6 border-b z-10">
          <h2 className="text-lg sm:text-2xl font-bold text-slate-800">Full Reference Plan</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 sm:p-6 prose prose-slate max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-sm text-slate-600 leading-relaxed">
            {PLAN_TEXT}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default PlanViewer;
