import React from 'react';
import { ChevronDown, ChevronRight, Hash } from 'lucide-react';

const StepByStepPanel = ({ steps }) => {
  const [expanded, setExpanded] = React.useState(true);

  if (!steps || steps.length === 0) return null;

  return (
    <div className="mt-8 border border-gray-800 rounded-lg overflow-hidden">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full bg-gray-900 p-4 flex items-center justify-between text-gray-300 hover:text-green-400 hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center space-x-2 font-semibold">
          <Hash size={18} />
          <span>Mathematical Steps Breakdown</span>
        </div>
        {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>
      
      {expanded && (
        <div className="bg-gray-950 p-4 space-y-4">
          {steps.map((step, idx) => (
            <div key={idx} className="border-l-2 border-gray-700 pl-4 py-1">
              <div className="text-xs text-green-400 font-mono mb-1">Step {idx + 1}: {step.label}</div>
              <div className="font-mono text-gray-300 text-sm break-all bg-gray-900 p-2 rounded-md">
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
