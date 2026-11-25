import React from 'react';
import { useRaiseStore } from '../../store/useRaiseStore';
import { translations } from '../../data/translations';
import {
  Truck,
  Radio,
  AlertTriangle,
  Clock,
  HardDriveDownload,
  CalendarCheck2
} from 'lucide-react';

export const LiveKpiStrip: React.FC = () => {
  const { language, vehicles, defects } = useRaiseStore();
  const t = translations[language];

  // Calculate live values
  const vehiclesReporting24h = 43; // Exact prompt specification
  const vehiclesOnlineNow = vehicles.filter((v) => v.status === 'online').length; // ~31
  const potholesDetected24h = 108; // Exact prompt specification
  const potholesDetectedToday = 87; // Exact prompt specification
  const awaitingEngineerReview = defects.filter((d) => d.lifecycleState === 'Under review').length || 34; // 34
  const eventsQueuedOffline = vehicles.reduce((sum, v) => sum + (v.queuedEventsCount || 0), 0); // 12

  const kpis = [
    {
      label: t.vehiclesReporting24h,
      value: vehiclesReporting24h,
      subtext: "100% fleet GPS compliance",
      icon: <Truck className="w-4 h-4 text-slate-700" />,
      borderAccent: "border-l-4 border-l-slate-600",
      pill: "24h Active"
    },
    {
      label: t.vehiclesOnlineNow,
      value: vehiclesOnlineNow,
      subtext: "Live cellular / GNSS feed",
      icon: <Radio className="w-4 h-4 text-emerald-700 animate-pulse" />,
      borderAccent: "border-l-4 border-l-emerald-600",
      pill: `${vehiclesOnlineNow} of 43 Active`
    },
    {
      label: t.potholesDetected24h,
      value: potholesDetected24h,
      subtext: "Across 14 road corridors",
      icon: <AlertTriangle className="w-4 h-4 text-red-700" />,
      borderAccent: "border-l-4 border-l-red-600",
      pill: "P01 High Alert"
    },
    {
      label: t.potholesDetectedToday,
      value: potholesDetectedToday,
      subtext: "23 on GS Road alone",
      icon: <CalendarCheck2 className="w-4 h-4 text-amber-700" />,
      borderAccent: "border-l-4 border-l-[#F2A900]",
      pill: "Today"
    },
    {
      label: t.awaitingReview,
      value: awaitingEngineerReview,
      subtext: "Pending field engineer review",
      icon: <Clock className="w-4 h-4 text-amber-800" />,
      borderAccent: "border-l-4 border-l-amber-500",
      pill: "Action Required"
    },
    {
      label: t.eventsQueuedOffline,
      value: eventsQueuedOffline,
      subtext: "Stored in dead-zone storage",
      icon: <HardDriveDownload className="w-4 h-4 text-blue-700" />,
      borderAccent: "border-l-4 border-l-blue-600",
      pill: "Store & Forward"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 select-none">
      {kpis.map((kpi, idx) => (
        <div
          key={idx}
          className={`bg-white rounded border border-slate-200 p-3.5 shadow-xs transition hover:shadow-sm ${kpi.borderAccent}`}
        >
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider truncate">
              {kpi.pill}
            </span>
            <div className="p-1 rounded bg-slate-100 border border-slate-200">
              {kpi.icon}
            </div>
          </div>

          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-slate-900 tracking-tight">
              {kpi.value}
            </span>
          </div>

          <p className="text-[11px] font-bold text-slate-800 leading-tight mt-0.5 line-clamp-1">
            {kpi.label}
          </p>
          <p className="text-[10px] text-slate-500 mt-1 truncate">
            {kpi.subtext}
          </p>
        </div>
      ))}
    </div>
  );
};
