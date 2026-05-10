import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CopyableField = ({ label, value, multiline = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-end mb-1">
        <label className="block text-sm font-medium text-gray-400">{label}</label>
        <button
          onClick={handleCopy}
          className="text-xs flex items-center space-x-1 text-green-400 hover:text-green-400/80 transition-colors"
          title="Copy to clipboard"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      {multiline ? (
        <textarea
          readOnly
          value={value}
          className="w-full bg-[#161616] border border-[#2a2a2a] rounded-md p-3 text-sm font-mono text-gray-100 focus:outline-none resize-none h-24 scrollbar-thin"
        />
      ) : (
        <input
          type="text"
          readOnly
          value={value}
          className="w-full bg-[#161616] border border-[#2a2a2a] rounded-md p-3 text-sm font-mono text-gray-100 focus:outline-none overflow-x-auto"
        />
      )}
    </div>
  );
};

export default CopyableField;
