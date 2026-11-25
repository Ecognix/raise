import React from 'react';
import { useRaiseStore } from '../../store/useRaiseStore';
import { translations } from '../../data/translations';
import {
  Bell,
  Search,
  Shield,
  Layers,
  ChevronDown,
  Globe,
  UserCheck,
  Building,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { AppRole, Language } from '../../types';

interface HeaderProps {
  onOpenNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications }) => {
  const {
    currentRole,
    setRole,
    language,
    setLanguage,
    selectedDivision,
    setSelectedDivision,
    globalSearchQuery,
    setGlobalSearchQuery,
    weatherForecast
  } = useRaiseStore();

  const t = translations[language];

  // Active weather or high-risk alerts count
  const activeAlertsCount = weatherForecast.filter((w) => w.alertActive).length;

  const divisions = [
    'All Divisions (Kamrup Metro)',
    'Guwahati Central',
    'Dispur Capital',
    'Guwahati West',
    'Guwahati East',
    'North Guwahati'
  ];

  const roles: AppRole[] = [
    'Field Engineer',
    'Supervisor',
    'Administrator',
    'Read-only Officer'
  ];

  return (
    <header className="bg-[#1B2F4B] text-white border-b border-[#0F1D30] sticky top-0 z-40 select-none shadow-sm">
      {/* Primary Top Bar */}
      <div className="px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Department Logo Placeholder Slot + Titles */}
        <div className="flex items-center gap-3">
          {/* Logo Placeholder - Clearly marked slot (no state emblem drawn) */}
          <div
            title="Designated slot for Official Department Emblem / Logo"
            className="w-12 h-12 bg-white/10 border border-dashed border-amber-400/80 rounded flex flex-col items-center justify-center p-1 text-center shrink-0 hover:bg-white/15 transition cursor-help"
          >
            <span className="text-[9px] font-bold tracking-tight text-amber-300 leading-none">
              PWrD
            </span>
            <span className="text-[7px] text-slate-300 leading-tight mt-0.5 uppercase font-medium">
              Logo Slot
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                {t.deptTitle}
              </h1>
              {/* Mandatory Demo Data Badge */}
              <span
                className="bg-[#F2A900] text-[#1B2F4B] text-[10px] uppercase font-black px-2 py-0.5 rounded tracking-wider shadow-xs shrink-0"
                title="Application running in demonstration mode with mock GIS sensor feeds"
              >
                {t.demoData}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium tracking-tight">
              {t.subTitle}
              <span className="hidden md:inline text-slate-400">
                {' '}
                &bull; {t.jurisdiction}
              </span>
            </p>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-xs mx-2">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.search}
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-900/60 border border-slate-700 rounded text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-slate-900 transition"
            />
          </div>
        </div>

        {/* Right Controls: Division Filter, Role Switcher, Language Toggle, Notification Bell */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-xs">
          {/* Division Selector */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-900/70 border border-slate-700/80 rounded px-2.5 py-1">
            <Building className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer"
            >
              {divisions.map((div) => (
                <option key={div} value={div} className="bg-[#1B2F4B] text-white">
                  {div}
                </option>
              ))}
            </select>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-900/70 border border-slate-700/80 rounded px-2.5 py-1">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-slate-400 hidden xl:inline text-[11px]">Role:</span>
            <select
              value={currentRole}
              onChange={(e) => setRole(e.target.value as AppRole)}
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {roles.map((r) => (
                <option key={r} value={r} className="bg-[#1B2F4B] text-white">
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* English / Assamese Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'as' : 'en')}
            className="flex items-center gap-1 bg-slate-900/70 border border-slate-700/80 hover:bg-slate-800 text-slate-200 font-semibold px-2 py-1 rounded transition text-xs"
            title="Toggle between English and Assamese (অসমীয়া)"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'en' ? 'ENG' : 'অসমীয়া'}</span>
          </button>

          {/* Notification Bell with Active Alert Count */}
          <button
            onClick={onOpenNotifications}
            className="relative p-1.5 rounded bg-slate-900/70 border border-slate-700/80 hover:bg-slate-800 text-slate-200 transition"
            title={`${activeAlertsCount} active pre-monsoon & structural hazard alerts`}
          >
            <Bell className="w-4 h-4 text-slate-200" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center justify-center border border-[#1B2F4B]">
                {activeAlertsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
