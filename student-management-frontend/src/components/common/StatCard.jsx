import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, isPositive = true }) {
  return (
    <div className="panel-card p-5 space-y-3 relative overflow-hidden transition-colors hover:border-slate-700">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        {Icon && (
          <div className="p-2 rounded-lg bg-slate-800/80 text-indigo-400 border border-slate-700/50">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
        {trend && (
          <span className={`text-[11px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded-md ${
            isPositive 
              ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' 
              : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
          }`}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
}
