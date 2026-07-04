import React from 'react';

const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'Healthy':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200 glow-green';
      case 'Warning':
        return 'bg-amber-50 text-amber-600 border-amber-200 glow-yellow';
      case 'Critical':
        return 'bg-rose-50 text-rose-600 border-rose-200 glow-red';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyles()}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        status === 'Healthy' ? 'bg-emerald-500' :
        status === 'Warning' ? 'bg-amber-500' :
        status === 'Critical' ? 'bg-rose-500' : 'bg-slate-500'
      } animate-pulse`} />
      {status}
    </span>
  );
};

export default StatusBadge;
