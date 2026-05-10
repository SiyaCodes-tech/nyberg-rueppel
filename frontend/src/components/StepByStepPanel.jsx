import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const StepByStepPanel = ({ steps }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!steps || steps.length === 0) return null;

  return (
    <div className="mt-8 border border-border rounded-lg overflow-hidden bg-surface">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center bg-[#1a1a1a] hover:bg-[#1f1f1f] transition-colors"
      >
        <span className="font-semibold text-textMain flex items-center gap-2">
          Step-by-step breakdown
        </span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      
      {isOpen && (
        <div className="p-4 space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="step-box">
              <div className="text-sm font-medium text-primary mb-1">
                Step {index + 1}: {step.label}
              </div>
              <div className="font-mono text-sm text-textMuted break-all bg-black/30 p-2 rounded">
                {step.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StepByStepPanel;
