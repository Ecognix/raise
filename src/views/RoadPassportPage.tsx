import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card } from '../components/common/Card';
import {
  FileText,
  Search,
  AlertTriangle,
  ShieldCheck,
  Building2,
  Calendar,
  Ruler,
  MapPin,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  AlertOctagon,
  ArrowRight,
  Box
} from 'lucide-react';
import { SeverityBadge, SourceTrustBadge, DefectTypeBadge, StatusBadge } from '../components/common/Badge';

interface RoadPassportPageProps {
  selectedRoadId?: string | null;
  onNavigateToMap: () => void;
  onNavigateTo3DView?: (roadId: string) => void;
}

export const RoadPassportPage: React.FC<RoadPassportPageProps> = ({
  selectedRoadId: selectedRoadIdOverride,
  onNavigateToMap,
  onNavigateTo3DView
}) => {
  const { roads, defects, selectedRoadId, setSelectedRoadId } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    if (selectedRoadIdOverride) {
      setSelectedRoadId(selectedRoadIdOverride);
    }
  }, [selectedRoadIdOverride, setSelectedRoadId]);

  // Selected road
  const activeRoadId = selectedRoadIdOverride || selectedRoadId;
  const currentRoad = roads.find(r => r.id === activeRoadId) || roads[0];

  // Defects on this road
  const roadDefects = defects.filter(d => d.roadId === currentRoad.id);

  // Search filter
  const filteredRoadsList = roads.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.locationArea.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock timeline events for this road
  const timelineEvents = [
    {
      date: "2024-05-18",
      type: "inspection",
      title: "AI Vehicle-Mounted Video Surveillance Pass",
      description: "Sensor run detected 3 anomalies with high confidence. Pavement roughness index logged.",
      cost: null,
      status: "Automated",
    },
    {
      date: "2024-05-10",
      type: "defect",
      title: `Defect Detected (${roadDefects[0]?.defectType || 'Pothole'})`,
      description: roadDefects[0]?.notes || "Carriageway subgrade failure noted along primary traffic lane.",
      cost: roadDefects[0]?.estimatedCost || 45000,
      status: "AI-generated",
    },
    {
      date: "2023-11-15",
      type: "repair",
      title: "Routine Resurfacing & Crack Sealing",
      description: "Contractor execution of 40mm bituminous concrete overlay on critical patches.",
      cost: 420000,
      contractor: currentRoad.contractor,
      status: "Completed",
    },
    {
      date: "2022-09-10",
      type: "inspection",
      title: "Monsoon Post-Flood Engineering Assessment",
      description: "Executive Engineer on-ground audit following severe stormwater runoff.",
      cost: null,
      status: "Field-verified",
    },
    {
      date: `${currentRoad.completionYear}-04-01`,
      type: "milestone",
      title: "Initial Commissioning & Handover to PWD",
      description: `Constructed under Assam State Road Improvement Project. Supervised by ${currentRoad.ownership}.`,
      cost: 18500000,
      status: "Commissioned",
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header & Road Selector */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              Road Asset Digital Passport
            </h2>
            <span className="text-xs bg-navy-100 text-navy-900 font-bold px-2 py-0.5 rounded">
              Lifecyle & Audit Registry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete provenance, structural specifications, recurring distress history, and expenditure ledger.
          </p>
        </div>

        {/* Search & Selector Dropdown + 3D Road View Button */}
        <div className="flex flex-wrap items-center gap-2 min-w-[280px]">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={currentRoad.id}
              onChange={(e) => setSelectedRoadId(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-navy-800"
            >
              {roads.map(r => (
                <option key={r.id} value={r.id}>
                  {r.id}: {r.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              if (onNavigateTo3DView) {
                onNavigateTo3DView(currentRoad.id);
              } else {
                onNavigateToMap();
              }
            }}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-lg shadow-md shadow-cyan-900/30 flex items-center gap-2 transition active:scale-98 animate-pulse shrink-0"
            title="Inspect this corridor in 3D Road View with all potholes"
          >
            <Box className="w-4 h-4 text-cyan-200" />
            <span>3D Road View</span>
          </button>
        </div>
      </div>

      {/* Recurring Failure Warning (Prompt Requirement) */}
      {currentRoad.recurringRepairsCount > 2 && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg shadow-sm flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-red-600 shrink-0 mt-0.5 animate-bounce" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-red-950 flex items-center gap-2">
              <span>Recurring Failure Warning (Tier 3 Recurrent Distress)</span>
              <span className="text-xs bg-red-200 text-red-900 px-2 py-0.5 rounded font-mono font-bold">
                {currentRoad.recurringRepairsCount} Past Repairs Logged
              </span>
            </h4>
            <p className="text-xs text-red-900 leading-relaxed">
              This road segment has undergone more than two repairs over identical GPS coordinates without resolving root structural failure. AI diagnostics attribute recurrence to <strong>sub-base water seepage and inadequate roadside hydraulic gradient</strong>.
            </p>
            <p className="text-[11px] text-red-800 font-semibold">
              Action Required: Executive Engineer must issue a Deep-Pavement Soil Stabilization order rather than repeated superficial asphalt patching.
            </p>
          </div>
        </div>
      )}

      {/* Road Identity Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Identity Certificate */}
        <div className="lg:col-span-2">
          <Card
            title="Road Asset Identity Certificate"
            subtitle={`Official Government Asset Record &bull; Kamrup Metro PWD`}
            headerAction={<SeverityBadge severity={currentRoad.overallSeverity || (currentRoad.conditionScore >= 70 ? 'good' : currentRoad.conditionScore >= 50 ? 'moderate' : 'severe')} />}
          >
            <div className="border border-slate-200 rounded-lg p-5 bg-gradient-to-br from-white to-slate-50 space-y-5">
              {/* Asset Title Block */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
                <div>
                  <div className="text-xs font-mono font-bold text-navy-800 tracking-wide">
                    ASSET ID: {currentRoad.id}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    {currentRoad.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Location: {currentRoad.locationArea}</span>
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500 font-medium">Condition Health Score</div>
                  <div className="text-2xl font-black font-mono text-navy-900">
                    {currentRoad.conditionScore}<span className="text-sm text-slate-400">/100</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Category: <strong className="text-slate-700">{currentRoad.category}</strong>
                  </div>
                </div>
              </div>

              {/* Identity Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-white rounded border border-slate-200">
                  <span className="text-slate-400 text-[11px] block">Statutory Ownership</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{currentRoad.ownership}</span>
                </div>

                <div className="p-3 bg-white rounded border border-slate-200">
                  <span className="text-slate-400 text-[11px] block">Carriageway Length</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{currentRoad.lengthKm} Kilometres</span>
                </div>

                <div className="p-3 bg-white rounded border border-slate-200">
                  <span className="text-slate-400 text-[11px] block">Contractor on Record</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{currentRoad.contractor}</span>
                </div>

                <div className="p-3 bg-white rounded border border-slate-200">
                  <span className="text-slate-400 text-[11px] block">Year of Commissioning</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{currentRoad.completionYear}</span>
                </div>

                <div className="p-3 bg-white rounded border border-slate-200">
                  <span className="text-slate-400 text-[11px] block">Last Resurfaced</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{currentRoad.lastResurfaced}</span>
                </div>

                <div className="p-3 bg-white rounded border border-slate-200">
                  <span className="text-slate-400 text-[11px] block">Flood Vulnerability</span>
                  <span className={`font-semibold block mt-0.5 ${
                    currentRoad.floodRiskLevel === 'High' ? 'text-red-700' : 'text-slate-800'
                  }`}>
                    {currentRoad.floodRiskLevel} Risk Zone
                  </span>
                </div>
              </div>

              {/* Societal Dependency Footer */}
              <div className="p-3 bg-slate-100 rounded text-xs text-slate-700 space-y-1">
                <div className="font-semibold text-slate-900 flex items-center justify-between">
                  <span>Societal Access Profile:</span>
                  <span>Pop. Served: {currentRoad.populationServed.toLocaleString()}</span>
                </div>
                <div className="text-[11px] text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                  <span>&bull; Dependent Hamlets: {currentRoad.villagesDependent} villages</span>
                  <span>&bull; Alternative Route: {currentRoad.alternativeRouteAvailable ? 'Yes' : 'No'}</span>
                  <span>&bull; Detour: {currentRoad.detourDistanceKm} km</span>
                  {currentRoad.hospitalSchoolAccess && (
                    <span className="text-blue-800 font-semibold">&bull; Emergency Hospital Access Corridor</span>
                  )}
                </div>
              </div>

              {/* 3D Road View Action Banner */}
              <div className="p-3.5 bg-slate-900 rounded-lg text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-slate-700">
                <div>
                  <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <Box className="w-4 h-4 text-cyan-400" />
                    <span>Interactive 3D Road Twin & Pothole Mesh</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Inspect complete top-down carriageway layout with individual 3D depth models for each detected pothole.
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onNavigateTo3DView) {
                      onNavigateTo3DView(currentRoad.id);
                    } else {
                      onNavigateToMap();
                    }
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-lg shadow-md flex items-center justify-center gap-1.5 transition shrink-0 active:scale-98"
                >
                  <Box className="w-4 h-4 text-cyan-200" />
                  <span>3D Road View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Quick Expenditure & Active Defects Summary */}
        <div className="space-y-6">
          <Card
            title="Maintenance Expenditure Ledger"
            subtitle="Historical repair disbursements"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-xs text-slate-600">Total Lifecycle Spend</span>
                <span className="text-sm font-bold font-mono text-slate-900">₹2.48 Crore</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-xs text-slate-600">FY 2023-24 Patching</span>
                <span className="text-sm font-bold font-mono text-slate-900">₹4.85 Lakh</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-xs text-slate-600">Pending Defect Estimates</span>
                <span className="text-sm font-bold font-mono text-amber-700">
                  ₹{roadDefects.reduce((acc, d) => acc + (d.estimatedCost || d.estimatedRepairCost || 0), 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 italic">
              Cost estimates are preliminary and subject to PWD EE financial concurrence.
            </p>
          </Card>

          <Card
            title={`Active Defects on this Road (${roadDefects.length})`}
            subtitle="Current anomalies requiring intervention"
          >
            {roadDefects.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                No active anomalies logged for this road.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {roadDefects.map(d => (
                  <div key={d.id} className="p-2.5 bg-slate-50 rounded border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold text-slate-800">{d.id}</span>
                      <SeverityBadge severity={d.severity} size="sm" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-600">
                      <DefectTypeBadge type={d.defectType || d.code} />
                      <span className="font-mono text-slate-700">₹{(d.estimatedCost || d.estimatedRepairCost || 0).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Timeline of Inspections, Defects & Repairs */}
      <Card
        title="Asset Lifecycle Chronology & Inspection Timeline"
        subtitle="Complete chronological audit trail from initial commissioning to latest AI surveillance pass"
      >
        <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6 my-2">
          {timelineEvents.map((evt, idx) => (
            <div key={idx} className="relative group">
              {/* Dot */}
              <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${
                evt.type === 'inspection' ? 'bg-blue-600' :
                evt.type === 'defect' ? 'bg-red-600' :
                evt.type === 'repair' ? 'bg-emerald-600' : 'bg-navy-800'
              }`}></div>

              <div className="bg-slate-50 group-hover:bg-slate-100/80 transition p-4 rounded-lg border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{evt.title}</span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                      {evt.status}
                    </span>
                  </div>
                  <div className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{evt.date}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  {evt.description}
                </p>

                {evt.cost && (
                  <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Expenditure Sanction:</span>
                    <span className="font-mono font-bold text-slate-800">
                      ₹{evt.cost.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
