import React from 'react';
import { Severity, DefectType, DefectStatus } from '../../types';
import { Bot, CheckCircle2, AlertTriangle, ShieldCheck, Clock, Check } from 'lucide-react';

export const SeverityBadge: React.FC<{ severity: Severity; size?: 'sm' | 'md' }> = ({
  severity,
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  if (severity === 'severe') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-red-100 text-red-800 border border-red-200 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
        Severe
      </span>
    );
  }

  if (severity === 'moderate') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
        Moderate
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 ${sizeClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
      Good
    </span>
  );
};

export const SourceTrustBadge: React.FC<{ source: 'AI-generated' | 'Field-verified'; size?: 'sm' | 'md' }> = ({
  source,
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-0.5 text-xs';

  if (source === 'Field-verified') {
    return (
      <span
        title="Verified on ground by certified PWD engineer"
        className={`inline-flex items-center gap-1 font-medium rounded bg-emerald-50 text-emerald-700 border border-emerald-300 ${sizeClasses}`}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        Field-verified
      </span>
    );
  }

  return (
    <span
      title="Automated detection by RAISE AI computer vision models"
      className={`inline-flex items-center gap-1 font-medium rounded bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}
    >
      <Bot className="w-3.5 h-3.5 text-blue-600" />
      AI-generated
    </span>
  );
};

export const DefectTypeBadge: React.FC<{ type?: string }> = ({ type = 'pothole' }) => {
  const labels: Record<string, { text: string; bg: string }> = {
    pothole: { text: 'Pothole', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
    P01: { text: 'Pothole (P01)', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
    crack: { text: 'Crack', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    C01: { text: 'Longitudinal Crack (C01)', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    C02: { text: 'Transverse Crack (C02)', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    C03: { text: 'Alligator Crack (C03)', bg: 'bg-red-50 text-red-700 border-red-200' },
    C04: { text: 'Block Crack (C04)', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    C05: { text: 'Edge Crack (C05)', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    surface_wear: { text: 'Surface Wear', bg: 'bg-orange-50 text-orange-700 border-orange-200' },
    S01: { text: 'Ravelling (S01)', bg: 'bg-orange-50 text-orange-700 border-orange-200' },
    S02: { text: 'Bleeding (S02)', bg: 'bg-orange-50 text-orange-700 border-orange-200' },
    D01: { text: 'Rutting (D01)', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
    D02: { text: 'Depression (D02)', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
    D03: { text: 'Shoving (D03)', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
    E01: { text: 'Edge Break (E01)', bg: 'bg-red-50 text-red-700 border-red-200' },
    T01: { text: 'Sound Patch (T01)', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    T02: { text: 'Failed Patch (T02)', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
    drain_blockage: { text: 'Drain Blockage', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  };

  const item = labels[type] || { text: type, bg: 'bg-slate-100 text-slate-700 border-slate-200' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${item.bg}`}>
      {item.text}
    </span>
  );
};

export const StatusBadge: React.FC<{ status?: string }> = ({ status = 'New' }) => {
  switch (status) {
    case 'AI-detected':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          <Bot className="w-3 h-3" /> AI-detected
        </span>
      );
    case 'Field-verified':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" /> Field-verified
        </span>
      );
    case 'Assigned':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
          <Clock className="w-3 h-3" /> Assigned
        </span>
      );
    case 'Repaired':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
          <Check className="w-3 h-3" /> Repaired
        </span>
      );
    case 'Verified after repair':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
          <ShieldCheck className="w-3 h-3" /> Verified after repair
        </span>
      );
    default:
      return <span className="text-xs text-slate-600">{status}</span>;
  }
};

export const ReappearedBadge: React.FC = () => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
    <AlertTriangle className="w-3 h-3 text-rose-600" />
    Reappeared
  </span>
);
