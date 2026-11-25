import React, { useState } from 'react';
import { RoadSegment } from '../../types';
import {
  Search,
  X,
  FileText,
  MapPin,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  AlertTriangle,
  Building2,
  Sliders,
  CheckCircle2,
  Box
} from 'lucide-react';

interface RoadSelectorModalProps {
  roads: RoadSegment[];
  isOpen: boolean;
  onClose: () => void;
  onSelectRoadForPassport: (roadId: string) => void;
  onSelectRoadFor3DView?: (roadId: string) => void;
}

export const RoadSelectorModal: React.FC<RoadSelectorModalProps> = ({
  roads,
  isOpen,
  onClose,
  onSelectRoadForPassport,
  onSelectRoadFor3DView
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  if (!isOpen) return null;

  // Filter roads
  const filteredRoads = roads.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.locationArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.contractor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDivision =
      selectedDivision === 'all' || r.division.toLowerCase().includes(selectedDivision.toLowerCase());

    const matchesSeverity =
      selectedSeverity === 'all' ||
      (selectedSeverity === 'critical' && r.conditionScore < 60) ||
      (selectedSeverity === 'moderate' && r.conditionScore >= 60 && r.conditionScore < 75) ||
      (selectedSeverity === 'good' && r.conditionScore >= 75);

    return matchesSearch && matchesDivision && matchesSeverity;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="bg-[#0A1220] border border-cyan-500/50 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#070D18] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white tracking-wide">
                  Select Road for Manual Inspection & Digital Passport
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
                  {roads.length} Corridors
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Choose any corridor (e.g. Hirakjyoti Kakati Road, Dr. Zakir Hussain Road) to inspect its passport and 3D road view
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-[#0A1220] border-b border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by road name (e.g. Dr. Zakir Hussain, Hirakjyoti, GS Road), ID, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
              />
            </div>

            {/* Division Filter */}
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-medium"
            >
              <option value="all">All Divisions (Kamrup Metro)</option>
              <option value="Central">Guwahati Central</option>
              <option value="East">Guwahati East</option>
              <option value="West">Guwahati West</option>
              <option value="South">Guwahati South</option>
            </select>

            {/* Condition Filter */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-medium"
            >
              <option value="all">All Health Scores</option>
              <option value="critical">Critical Damage (&lt;60)</option>
              <option value="moderate">Moderate Wear (60-74)</option>
              <option value="good">Good Condition (&ge;75)</option>
            </select>
          </div>

          {/* Quick Highlight Pills */}
          <div className="flex items-center gap-2 overflow-x-auto text-[11px] text-slate-400">
            <span className="font-semibold text-slate-500 shrink-0">Featured Corridors:</span>
            <button
              onClick={() => setSearchQuery('Hirakjyoti Kakati')}
              className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 hover:border-cyan-500 shrink-0 transition"
            >
              Hirakjyoti Kakati Road (By Lane 12)
            </button>
            <button
              onClick={() => setSearchQuery('Zakir Hussain')}
              className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 hover:border-cyan-500 shrink-0 transition"
            >
              Dr. Zakir Hussain Road (Downtown - Hengrabari)
            </button>
            <button
              onClick={() => setSearchQuery('GS Road')}
              className="px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-600 shrink-0 transition"
            >
              GS Road (Guwahati-Shillong)
            </button>
            <button
              onClick={() => setSearchQuery('AT Road')}
              className="px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-600 shrink-0 transition"
            >
              AT Road (Assam Trunk)
            </button>
          </div>
        </div>

        {/* Roads Grid / List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRoads.map((road) => {
            const isHirakjyoti = road.id === 'RAISE-AS-GHY-2026-008741';
            const isZakirHussain = road.id === 'RD-GAU-031' || road.name.includes('Zakir Hussain');

            const scoreColor =
              road.conditionScore >= 75
                ? 'text-emerald-400 bg-emerald-950/80 border-emerald-700'
                : road.conditionScore >= 60
                ? 'text-amber-400 bg-amber-950/80 border-amber-700'
                : 'text-rose-400 bg-rose-950/80 border-rose-700';

            return (
              <div
                key={road.id}
                onClick={() => {
                  onSelectRoadForPassport(road.id);
                  onClose();
                }}
                className={`bg-[#070D18] rounded-xl border p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 group hover:-translate-y-0.5 hover:shadow-xl ${
                  isHirakjyoti || isZakirHussain
                    ? 'border-cyan-500/80 shadow-lg shadow-cyan-950/30'
                    : 'border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                      {road.id}
                    </span>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${scoreColor}`}>
                      Condition: {road.conditionScore}/100
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2 pt-1">
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition">
                        {road.name}
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="line-clamp-1">{road.locationArea}</span>
                      </p>
                    </div>

                    {(isHirakjyoti || isZakirHussain) && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                        {isHirakjyoti ? 'Demo Corridor' : 'Priority Corridor'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Attributes Row */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/80 text-[11px] font-mono text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Length</span>
                    <strong className="text-white">{road.lengthKm} km</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Potholes 24h</span>
                    <strong className="text-rose-400">{road.potholesLast24hCount || 8} units</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Flood Risk</span>
                    <strong className={road.floodRiskLevel === 'High' ? 'text-amber-400' : 'text-slate-300'}>
                      {road.floodRiskLevel}
                    </strong>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="flex items-center justify-between gap-2 text-xs pt-1">
                  <span className="text-[11px] text-slate-400 truncate max-w-[160px]">
                    {road.division}
                  </span>

                  <div className="flex items-center gap-2">
                    {onSelectRoadFor3DView && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRoadFor3DView(road.id);
                          onClose();
                        }}
                        className="px-2.5 py-1.5 bg-cyan-700/80 hover:bg-cyan-600 text-white font-bold rounded-lg transition flex items-center gap-1 shadow-xs text-[11px]"
                        title="Open interactive 3D road visualization with all potholes"
                      >
                        <Box className="w-3.5 h-3.5" />
                        <span>3D View</span>
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRoadForPassport(road.id);
                        onClose();
                      }}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition flex items-center gap-1 border border-slate-700 text-[11px]"
                      title="View digital passport and contractor ledger"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Passport</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#070D18] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filteredRoads.length} of {roads.length} monitored corridors across Kamrup Metro</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
