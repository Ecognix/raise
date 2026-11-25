import React, { useState, useMemo, useEffect } from 'react';
import { useRaiseStore } from '../store/useRaiseStore';
import {
  PotholeDemoRecord,
  getRoadInspectionData
} from '../data/demonstrationRoadData';
import { RoadSegment } from '../types';
import { RoadVisualizerChainage } from '../components/aiInspection/RoadVisualizerChainage';
import { InspectionGallery } from '../components/aiInspection/InspectionGallery';
import { AiAnalysisWorkflowModal } from '../components/aiInspection/AiAnalysisWorkflowModal';
import { PotholeInspectionDetailModal } from '../components/aiInspection/PotholeInspectionDetailModal';
import {
  Search,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Sliders,
  FileText,
  X,
  Eye,
  Filter,
  BarChart2
} from 'lucide-react';

interface AiRoadInspectionPageProps {
  activeRoadId?: string | null;
  onNavigateToPassport?: (roadId?: string) => void;
}

// ─── Compact road list row ───────────────────────────────────────────────────
const RoadListRow: React.FC<{
  road: RoadSegment;
  onSelect: (road: RoadSegment) => void;
  onPassport: (roadId: string) => void;
}> = ({ road, onSelect, onPassport }) => {
  const scoreColor =
    road.conditionScore >= 75
      ? 'text-emerald-400 border-emerald-700/60 bg-emerald-950/40'
      : road.conditionScore >= 60
      ? 'text-amber-400 border-amber-700/60 bg-amber-950/40'
      : 'text-rose-400 border-rose-700/60 bg-rose-950/40';

  const severityDot =
    road.conditionScore >= 75
      ? 'bg-emerald-500'
      : road.conditionScore >= 60
      ? 'bg-amber-500'
      : 'bg-rose-500';

  return (
    <div
      className="grid grid-cols-[1fr_auto] gap-3 items-center px-4 py-3 border-b border-slate-800/70 hover:bg-slate-800/30 cursor-pointer transition-colors group"
      onClick={() => onSelect(road)}
    >
      {/* Left: Road Info */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Severity dot */}
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${severityDot}`} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-white group-hover:text-cyan-300 transition truncate">
              {road.name}
            </span>
            <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-1.5 py-0.5 rounded shrink-0">
              {road.id}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-[11px] text-slate-400 flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-500" />
              {road.locationArea}
            </span>
            <span className="text-slate-600">·</span>
            <span>{road.division}</span>
            <span className="text-slate-600">·</span>
            <span>{road.lengthKm} km</span>
            <span className="text-slate-600">·</span>
            <span className="text-rose-400 font-medium">{road.potholesLast24hCount ?? 0} potholes/24h</span>
          </div>
        </div>
      </div>

      {/* Right: Score + actions */}
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-[11px] font-mono font-bold border px-2 py-0.5 rounded ${scoreColor}`}>
          PCI {road.conditionScore}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onPassport(road.id); }}
          className="hidden sm:flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-slate-400 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition"
          title="Digital Passport"
        >
          <FileText className="w-3.5 h-3.5" />
          Passport
        </button>
        <button
          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-cyan-900 bg-cyan-400 hover:bg-cyan-300 rounded-md transition"
          title="Inspect road"
        >
          <Eye className="w-3.5 h-3.5" />
          Inspect
        </button>
      </div>
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
export const AiRoadInspectionPage: React.FC<AiRoadInspectionPageProps> = ({
  activeRoadId,
  onNavigateToPassport
}) => {
  const { roads } = useRaiseStore();

  // null = show road list; string = show inspection for that road
  const [selectedRoadId, setSelectedRoadId] = useState<string | null>(activeRoadId ?? null);

  // Sync with external prop (e.g. 3D View from home dashboard)
  useEffect(() => {
    if (activeRoadId) setSelectedRoadId(activeRoadId);
  }, [activeRoadId]);

  // ── List-view filters ─────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  const divisions = useMemo(() => {
    const divSet = new Set(roads.map((r) => r.division));
    return Array.from(divSet).sort();
  }, [roads]);

  const filteredRoads = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return roads.filter((r) => {
      const matchSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.locationArea.toLowerCase().includes(q) ||
        r.division.toLowerCase().includes(q) ||
        (r.contractor && r.contractor.toLowerCase().includes(q));
      const matchDiv = divisionFilter === 'all' || r.division === divisionFilter;
      const matchSev =
        severityFilter === 'all' ||
        (severityFilter === 'critical' && r.conditionScore < 60) ||
        (severityFilter === 'moderate' && r.conditionScore >= 60 && r.conditionScore < 75) ||
        (severityFilter === 'good' && r.conditionScore >= 75);
      return matchSearch && matchDiv && matchSev;
    });
  }, [roads, searchQuery, divisionFilter, severityFilter]);

  // ── Inspection-view data ──────────────────────────────────────────────────
  const { meta, potholes, cracks } = useMemo(() => {
    if (!selectedRoadId) return { meta: null, potholes: [], cracks: [] };
    return getRoadInspectionData(selectedRoadId, roads);
  }, [selectedRoadId, roads]);

  const [selectedPothole, setSelectedPothole] = useState<PotholeDemoRecord | null>(null);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    if (potholes.length > 0) setSelectedPothole(potholes[0]);
    else setSelectedPothole(null);
  }, [potholes]);

  const handleStartExamineWorkflow = (pothole: PotholeDemoRecord) => {
    setSelectedPothole(pothole);
    setIsWorkflowOpen(true);
  };

  const handleWorkflowComplete = () => setIsDetailModalOpen(true);

  const handleSelectPotholeDirect = (pothole: PotholeDemoRecord) => {
    setSelectedPothole(pothole);
    setIsDetailModalOpen(true);
  };

  // ── Aggregate stats across ALL roads (for list-view header) ─────────────────
  const avgPCI = useMemo(() => {
    if (!roads.length) return 0;
    return Math.round(roads.reduce((s, r) => s + r.conditionScore, 0) / roads.length);
  }, [roads]);
  const totalPotholes24h = useMemo(() => roads.reduce((s, r) => s + (r.potholesLast24hCount ?? 0), 0), [roads]);
  const totalLengthKm = useMemo(() => Math.round(roads.reduce((s, r) => s + r.lengthKm, 0)), [roads]);
  const criticalCount = useMemo(() => roads.filter(r => r.conditionScore < 60).length, [roads]);
  const moderateCount = useMemo(() => roads.filter(r => r.conditionScore >= 60 && r.conditionScore < 75).length, [roads]);
  const goodCount = useMemo(() => roads.filter(r => r.conditionScore >= 75).length, [roads]);

  // ═══════════════════════════════════════════════════════════════════════════
  // A. ROAD LIST VIEW (no road selected)
  // ═══════════════════════════════════════════════════════════════════════════
  if (!selectedRoadId || !meta) {
    return (
      <div className="space-y-3 animate-in fade-in">

        {/* ── Aggregate KPI strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Total Corridors Monitored', value: roads.length, unit: 'roads', color: 'text-cyan-400' },
            { label: 'Total Network Length', value: `${totalLengthKm.toLocaleString()}`, unit: 'km', color: 'text-white' },
            { label: 'Avg. Pavement Condition (PCI)', value: avgPCI, unit: '/100', color: avgPCI >= 75 ? 'text-emerald-400' : avgPCI >= 60 ? 'text-amber-400' : 'text-rose-400' },
            { label: 'Critical Roads  (PCI < 60)', value: criticalCount, unit: 'corridors', color: 'text-rose-400' },
            { label: 'Moderate Roads (PCI 60–74)', value: moderateCount, unit: 'corridors', color: 'text-amber-400' },
            { label: 'Potholes Detected / 24 h', value: totalPotholes24h, unit: 'units', color: 'text-rose-300' },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-[#0A1220] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-tight">{kpi.label}</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className={`text-2xl font-extrabold font-mono ${kpi.color}`}>{kpi.value}</span>
                <span className="text-xs font-mono text-slate-500">{kpi.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Search & Filters ── */}
        <div className="bg-[#0A1220] border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-white">Select a Road to Inspect</span>
            <span className="text-xs text-slate-500">— {roads.length} monitored corridors across Assam</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Search bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search road name, ID, location, district, division, contractor…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Division filter */}
            <select
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
              className="px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-medium min-w-[180px]"
            >
              <option value="all">All Divisions</option>
              {divisions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Condition filter */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-medium"
            >
              <option value="all">All Conditions</option>
              <option value="critical">🔴 Critical (PCI &lt; 60)</option>
              <option value="moderate">🟡 Moderate (PCI 60–74)</option>
              <option value="good">🟢 Good (PCI ≥ 75)</option>
            </select>
          </div>

          {/* Quick-filter chips */}
          <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
            <span className="text-slate-500 font-semibold shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Quick:
            </span>
            {['GS Road', 'AT Road', 'Zoo Road', 'Beltola', 'Zakir Hussain', 'Dispur', 'Jorhat', 'Silchar', 'Dibrugarh', 'Nagaon', 'NH-37', 'Tezpur'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 hover:border-cyan-600 hover:text-cyan-300 transition shrink-0"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* ── Road List ── */}
        <div className="bg-[#0A1220] border border-slate-800 rounded-xl overflow-hidden">
          {/* Column header */}
          <div className="grid grid-cols-[1fr_auto] gap-3 px-4 py-2.5 bg-[#070D18] border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <span>Road Name · ID · Location · Division · Length · Potholes/24 h</span>
            <span>PCI · Actions</span>
          </div>

          {/* Results meta */}
          <div className="px-4 py-1.5 border-b border-slate-800/50 flex items-center justify-between text-[11px] text-slate-500">
            <span>
              <strong className="text-slate-300">{filteredRoads.length}</strong> of <strong className="text-slate-300">{roads.length}</strong> corridors
              {searchQuery && <> · <em className="text-cyan-400">"{searchQuery}"</em></>}
            </span>
            {(searchQuery || divisionFilter !== 'all' || severityFilter !== 'all') && (
              <button
                onClick={() => { setSearchQuery(''); setDivisionFilter('all'); setSeverityFilter('all'); }}
                className="text-slate-400 hover:text-white underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Scrollable list */}
          <div className="max-h-[calc(100vh-430px)] overflow-y-auto">
            {filteredRoads.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-sm">
                <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p>No roads match your filters.</p>
                <button
                  onClick={() => { setSearchQuery(''); setDivisionFilter('all'); setSeverityFilter('all'); }}
                  className="mt-3 text-cyan-400 hover:text-cyan-300 text-xs underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredRoads.map((road) => (
                <RoadListRow
                  key={road.id}
                  road={road}
                  onSelect={(r) => setSelectedRoadId(r.id)}
                  onPassport={(id) => onNavigateToPassport && onNavigateToPassport(id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // B. INSPECTION VIEW (road selected)
  // ═══════════════════════════════════════════════════════════════════════════
  const costLakhStr = (meta.estimatedMaintenanceCostInr / 100000).toFixed(1);

  return (
    <div className="space-y-6 animate-in fade-in select-none">
      {/* Back button strip */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSelectedRoadId(null)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          All Roads
        </button>
        <div className="text-xs text-slate-500 font-mono">
          AI Road Inspection <span className="text-slate-600 mx-1">›</span>
          <span className="text-slate-300">{meta.name}</span>
        </div>
      </div>

      {/* 1. PREMIUM ROAD PROFILE HEADER */}
      <div className="bg-[#0A1220] border border-cyan-500/40 rounded-xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                {meta.inspectionStatus.toUpperCase()}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-800">
                {meta.inspectionType}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Sensor Rig: {meta.monitoredByVehicle}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {meta.name}
              </h1>
              <span className="text-sm font-medium text-slate-300 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-cyan-400" />
                {meta.location}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
              <div>
                <span className="text-slate-400">Road Passport ID: </span>
                <span className="text-cyan-400 font-bold">{meta.id}</span>
              </div>
              <span className="text-slate-700">•</span>
              <div>
                <span className="text-slate-400">Sub-Division: </span>
                <span className="text-slate-200">{meta.subDivision}</span>
              </div>
              <span className="text-slate-700">•</span>
              <div>
                <span className="text-slate-400">Survey Date: </span>
                <span className="text-slate-200">{meta.inspectionDate}</span>
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              onClick={() => setSelectedRoadId(null)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Change Road
            </button>

            {onNavigateToPassport && (
              <button
                onClick={() => onNavigateToPassport(meta.id)}
                className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <span>Road Digital Passport</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. ROAD OVERVIEW METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <div className="bg-[#0A1220] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-700 transition">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Road Length</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold font-mono text-white">{meta.totalLengthKm}</span>
            <span className="text-xs font-mono text-slate-400">km</span>
          </div>
          <span className="text-[10px] text-cyan-400 font-medium mt-1">Carriageway</span>
        </div>
        <div className="bg-[#0A1220] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between hover:border-red-900/40 transition">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Potholes Detected</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold font-mono text-red-400">{meta.totalPotholesDetected}</span>
            <span className="text-xs font-mono text-slate-400">units</span>
          </div>
          <span className="text-[10px] text-red-400/80 font-medium mt-1">100% Computer Vision</span>
        </div>
        <div className="bg-[#0A1220] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between hover:border-amber-900/40 transition">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cracks Detected</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold font-mono text-amber-400">{meta.totalCracksDetected}</span>
            <span className="text-xs font-mono text-slate-400">zones</span>
          </div>
          <span className="text-[10px] text-amber-400/80 font-medium mt-1">C01 – C04 Codes</span>
        </div>
        <div className="bg-[#0A1220] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-700 transition">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Damaged Road Area</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold font-mono text-white">{meta.totalDamagedAreaM2}</span>
            <span className="text-xs font-mono text-slate-400">m²</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium mt-1">Estimated Void</span>
        </div>
        <div className="bg-[#0A1220] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between hover:border-amber-500/40 transition">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Condition Score</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className={`text-2xl font-extrabold font-mono ${
              meta.averageConditionScore >= 75 ? 'text-emerald-400' : meta.averageConditionScore >= 60 ? 'text-amber-400' : 'text-rose-500'
            }`}>{meta.averageConditionScore}</span>
            <span className="text-xs font-mono text-slate-400">/100</span>
          </div>
          <span className="text-[10px] text-amber-400 font-medium mt-1">
            {meta.averageConditionScore >= 75 ? 'Good State' : meta.averageConditionScore >= 60 ? 'Moderate Wear' : 'Critical Hazard'}
          </span>
        </div>
        <div className="bg-[#0A1220] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between hover:border-rose-600/40 transition">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Critical Damage</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold font-mono text-rose-500">{meta.criticalDamageLocations}</span>
            <span className="text-xs font-mono text-slate-400">spots</span>
          </div>
          <span className="text-[10px] text-rose-400 font-medium mt-1">Priority Rectification</span>
        </div>
        <div className="bg-[#0A1220] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between hover:border-emerald-600/40 transition">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Est. Repair Cost</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold font-mono text-emerald-400">₹{costLakhStr}</span>
            <span className="text-xs font-mono text-slate-400">Lakh</span>
          </div>
          <span className="text-[10px] text-emerald-400/80 font-medium mt-1">SOR 2024-25 Preliminary</span>
        </div>
      </div>

      {/* 3. FULL ROAD VISUALISATION */}
      <RoadVisualizerChainage
        meta={meta}
        potholes={potholes}
        cracks={cracks}
        onSelectPothole={(p) => { setSelectedPothole(p); setIsDetailModalOpen(true); }}
        onExaminePothole={(p) => handleStartExamineWorkflow(p)}
      />

      {/* 4. EXAMINE POTHOLE GALLERY */}
      <InspectionGallery
        roadName={meta.name}
        potholes={potholes}
        onExaminePothole={(p) => handleStartExamineWorkflow(p)}
        onSelectPothole={(p) => handleSelectPotholeDirect(p)}
      />

      {/* 5. AI PIPELINE MODAL */}
      {selectedPothole && (
        <AiAnalysisWorkflowModal
          pothole={selectedPothole}
          isOpen={isWorkflowOpen}
          onClose={() => setIsWorkflowOpen(false)}
          onComplete={handleWorkflowComplete}
        />
      )}

      {/* 6. 3D ANALYSIS MODAL */}
      <PotholeInspectionDetailModal
        pothole={selectedPothole}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
};
