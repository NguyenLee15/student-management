// cSpell:disable
import React from 'react';
import { Server, Database, HardDrive, Cpu, RefreshCw } from 'lucide-react';
import { msg } from '../../../lib/messages';

export default function SystemHealthCard({
  healthData,
  healthLoading = false,
  onReloadHealth,
}) {
  const getHealthBadgeClass = (val) => {
    if (val === 'UP') return 'font-semibold text-emerald-400 font-mono text-[11px]';
    if (val === 'DISCONNECTED' || val === 'OFFLINE') return 'font-semibold text-rose-400 font-mono text-[11px]';
    return 'font-semibold text-amber-400 font-mono text-[11px]';
  };

  return (
    <div className="panel-card p-5 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Trạng Thái Hạ Tầng</h3>
        </div>
        <button
          onClick={onReloadHealth}
          disabled={healthLoading}
          className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1"
        >
          <RefreshCw className={`h-3 w-3 ${healthLoading ? 'animate-spin text-indigo-400' : ''}`} />
          <span>{healthData.pingTime}</span>
        </button>
      </div>

      <div className="space-y-2.5 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <Database className="h-3.5 w-3.5 text-indigo-400" />
            <span>Cơ sở dữ liệu TiDB</span>
          </div>
          <span className={getHealthBadgeClass(healthData.db)}>
            {msg.enum.healthStatus[healthData.db] || healthData.db}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <HardDrive className="h-3.5 w-3.5 text-emerald-400" />
            <span>Dung lượng lưu trữ</span>
          </div>
          <span className={getHealthBadgeClass(healthData.disk)}>
            {msg.enum.healthStatus[healthData.disk] || healthData.disk}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            <span>Dịch vụ API Gateway</span>
          </div>
          <span className={getHealthBadgeClass(healthData.status)}>
            {msg.enum.healthStatus[healthData.status] || healthData.status}
          </span>
        </div>
      </div>
    </div>
  );
}

