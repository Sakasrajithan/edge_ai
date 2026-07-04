import React from 'react';
import { Wrench, ShieldCheck } from 'lucide-react';

const RecommendationCard = ({ prediction, recommendation, status }) => {
  const isHealthy = status === 'Healthy';

  return (
    <div className="glass-card rounded-xl p-5 flex flex-col justify-between h-full">
      <div>
        <h3 className="text-sm font-bold text-slate-500 mb-4 tracking-wider uppercase">AI Recommendations</h3>
        
        <div className="flex gap-4">
          <div className={`p-3 rounded-lg border h-fit shrink-0 ${
            isHealthy 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-600 glow-green' 
              : 'bg-rose-50 border-rose-200 text-rose-600 glow-red'
          }`}>
            {isHealthy ? <ShieldCheck className="w-6 h-6" /> : <Wrench className="w-6 h-6 animate-bounce" />}
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Detected Condition</span>
            <h4 className="text-base font-bold text-slate-900">{prediction}</h4>
            <p className="text-sm text-slate-600 leading-relaxed mt-2">{recommendation}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-mono text-slate-550 flex justify-between items-center">
        <span>PREDICTIVE ENGINE V1.2</span>
        <span className="flex items-center gap-1 text-slate-500">
          {isHealthy ? (
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          ) : (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          )}
          {isHealthy ? 'Optimized Performance' : 'Action Required'}
        </span>
      </div>
    </div>
  );
};

export default RecommendationCard;
