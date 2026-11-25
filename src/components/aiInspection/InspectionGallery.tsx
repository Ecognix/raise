import React, { useState } from 'react';
import { HIRAKJYOTI_POTHOLES, PotholeDemoRecord } from '../../data/demonstrationRoadData';
import { Camera, Sparkles, AlertTriangle, Eye, Ruler, Droplets, CheckCircle2, ChevronRight } from 'lucide-react';

interface InspectionGalleryProps {
  roadName?: string;
  potholes?: PotholeDemoRecord[];
  onExaminePothole: (pothole: PotholeDemoRecord) => void;
  onSelectPothole: (pothole: PotholeDemoRecord) => void;
}

export const InspectionGallery: React.FC<InspectionGalleryProps> = ({
  roadName = "Hirakjyoti Kakati Road",
  potholes = HIRAKJYOTI_POTHOLES,
  onExaminePothole,
  onSelectPothole
}) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'floodZone'>('all');

  const displayedPotholes = potholes.filter(p => {
    if (filter === 'critical') return p.severity === 'severe';
    if (filter === 'floodZone') return p.chainageMeters >= 800 && p.chainageMeters <= 2500;
    return true;
  });

  return (
    <div className="bg-[#0A1220] border border-slate-800 rounded-xl overflow-hidden shadow-xl text-slate-200">
      {/* Header bar */}
      <div className="px-5 py-4 bg-[#070D18] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white tracking-wide">
                {roadName} &bull; AI Inspection Photo Gallery
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {potholes.length} High-Res Detections
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Captured via V-017 Mobile Vision Rig &bull; Select any record to initiate 10-step AI Analysis
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md font-semibold transition ${
              filter === 'all' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Detections ({potholes.length})
          </button>
          <button
            onClick={() => setFilter('critical')}
            className={`px-3 py-1.5 rounded-md font-semibold transition ${
              filter === 'critical' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Critical Level 4 ({potholes.filter(p => p.severity === 'severe').length})
          </button>
          <button
            onClick={() => setFilter('floodZone')}
            className={`px-3 py-1.5 rounded-md font-semibold transition ${
              filter === 'floodZone' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Flood Risk Corridor (6)
          </button>
        </div>
      </div>

      {/* Grid of Pothole Cards */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedPotholes.map((p) => {
          const isCritical = p.severity === 'severe';

          return (
            <div
              key={p.id}
              className={`bg-[#070D18] rounded-xl border transition-all duration-200 overflow-hidden flex flex-col group hover:-translate-y-1 hover:shadow-2xl ${
                isCritical
                  ? 'border-rose-900/60 hover:border-rose-500 shadow-rose-950/20'
                  : 'border-slate-800 hover:border-cyan-500/50 shadow-slate-950/40'
              }`}
            >
              {/* Image Frame with badges */}
              <div className="relative h-44 overflow-hidden bg-slate-950">
                <img
                  src={p.photoUrl}
                  alt={p.id}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />

                {/* Top overlay badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0A1220]/90 backdrop-blur text-cyan-300 border border-cyan-500/40">
                    {p.chainage}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold backdrop-blur ${
                      isCritical
                        ? 'bg-rose-950/90 text-rose-300 border border-rose-600'
                        : 'bg-amber-950/90 text-amber-300 border border-amber-600'
                    }`}
                  >
                    {p.severity.toUpperCase()}
                  </span>
                </div>

                {/* Bottom overlay indicators */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-slate-300">
                  <div className="bg-[#0A1220]/85 backdrop-blur px-2 py-0.5 rounded border border-slate-700/60 flex items-center gap-1.5 font-mono">
                    <Ruler className="w-3 h-3 text-cyan-400" />
                    <span>Depth: -{p.depthMm}mm</span>
                  </div>

                  {p.waterFilled && (
                    <div className="bg-blue-950/90 text-blue-300 border border-blue-700/60 px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
                      <Droplets className="w-3 h-3" />
                      <span>Waterlogged</span>
                    </div>
                  )}

                  {p.soilSubgradeExposed && (
                    <div className="bg-amber-950/90 text-amber-300 border border-amber-700/60 px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Subgrade Void</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white tracking-wider">
                      {p.id}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-mono font-semibold">
                      AI Conf: {p.confidenceScore}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 font-medium line-clamp-1">
                    {p.lane} &bull; {p.lengthCm}cm &times; {p.widthCm}cm ({p.surfaceAreaM2} m²)
                  </p>

                  <div className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-800 line-clamp-2">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                      Recommended Action:
                    </span>
                    {p.recommendedMethod}
                  </div>
                </div>

                {/* Actions: EXAMINE POTHOLE Button (Prominent) */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => onExaminePothole(p)}
                    className="flex-1 py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>EXAMINE POTHOLE</span>
                  </button>

                  <button
                    onClick={() => onSelectPothole(p)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                    title="View 3D Model Directly"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
