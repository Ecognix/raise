import React from 'react';
import { useRaiseStore } from '../../store/useRaiseStore';
import { translations } from '../../data/translations';
import { Radio, AlertTriangle, Layers, Clock, ShieldCheck, Flame } from 'lucide-react';

export const LiveEventFeed: React.FC = () => {
  const { language, liveEvents } = useRaiseStore();
  const t = translations[language];

  return (
    <div className="bg-white rounded border border-slate-300 shadow-xs flex flex-col h-full select-none">
      {/* Feed Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping"></span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            {t.liveEventFeed}
          </h3>
        </div>
        <span className="text-[10px] bg-slate-200 text-slate-700 font-mono font-bold px-1.5 py-0.5 rounded">
          WebSocket Stream
        </span>
      </div>

      {/* Events Scroll Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1.5 max-h-[380px]">
        {liveEvents.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            Waiting for live telemetry packets...
          </div>
        ) : (
          liveEvents.map((evt) => {
            const isHigh = evt.severity === 'high' || evt.severity === 'severe';
            const isMedium = evt.severity === 'medium' || evt.severity === 'moderate';

            const severityBadgeColor = isHigh
              ? 'bg-red-100 text-red-800 border-red-200'
              : isMedium
              ? 'bg-amber-100 text-amber-800 border-amber-200'
              : 'bg-emerald-100 text-emerald-800 border-emerald-200';

            return (
              <div
                key={evt.id}
                className="p-2 rounded bg-slate-50/70 hover:bg-slate-100 border border-slate-200 transition text-xs space-y-1"
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[11px] font-bold text-slate-900 bg-white px-1.5 py-0.2 rounded border border-slate-300">
                      {evt.timestamp}
                    </span>
                    {evt.vehicleId && (
                      <span className="font-mono text-[10px] text-slate-600 bg-slate-200 px-1 rounded font-semibold">
                        {evt.vehicleId}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {evt.worsening && (
                      <span className="text-[9px] bg-red-600 text-white font-bold px-1 rounded flex items-center gap-0.5">
                        <Flame className="w-2.5 h-2.5" /> Worsening
                      </span>
                    )}
                    {evt.severity && (
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${severityBadgeColor}`}>
                        {evt.severity}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs font-semibold text-slate-800 leading-snug">
                  {evt.message}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                  <span className="truncate max-w-[200px]">{evt.locationArea}</span>
                  <span className="font-mono text-slate-400">
                    {evt.isNew ? '● New Anomaly' : '↻ Seen Again'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-2 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-500">
        Streaming simulated GNSS & computer vision camera events (PWrD Assam)
      </div>
    </div>
  );
};
