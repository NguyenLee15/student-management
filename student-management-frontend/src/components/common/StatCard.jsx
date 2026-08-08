import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, color = 'indigo' }) {
  const colorMap = {
    indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
    rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
    violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20' },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden group hover:border-slate-700 transition">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        <div className={`p-2.5 rounded-xl ${scheme.bg} ${scheme.text} group-hover:scale-110 transition duration-300`}>
          {Icon && <Icon className="h-5 w-5" />}
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-extrabold text-white tracking-tight">{value}</span>
        {trend && (
          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
            <TrendingUp className="h-3.5 w-3.5" /> {trend}
          </span>
        )}
      </div>

      {subtitle && <p className="text-[11px] text-slate-500">{subtitle}</p>}
    </div>
  );
}
