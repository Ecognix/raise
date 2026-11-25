import React, { useState, useRef } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Upload,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  RotateCcw,
  Sliders,
  Camera
} from 'lucide-react';

interface ComparisonPair {
  id: string;
  roadName: string;
  roadId: string;
  chainage: string;
  beforePhoto: string;
  afterPhoto: string;
  beforeConditionScore: number;
  afterConditionScore: number;
  eliminatedDefects: string[];
  remainingNotes: string;
  verifiedBy: string;
  verificationDate: string;
}

const COMPARISON_PAIRS: ComparisonPair[] = [
  {
    id: "COMP-01",
    roadName: "Hirakjyoti Kakati Road",
    roadId: "RAISE-AS-GHY-2026-008741",
    chainage: "Km 0+420 (By Lane 12 Entry)",
    beforePhoto: "/images/pothole_big.jpg",
    afterPhoto: "/images/after_repair_smooth.svg",
    beforeConditionScore: 64,
    afterConditionScore: 92,
    eliminatedDefects: [
      "P01 Severe Carriageway Pothole (Depth: 85mm) — Excavated & Reinstated",
      "C03 Fatigue Alligator Cracking — Full Milling 60mm & Dense Bituminous Macadam",
      "Subgrade Void Infiltration — Compacted & Geotextile Sealed"
    ],
    remainingNotes: "Zero critical hazards remaining. Fresh bituminous surface course curing satisfactorily. 7-day load restriction in force.",
    verifiedBy: "Er. N. Kalita, Executive Engineer, PWrD Guwahati",
    verificationDate: "2026-11-18"
  },
  {
    id: "COMP-02",
    roadName: "GS Road (Guwahati-Shillong Arterial)",
    roadId: "RD-GAU-001",
    chainage: "Km 3+200 (Bhangagarh Landing)",
    beforePhoto: "/images/potholes_on_asphalt_road_20171023.jpg",
    afterPhoto: "/images/after_repair_smooth2.svg",
    beforeConditionScore: 58,
    afterConditionScore: 89,
    eliminatedDefects: [
      "P01 Carriageway Pothole (Depth: 68mm) — Re-profiled & Compacted",
      "D01 Rutting Channel (45mm depth) — Microsurfacing Applied",
      "Edge Fraying (12m span) — Shoulder Recompacted & Sealed"
    ],
    remainingNotes: "Surface curing complete. Longitudinal thermoplastic line marking repaint scheduled.",
    verifiedBy: "Er. P. Barman, Sectional Officer, Division I",
    verificationDate: "2026-11-16"
  },
  {
    id: "COMP-03",
    roadName: "AT Road (Assam Trunk Corridor)",
    roadId: "RD-GAU-003",
    chainage: "Km 7+450 (Khanapara Interchange Approach)",
    beforePhoto: "/images/pothole_in_an_asphalt_pavement.jpg",
    afterPhoto: "/images/after_repair_bm.svg",
    beforeConditionScore: 55,
    afterConditionScore: 91,
    eliminatedDefects: [
      "P01 Critical Pothole (Depth: 92mm) — Full-Depth Excavation & Reinstatement",
      "C01 Longitudinal Cracking (28m) — Crack Sealing & Bitumen Macadam Overlay",
      "Edge Break (Shoulder, 15m) — Recompacted & Stone Pitching Applied"
    ],
    remainingNotes: "Surface course 7-day curing period active. HCV load restriction in place (< 10 T axle).",
    verifiedBy: "Er. D. Nath, Assistant Engineer, NH Division II",
    verificationDate: "2026-11-15"
  },
  {
    id: "COMP-04",
    roadName: "Dr. Zakir Hussain Road",
    roadId: "RD-GAU-031",
    chainage: "Km 1+900 (Chachal Link Junction)",
    beforePhoto: "/images/asphalt_deterioration.jpg",
    afterPhoto: "/images/after_repair_multilane.svg",
    beforeConditionScore: 60,
    afterConditionScore: 88,
    eliminatedDefects: [
      "C03 Alligator (Map) Cracking (38 sq.m) — Full Milling 50mm Depth & DBM Infill",
      "P02 Moderate Pothole (Depth: 74mm) — Re-profiling & Compaction",
      "D02 Subsurface Drainage Failure — French Drain Installed at Km 1+870"
    ],
    remainingNotes: "Joint sealing at kerb edge pending contractor return (Day 3). Road open to light traffic.",
    verifiedBy: "Er. M. Ahmed, Executive Engineer, Urban Division",
    verificationDate: "2026-11-17"
  },
  {
    id: "COMP-05",
    roadName: "Beltola-Basistha Road",
    roadId: "RD-GAU-005",
    chainage: "Km 4+100 (Basistha Market Junction)",
    beforePhoto: "/images/photo-1584467735815-f778f274e296.jpg",
    afterPhoto: "/images/after_repair_smooth.svg",
    beforeConditionScore: 62,
    afterConditionScore: 90,
    eliminatedDefects: [
      "C02 Transverse Cracking (22m span) — Crack Sealing & Surface Dressing",
      "P01 Medium Pothole (Depth: 58mm) — Cold-Mix Reinstatement & Plate Compaction",
      "W01 Waterlogging Zone — Cross-Drainage Culvert Desilted & Repaired"
    ],
    remainingNotes: "Traffic signal loop detector recalibration pending. No residual structural defects.",
    verifiedBy: "Er. R. Das, Junior Engineer, Basistha Division",
    verificationDate: "2026-11-14"
  },
  {
    id: "COMP-06",
    roadName: "Mother Teresa Road",
    roadId: "RD-GAU-012",
    chainage: "Km 2+650 (Near SBI Branch, Ulubari)",
    beforePhoto: "/images/photo-1515162816999-a0c47dc192f7.jpg",
    afterPhoto: "/images/after_repair_smooth2.svg",
    beforeConditionScore: 67,
    afterConditionScore: 93,
    eliminatedDefects: [
      "P03 Shallow Pothole Cluster (12 pits, avg 42mm) — Batch Cold-Mix & Rolling",
      "C04 Reflection Cracking (18m) — Stress Absorbing Membrane Interlayer (SAMI) Applied",
      "Surface Ravelling (25 sq.m) — Slurry Seal Treatment"
    ],
    remainingNotes: "No residual hazards. PCI improved from 67 to 93. Next scheduled resurvey: 2027-02.",
    verifiedBy: "Er. B. Gogoi, Executive Engineer, PWrD Urban Zone",
    verificationDate: "2026-11-19"
  }
];

