'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CopyableField = ({ label, value, isMonospace = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-4">
      <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">{label}</div>
      <div className="flex bg-gray-950 border border-gray-700 rounded-md overflow-hidden focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
        <div className={`flex-1 p-3 overflow-x-auto whitespace-nowrap ${isMonospace ? 'font-mono text-sm text-green-400' : 'text-gray-100'}`}>
          {value || <span className="text-gray-600 italic">Not available</span>}
        </div>
        <button 
          onClick={handleCopy}
          disabled={!value}
          className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 flex items-center justify-center transition-colors border-l border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Copy to clipboard"
        >
          {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
        </button>
      </div>
    </div>
  );
};

export default CopyableField;
