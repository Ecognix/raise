import React, { useState, useMemo } from 'react';
import { useRaiseStore } from '../store/useRaiseStore';
import {
  Route,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Truck,
  CheckCircle2,
  Box,
  FileText,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Droplets,
  HardHat,
  Sliders,
  RefreshCw
} from 'lucide-react';
import { GuwahatiLiveMap } from '../components/liveOps/GuwahatiLiveMap';
import { LiveEventFeed } from '../components/liveOps/LiveEventFeed';
import { TodayByRoadSection } from '../components/liveOps/TodayByRoadSection';
import { Last24hByLocationList } from '../components/liveOps/Last24hByLocationList';
import { FleetStatusPanel } from '../components/liveOps/FleetStatusPanel';

interface HomeDashboardPageProps {
  onNavigateTo3DView: (roadId: string) => void;
  onNavigateToPassport: (roadId: string) => void;
  onNavigateToInspectManually?: () => void;
}

export const HomeDashboardPage: React.FC<HomeDashboardPageProps> = ({
  onNavigateTo3DView,
  onNavigateToPassport,
  onNavigateToInspectManually
}) => {
  const { roads, vehicles, defects, weatherForecast, initData } = useRaiseStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivisionFilter, setSelectedDivisionFilter] = useState('ALL');
  const [onlyHighDefects, setOnlyHighDefects] = useState(false);

  // Filter 56 roads for "Road Defects Discovered in the Last 24 Hours"
  const recentDefectRoads = useMemo(() => {
    return roads.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.locationArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.division.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDivision =
        selectedDivisionFilter === 'ALL' ||
        r.division.toLowerCase().includes(selectedDivisionFilter.toLowerCase()) ||
        (selectedDivisionFilter === 'HIGH_FLOOD' && r.floodRiskLevel === 'High');

      const matchesHighDefects = onlyHighDefects ? (r.potholesLast24hCount || 0) >= 15 : true;

      return matchesSearch && matchesDivision && matchesHighDefects;
    });
  }, [roads, searchQuery, selectedDivisionFilter, onlyHighDefects]);

  // Aggregate stats
  const onlineVehicles = vehicles.filter((v) => v.status === 'online').length;
  const offlineVehicles = vehicles.filter((v) => v.status === 'offline').length;
  const queuedEventsCount = 12; // Store-and-forward dead-zone queue
  const total24hPotholes = roads.reduce((acc, r) => acc + (r.potholesLast24hCount || 0), 0);
  const totalTodayDetections = roads.reduce((acc, r) => acc + (r.detectionsTodayCount || 0), 0);
  const severeDefectsCount = defects.filter((d) => d.severity === 'high' || d.severity === 'severe').length;

  return (
    <div className="space-y-6 animate-in fade-in select-none">
      {/* 1. INSTITUTIONAL EXECUTIVE HEADER & WRITE-UP */}
      <div className="bg-[#0A1220] border border-slate-700/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Official Letterhead Strip */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-800 text-cyan-400 px-2.5 py-0.5 rounded border border-slate-700">
                  Government of Assam &bull; Public Works Roads Department (PWrD)
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded border border-emerald-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Surveillance Active
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-950 text-amber-300 px-2.5 py-0.5 rounded border border-amber-800">
                  Demo Data Mode
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-1">
                RAISE: Road Asset Intelligence and Safety Engine
              </h1>
              <p className="text-xs text-slate-400 max-w-4xl font-normal leading-relaxed">
                Statewide Edge AI Pavement Surveillance, 3D Volumetric Distress Reconstruction & Automated Maintenance Lifecycle Management
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => initData()}
                className="px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 active:scale-95"
                title="Refresh local sensor & telemetric feeds"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sync Network</span>
              </button>
              {onNavigateToInspectManually && (
                <button
                  onClick={onNavigateToInspectManually}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-lg text-xs font-bold transition shadow-lg shadow-amber-500/20 flex items-center gap-1.5 active:scale-95"
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-950" />
                  <span>Inspect Roads Manually</span>
                </button>
              )}
            </div>
          </div>

          {/* About RAISE Platform Narrative */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1 items-center">
            <div className="lg:col-span-8 text-xs text-slate-300 leading-relaxed space-y-2">
              <p>
                <strong className="text-white font-semibold">RAISE (Road Asset Intelligence and Safety Engine)</strong> serves as Assam’s centralized infrastructure intelligence core. Operating across 56 monitored corridors in Kamrup Metropolitan and expanding statewide, RAISE fuses continuous high-resolution mobile camera feeds from PWrD patrol jeeps, municipal transit fleets, and specialized inspection vans.
              </p>
              <p className="text-slate-400 text-[11px]">
                Autonomous edge neural networks (IRC:SP:20 & IRC:82 compliant) classify potholes, surface alligator cracking, and edge subsidence in real time. Identified defects undergo photogrammetric volumetric 3D reconstruction, rainfall vulnerability weighting, and automated Bill of Quantities (BOQ) generation to eliminate road deterioration cycles before the monsoon onset.
              </p>
            </div>

            <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-xs space-y-2">
              <div className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Engineering Authority & Audit Standard</span>
              </div>
              <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                <li>IRC:SP:20 & IRC:82 pavement distress taxonomy</li>
                <li>Edge PII Sanitization: Instant facial & plate blur</li>
                <li>Assam State Data Centre (SDC) sovereign encrypted</li>
                <li>Pre-monsoon target: 100% critical potholes patched</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATEWIDE MACRO KPI GRID — PROMINENT 98,200 KM TOTAL ROAD AREA COVERED */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
        {/* TOTAL ROAD AREA COVERED: 98,200 KM */}
        <div className="sm:col-span-2 bg-gradient-to-br from-[#0F1E36] via-[#0B172B] to-[#070D18] border-2 border-cyan-500/50 rounded-2xl p-4 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-cyan-400 transition">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:scale-125 transition" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <Route className="w-4 h-4 text-cyan-400" />
                Total Road Area Covered
              </span>
              <span className="text-[9px] bg-cyan-950 text-cyan-300 font-mono font-bold px-2 py-0.5 rounded border border-cyan-700">
                Statewide Network
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                98,200
              </span>
              <span className="text-base font-bold font-mono text-cyan-400">km</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
            <span>SH, MDR, ODR & Urban Corridors</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% GIS Mapped
            </span>
          </div>
        </div>

        {/* Monitored Corridors (Kamrup Metro) */}
        <div className="bg-[#0A1220] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Monitored Corridors
            </span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold font-mono text-white">56</div>
            <span className="text-[10px] text-slate-400">Kamrup Metro Arterials</span>
          </div>
          <div className="text-[10px] text-cyan-400 font-medium pt-2 border-t border-slate-800/80">
            Guwahati East, West & Dispur
          </div>
        </div>

        {/* Active Patrol Fleet */}
        <div className="bg-[#0A1220] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Patrol Fleet
            </span>
            <Truck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold font-mono text-emerald-400">43</div>
            <span className="text-[10px] text-slate-400">
              <strong className="text-emerald-300">{onlineVehicles} Online</strong> &bull; {offlineVehicles} Queued
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium pt-2 border-t border-slate-800/80">
            Edge RTK GNSS Lock
          </div>
        </div>

        {/* Defects in Last 24 Hours */}
        <div className="bg-[#0A1220] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-red-900/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Detections (24h)
            </span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold font-mono text-red-400">108</div>
            <span className="text-[10px] text-slate-400">
              <strong className="text-white">87</strong> detected today
            </span>
          </div>
          <div className="text-[10px] text-amber-400 font-medium pt-2 border-t border-slate-800/80">
            34 Awaiting Engineer Review
          </div>
        </div>

        {/* Average Network Condition Score */}
        <div className="bg-[#0A1220] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Pavement Health (PCI)
            </span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold font-mono text-amber-300">68.4</div>
            <span className="text-[10px] text-slate-400">Benchmark Index / 100</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-medium pt-2 border-t border-slate-800/80">
            Fair Condition Range
          </div>
        </div>
      </div>

      {/* 3. DEDICATED SECTION: ROAD DEFECTS DISCOVERED IN THE LAST 24 HOURS */}
      <section className="bg-[#0A1220] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
        {/* Section Heading & Radar Indicator */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center w-3 h-3">
                <span className="absolute w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75" />
                <span className="relative w-2 h-2 bg-red-500 rounded-full" />
              </div>
              <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                Road Defects Discovered in the Last 24 Hours
              </h2>
              <span className="text-[10px] bg-red-950 text-red-300 border border-red-800 font-bold px-2 py-0.5 rounded">
                {recentDefectRoads.length} Corridors Logged
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Automated mobile sensor detections logged in the last 24h across Kamrup Metro. Click <strong className="text-cyan-300">"3D Road View"</strong> to inspect full 3D carriageway distress or <strong className="text-slate-200">"Digital Passport"</strong> for asset records.
            </p>
          </div>

          {/* Search & Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter roads (e.g. Hirakjyoti, GS, Zakir)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Division Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto text-xs py-1">
              {[
                { label: 'All Corridors', value: 'ALL' },
                { label: 'Dispur Capital', value: 'Dispur' },
                { label: 'Guwahati East', value: 'East' },
                { label: 'Guwahati West', value: 'West' },
                { label: 'Jalukbari', value: 'Jalukbari' },
                { label: 'High Flood Risk', value: 'HIGH_FLOOD' }
              ].map((pill) => (
                <button
                  key={pill.value}
                  onClick={() => setSelectedDivisionFilter(pill.value)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition whitespace-nowrap ${
                    selectedDivisionFilter === pill.value
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {pill.label}
                </button>
              ))}

              <button
                onClick={() => setOnlyHighDefects(!onlyHighDefects)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition flex items-center gap-1 ${
                  onlyHighDefects
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
                title="Only show corridors with >= 15 potholes detected in 24h"
              >
                <span>&ge; 15 Defects</span>
              </button>
            </div>
          </div>
        </div>

        {/* Corridor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {recentDefectRoads.slice(0, 12).map((road) => {
            const isHirakjyoti = road.id === 'RAISE-AS-GHY-2026-008741';
            const isZakir = road.id === 'RD-GAU-031';
            const isGS = road.id === 'RD-GAU-001';
            const isAT = road.id === 'RD-GAU-003';
            const isBeltola = road.id === 'RD-GAU-005';
            const isMotherTeresa = road.id === 'RD-GAU-008';

            // Peak depth estimate per road
            const peakDepth = isHirakjyoti
              ? 85
              : isZakir
              ? 74
              : isGS
              ? 68
              : isAT
              ? 92
              : isBeltola
              ? 58
              : isMotherTeresa
              ? 65
              : 50 + ((road.conditionScore * 7) % 45);

            // Estimated maintenance cost string
            const costLakhs = isHirakjyoti
              ? '1.42'
              : isZakir
              ? '1.85'
              : isGS
              ? '2.60'
              : isAT
              ? '2.20'
              : isBeltola
              ? '1.30'
              : isMotherTeresa
              ? '1.95'
              : ((road.potholesLast24hCount || 10) * 0.12).toFixed(2);

            return (
              <div
                key={road.id}
                className={`bg-[#0B1324] rounded-xl p-4 border transition flex flex-col justify-between space-y-3 hover:shadow-xl ${
                  isHirakjyoti || isZakir || isGS || isAT
                    ? 'border-cyan-500/40 hover:border-cyan-400 bg-gradient-to-b from-[#0D182E] to-[#0A1220]'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Road Header info */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold block">
                        {road.id}
                      </span>
                      <h3 className="text-sm font-bold text-white line-clamp-1" title={road.name}>
                        {road.name}
                      </h3>
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded font-mono shrink-0 ${
                        road.floodRiskLevel === 'High'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {road.floodRiskLevel} Flood
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {road.locationArea}
                  </p>
                </div>

                {/* Road Condition Metrics */}
                <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Potholes (24h)</span>
                    <span className="text-base font-extrabold font-mono text-red-400">
                      {road.potholesLast24hCount || road.detectionsTodayCount || 12}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">cavities</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Peak Depth</span>
                    <span className="text-base font-extrabold font-mono text-amber-300">
                      {peakDepth}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">mm</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Est. Patching: <strong className="text-slate-200">₹{costLakhs} L</strong></span>
                    <span>Length: <strong className="text-slate-200">{road.lengthKm} km</strong></span>
                  </div>
                </div>

                {/* Action Buttons: 3D Road View + Digital Passport */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onNavigateTo3DView(road.id)}
                    className="flex-1 py-1.5 px-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/20 active:scale-95"
                    title={`Launch 3D Road View with all potholes for ${road.name}`}
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>3D Road View</span>
                  </button>

                  <button
                    onClick={() => onNavigateToPassport(road.id)}
                    className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold border border-slate-700 transition flex items-center justify-center gap-1 active:scale-95"
                    title={`View Digital Passport & contractor records for ${road.name}`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Passport</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All / Inspector Notice */}
        {recentDefectRoads.length > 12 && (
          <div className="text-center pt-2">
            <span className="text-xs text-slate-400">
              Showing top 12 of {recentDefectRoads.length} corridors. Refine search query above or click{' '}
              {onNavigateToInspectManually && (
                <button
                  onClick={onNavigateToInspectManually}
                  className="text-cyan-400 underline font-semibold hover:text-cyan-300"
                >
                  Inspect Roads Manually
                </button>
              )}{' '}
              to explore all 56 monitored corridors.
            </span>
          </div>
        )}
      </section>

      {/* 4. LIVE GIS SURVEILLANCE & TELEMETRY STREAM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <GuwahatiLiveMap heightClass="h-[460px] sm:h-[500px]" />
        </div>
        <div className="lg:col-span-4">
          <LiveEventFeed />
        </div>
      </div>

      {/* 5. TODAY BY ROAD RANKING & FLEET STATUS */}
      <TodayByRoadSection />

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
