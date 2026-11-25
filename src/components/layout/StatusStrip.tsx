import React from 'react';
import { useRaiseStore } from '../../store/useRaiseStore';
import { translations } from '../../data/translations';
import { Radio, RefreshCw, MapPin, ShieldCheck, Database } from 'lucide-react';

interface StatusStripProps {
  breadcrumbs?: string[];
}

export const StatusStrip: React.FC<StatusStripProps> = ({ breadcrumbs = ['Live Operations'] }) => {
  const { language, lastSyncedTime, selectedDivision, isStreamConnected } = useRaiseStore();
  const t = translations[language];

  return (
    <div className="bg-[#F1F5F9] border-b border-slate-300 px-4 sm:px-6 py-2 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2 select-none">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 font-medium text-slate-600">
        <span className="text-slate-500 hover:text-slate-900 transition">PWrD Assam</span>
        <span className="text-slate-400">/</span>
        <span className="text-slate-500">RAISE Engine</span>
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <span className="text-slate-400">/</span>
            <span className={idx === breadcrumbs.length - 1 ? 'font-bold text-[#1B2F4B]' : 'text-slate-600'}>
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Real-time telemetry indicators */}
      <div className="flex items-center flex-wrap gap-3 sm:gap-4 text-[11px] font-medium text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isStreamConnected ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'}`}></span>
          <span>WebSocket Stream: <strong className="text-slate-900">{isStreamConnected ? 'Active (3s tick)' : 'Connecting'}</strong></span>
        </div>

        <div className="hidden md:flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          <span>Division: <strong className="text-slate-900">{selectedDivision}</strong></span>
        </div>

        <div className="flex items-center gap-1.5">
          <RefreshCw className="w-3 h-3 text-slate-500" />
          <span>{t.lastUpdated}: <strong className="font-mono text-slate-900">{lastSyncedTime}</strong></span>
        </div>
      </div>
    </div>
  );
};
