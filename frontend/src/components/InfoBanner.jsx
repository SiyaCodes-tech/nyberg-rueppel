import React from 'react';
import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const InfoBanner = ({ type = 'info', message }) => {
  const types = {
    info: { icon: <Info size={20} />, classes: 'bg-blue-900/20 text-blue-400 border-blue-900/50' },
    warning: { icon: <AlertTriangle size={20} />, classes: 'bg-yellow-900/20 text-yellow-500 border-yellow-900/50' },
    success: { icon: <CheckCircle size={20} />, classes: 'bg-green-500/10 text-green-500 border-green-500/30' },
    error: { icon: <XCircle size={20} />, classes: 'bg-red-500/10 text-red-500 border-red-500/30' },
  };

  const { icon, classes } = types[type] || types.info;

  return (
    <div className={`flex items-start space-x-3 p-4 rounded-md border ${classes} mb-6`}>
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div className="text-sm">{message}</div>
    </div>
  );
};

export default InfoBanner;
