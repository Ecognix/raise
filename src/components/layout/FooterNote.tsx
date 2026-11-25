import React from 'react';
import { useRaiseStore } from '../../store/useRaiseStore';
import { translations } from '../../data/translations';
import { ShieldCheck, AlertCircle, Building2, Lock } from 'lucide-react';

export const FooterNote: React.FC = () => {
  const { language } = useRaiseStore();
  const t = translations[language];

  return (
    <footer className="bg-white border-t border-slate-300 px-4 sm:px-6 py-2.5 text-xs text-slate-700 select-none">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* Statutory rule notice */}
        <div className="flex items-center gap-2 text-slate-800 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            {t.statutoryNote}
          </span>
        </div>

        {/* Cost & Data Location Notices */}
        <div className="flex items-center flex-wrap gap-4 text-slate-600 text-[11px]">
          <span className="flex items-center gap-1 font-medium text-amber-900">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            {t.costDisclaimer}
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="flex items-center gap-1 text-slate-600">
            <Lock className="w-3 h-3 text-slate-500 shrink-0" />
            Data Location: State Data Centre (SDC) Guwahati, Assam &bull; Hosted in India
          </span>
        </div>
      </div>
    </footer>
  );
};
