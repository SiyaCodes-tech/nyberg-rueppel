import React from 'react';
import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const InfoBanner = ({ type = 'info', message }) => {
  const types = {
    info: { icon: <Info size={20} />, classes: 'bg-blue-900/20 text-blue-400 border-l-4 border-blue-500' },
    warning: { icon: <AlertTriangle size={20} />, classes: 'bg-amber-900/20 text-amber-500 border-l-4 border-amber-500' },
    success: { icon: <CheckCircle size={20} />, classes: 'bg-green-500/10 text-green-500 border-l-4 border-green-500' },
    error: { icon: <XCircle size={20} />, classes: 'bg-red-500/10 text-red-500 border-l-4 border-red-500' },
  };

  const { icon, classes } = types[type] || types.info;

  return (
    <div className={`flex items-start space-x-3 p-4 rounded-r-md border-y border-r border-gray-800 ${classes} mb-8 shadow-md`}>
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div className="text-sm font-medium leading-relaxed">{message}</div>
    </div>
  );
};

export default InfoBanner;