export const BeforeAfterVerificationPage: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState<ComparisonPair>(COMPARISON_PAIRS[0]);
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const scoreDelta = selectedPair.afterConditionScore - selectedPair.beforeConditionScore;

  return (
    <div className="space-y-6 select-none animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-[#0A1220] border border-cyan-500/40 rounded-xl p-5 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Interactive Split-Slider Analysis
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-800">
              Photogrammetric Audit
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white tracking-wide">
            Before & After Road Repair Verification
          </h1>
          <p className="text-xs text-slate-400">
            Side-by-side comparative verification of pre-repair defect imagery versus post-repair physical reinstatement
          </p>
        </div>

        {/* Corridor Selector — scrollable row for 6 roads */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-thin scrollbar-thumb-slate-700">
          {COMPARISON_PAIRS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPair(p)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-semibold border transition whitespace-nowrap ${
                selectedPair.id === p.id
                  ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:text-white border-slate-700 bg-slate-900 hover:border-slate-500'
              }`}
            >
              {p.id} · {p.roadName.length > 22 ? p.roadName.slice(0, 22) + '…' : p.roadName}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Slider Viewport */}
      <div className="bg-[#0A1220] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">
                {selectedPair.roadName} &bull; {selectedPair.chainage}
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                {selectedPair.roadId}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Drag the central divider horizontally to inspect pre-repair defect vs post-rectification surface
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-rose-400 font-bold">PRE-REPAIR (LEFT)</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-emerald-400 font-bold">POST-REPAIR (RIGHT)</span>
          </div>
        </div>

        {/* Split Comparison Frame */}
        <div
          ref={containerRef}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="relative h-80 sm:h-96 w-full rounded-xl overflow-hidden border border-slate-700 cursor-ew-resize bg-black select-none"
        >
          {/* After Photo (Full background base) */}
          <img
            src={selectedPair.afterPhoto}
            alt="After repair"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* After Label Badge */}
          <div className="absolute top-3 right-3 bg-emerald-950/90 text-emerald-300 border border-emerald-600 px-2.5 py-1 rounded text-xs font-mono font-bold pointer-events-none shadow-lg">
            POST-REPAIR: CONDITION {selectedPair.afterConditionScore}/100
          </div>

          {/* Before Photo (Clipped overlay based on sliderPos) */}
          <div
            className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={selectedPair.beforePhoto}
              alt="Before repair"
              className="absolute inset-y-0 left-0 w-full h-full object-cover max-w-none"
              style={{
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%'
              }}
            />
            {/* Before Label Badge */}
            <div className="absolute top-3 left-3 bg-rose-950/90 text-rose-300 border border-rose-600 px-2.5 py-1 rounded text-xs font-mono font-bold shadow-lg">
              PRE-REPAIR: CONDITION {selectedPair.beforeConditionScore}/100
            </div>
          </div>

          {/* Draggable Divider Line */}
          <div
            className="absolute inset-y-0 w-1 bg-white shadow-[0_0_12px_#38bdf8] cursor-ew-resize pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-900 border-2 border-cyan-500 shadow-xl flex items-center justify-center font-bold text-xs">
              &harr;
            </div>
          </div>
        </div>

        {/* Audit Metrics & Verification Sign-Off */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          {/* Box 1: Condition Score Delta */}
          <div className="bg-[#070D18] p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Road Health Improvement
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-emerald-400">
                +{scoreDelta}
              </span>
              <span className="text-slate-400 font-mono">Condition Points</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Score elevated from <strong>{selectedPair.beforeConditionScore}</strong> (Moderate Risk) to <strong>{selectedPair.afterConditionScore}</strong> (Good Condition).
            </p>
          </div>

          {/* Box 2: Defect Rectification Status */}
          <div className="bg-[#070D18] p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Defects Resolved ({selectedPair.eliminatedDefects.length})
            </span>
            <ul className="space-y-1 text-slate-300">
              {selectedPair.eliminatedDefects.map((def, idx) => (
                <li key={idx} className="flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{def}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Box 3: Engineer Official Certification */}
          <div className="bg-[#070D18] p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              PWrD Engineering Certification
            </span>
            <div className="text-slate-200 font-semibold">{selectedPair.verifiedBy}</div>
            <div className="text-[11px] text-slate-400 font-mono">
              Audit Date: {selectedPair.verificationDate} &bull; Sign-off: Certified
            </div>
            <p className="text-[10px] text-emerald-400 font-medium">
              Passed independent mobile vision resurvey with zero recurring cavities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
