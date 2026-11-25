import React from 'react';
import { LiveKpiStrip } from '../components/liveOps/LiveKpiStrip';
import { GuwahatiLiveMap } from '../components/liveOps/GuwahatiLiveMap';
import { LiveEventFeed } from '../components/liveOps/LiveEventFeed';
import { TodayByRoadSection } from '../components/liveOps/TodayByRoadSection';
import { Last24hByLocationList } from '../components/liveOps/Last24hByLocationList';
import { FleetStatusPanel } from '../components/liveOps/FleetStatusPanel';
import { Activity, ShieldCheck, Download, RefreshCw } from 'lucide-react';
import { useRaiseStore } from '../store/useRaiseStore';

export const LiveOperationsPage: React.FC = () => {
  const { initData, isLoading } = useRaiseStore();

  return (
    <div className="space-y-4">
      {/* Page Title & Operational Status Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded border border-slate-300 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-[#1B2F4B] tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#F2A900]" />
              Guwahati Municipal & Highway Live Operations Command
            </h2>
            <span className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 rounded uppercase">
              Surveillance Online
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time automated defect ingestion from vehicle-mounted camera units across Guwahati arterial corridors (Kamrup Metro)
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => initData()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold border border-slate-300 transition"
            title="Refresh local telemetry cache"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
            <span>Sync Telemetry</span>
          </button>
        </div>
      </div>

      {/* 1. Top KPI Strip (Real-time updates) */}
      <LiveKpiStrip />

      {/* 2. Interactive Map (8 cols) + Live Event Feed (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <GuwahatiLiveMap heightClass="h-[460px] sm:h-[500px]" />
        </div>
        <div className="lg:col-span-4">
          <LiveEventFeed />
        </div>
      </div>

      {/* 3. Today by Road (Bar Chart + Ranking Table) */}
      <TodayByRoadSection />

      {/* 4. Last 24 Hours by Location List (4 cols) + Fleet Status Panel (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4">
          <Last24hByLocationList />
        </div>
        <div className="lg:col-span-8">
          <FleetStatusPanel />
        </div>
      </div>
    </div>
  );
};
