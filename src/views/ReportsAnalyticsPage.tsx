import React, { useState } from 'react';
import { useRaiseStore } from '../store/useRaiseStore';
import { getRoadInspectionData } from '../data/demonstrationRoadData';
import {
  FileText,
  FileDown,
  Printer,
  Table,
  CheckCircle2,
  Calendar,
  Building2,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const ReportsAnalyticsPage: React.FC = () => {
  const { roads, defects, vehicles } = useRaiseStore();
  const [selectedReportType, setSelectedReportType] = useState<
    'sitrep' | 'corridor' | 'defects' | 'contractors' | 'boq'
  >('sitrep');
  const [selectedRoadId, setSelectedRoadId] = useState<string>('RD-GAU-001');
  const [csvDownloaded, setCsvDownloaded] = useState<boolean>(false);

  const selectedRoadInspection = getRoadInspectionData(selectedRoadId, roads);

  // CSV Exporter Helper
  const handleExportCsv = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    if (selectedReportType === 'defects') {
      csvContent += "Defect_ID,Code,Road_Name,Location,Severity,Depth_mm,Cost_INR\n";
      defects.slice(0, 50).forEach((d) => {
        csvContent += `"${d.id}","${d.code}","${d.roadName}","${d.locationArea}","${d.severity}",${d.depthMm || 0},${d.estimatedRepairCost || 0}\n`;
      });
    } else {
      csvContent += "Road_ID,Road_Name,Length_km,Condition_Score,Potholes_24h,Flood_Risk\n";
      roads.forEach((r) => {
        csvContent += `"${r.id}","${r.name}",${r.lengthKm},${r.conditionScore},${r.potholesLast24hCount || 0},"${r.floodRiskLevel}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RAISE_Report_${selectedReportType}_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCsvDownloaded(true);
    setTimeout(() => setCsvDownloaded(false), 3000);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-[#0A1220] border border-cyan-500/40 rounded-xl p-5 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              Statutory Reporting & Automated SitRep Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-800">
              PDF & CSV Generation Ready
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white tracking-wide">
            Infrastructure Analytics, SitRep & Audit Documentation
          </h1>
          <p className="text-xs text-slate-400">
            Generate printable situation reports, defect audit sheets, and preliminary maintenance proposals
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-2"
          >
            <Table className="w-4 h-4 text-cyan-400" />
            <span>{csvDownloaded ? 'Exported!' : 'Export CSV'}</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-cyan-950/40"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector Pills */}
      <div className="bg-[#070D18] border border-slate-800 rounded-xl p-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider mr-2">
          Select Report Document:
        </span>
        {[
          { id: 'sitrep', label: '24-Hour Situation Report (SitRep)' },
          { id: 'corridor', label: 'Corridor AI Inspection Report (56 Roads)' },
          { id: 'defects', label: 'Guwahati Defect Register (108 Potholes)' },
          { id: 'contractors', label: 'Contractor Oversight & Audit' },
          { id: 'boq', label: 'Material BOQ Estimates (SOR 2024-25)' }
        ].map((rep) => (
          <button
            key={rep.id}
            onClick={() => setSelectedReportType(rep.id as any)}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              selectedReportType === rep.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {rep.label}
          </button>
        ))}
      </div>

      {/* Printable Report Document Card Container */}
      <div className="bg-white text-slate-900 rounded-xl shadow-2xl p-6 sm:p-8 space-y-6 max-w-5xl mx-auto border border-slate-300 print:p-0 print:border-none print:shadow-none">
        {/* Official Letterhead */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded border-2 border-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 bg-slate-50">
              PWrD
            </div>
            <div>
              <h2 className="text-lg font-extrabold uppercase tracking-tight text-slate-950">
                Public Works Roads Department (PWrD), Assam
              </h2>
              <p className="text-xs text-slate-700 font-semibold">
                Road Safety Cell &bull; Road Asset Intelligence and Safety Engine (RAISE)
              </p>
              <p className="text-[11px] text-slate-500">
                Government of Assam &bull; Dispur, Guwahati – 781006
              </p>
            </div>
          </div>

          <div className="text-right text-xs">
            <div className="font-mono font-bold text-slate-950">
              DOC REF: RAISE-SITREP-2026-1118
            </div>
            <div className="text-slate-600">Generated: 2026-11-18 20:00 IST</div>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              OFFICIAL GOVERNMENT RECORD
            </span>
          </div>
        </div>

        {/* 1. SITREP REPORT VIEW */}
        {selectedReportType === 'sitrep' && (
          <div className="space-y-5 text-xs text-slate-800">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide mb-1">
                Executive 24-Hour Operations Summary
              </h3>
              <p className="text-slate-600 leading-relaxed">
                During the 24-hour reporting cycle ending 18-Nov-2026, 43 mobile telemetry units patrolled Guwahati arterial routes. 108 high-priority pothole cavities were detected, including 87 today and 23 on the GS Road corridor. 34 defects currently await field engineer physical review. 12 events remain queued in offline store-and-forward buffers in low-connectivity sectors.
              </p>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-100 rounded border">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Vehicles Reporting</span>
                <div className="text-xl font-bold font-mono text-slate-900">43 Active</div>
              </div>
              <div className="p-3 bg-slate-100 rounded border">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Potholes (24h)</span>
                <div className="text-xl font-bold font-mono text-red-700">108 Identified</div>
              </div>
              <div className="p-3 bg-slate-100 rounded border">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Awaiting Review</span>
                <div className="text-xl font-bold font-mono text-amber-700">34 Units</div>
              </div>
              <div className="p-3 bg-slate-100 rounded border">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Demo Corridor</span>
                <div className="text-xl font-bold font-mono text-slate-900">Hirakjyoti Kakati</div>
              </div>
            </div>

            {/* Table of Top Corridors */}
            <div className="border border-slate-300 rounded overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 font-bold text-slate-900 border-b">
                Corridor Pothole Distribution (Top 5 Ranked)
              </div>
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-50 border-b font-mono">
                  <tr>
                    <th className="p-2">Road Corridor</th>
                    <th className="p-2">Location Area</th>
                    <th className="p-2 text-center">Potholes Detected</th>
                    <th className="p-2 text-center">Condition Score</th>
                    <th className="p-2">Triage Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  <tr>
                    <td className="p-2 font-bold text-slate-900">GS Road (Guwahati-Shillong)</td>
                    <td className="p-2">Bhangagarh to Khanapara</td>
                    <td className="p-2 text-center font-mono font-bold text-red-700">23 Today</td>
                    <td className="p-2 text-center font-mono">68 / 100</td>
                    <td className="p-2 font-semibold text-amber-700">Under Review</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-900">AT Road (Assam Trunk Corridor)</td>
                    <td className="p-2">Bharalumukh to Jalukbari</td>
                    <td className="p-2 text-center font-mono font-bold text-red-700">19 Today</td>
                    <td className="p-2 text-center font-mono">62 / 100</td>
                    <td className="p-2 font-semibold text-red-700">Priority Assigned</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-900">Hirakjyoti Kakati Road</td>
                    <td className="p-2">By Lane 12, Zoo Road to Japorigog</td>
                    <td className="p-2 text-center font-mono font-bold text-red-700">14 (3 Critical)</td>
                    <td className="p-2 text-center font-mono">64 / 100</td>
                    <td className="p-2 font-semibold text-cyan-800">Demonstration Mode</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-900">Beltola-Basistha Road</td>
                    <td className="p-2">Beltola Chariali to Basistha Mandir</td>
                    <td className="p-2 text-center font-mono font-bold text-red-700">14 Today</td>
                    <td className="p-2 text-center font-mono">71 / 100</td>
                    <td className="p-2 font-semibold text-emerald-700">Patching Active</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-900">RG Baruah (Zoo) Road</td>
                    <td className="p-2">Chandmari to Ganeshguri</td>
                    <td className="p-2 text-center font-mono font-bold text-red-700">9 Today</td>
                    <td className="p-2 text-center font-mono">75 / 100</td>
                    <td className="p-2 font-semibold text-emerald-700">Routine Maintenance</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. DYNAMIC CORRIDOR REPORT */}
        {selectedReportType === 'corridor' && (
          <div className="space-y-4 text-xs text-slate-800">
            <div className="p-3 bg-slate-100 rounded border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-slate-900">Corridor Identity:</span> {selectedRoadInspection.meta.name} &bull; Passport ID: <strong>{selectedRoadInspection.meta.id}</strong> &bull; Length: {selectedRoadInspection.meta.totalLengthKm} km &bull; Condition: {selectedRoadInspection.meta.averageConditionScore}/100
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-semibold text-slate-600">Select Corridor:</span>
                <select
                  value={selectedRoadId}
                  onChange={(e) => setSelectedRoadId(e.target.value)}
                  className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-semibold text-slate-800"
                >
                  {roads.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.id}: {r.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <table className="w-full text-left text-[11px] border border-slate-300">
              <thead className="bg-slate-100 border-b font-mono">
                <tr>
                  <th className="p-2">Defect ID</th>
                  <th className="p-2">Chainage & Lane</th>
                  <th className="p-2 text-center">Depth</th>
                  <th className="p-2 text-center">Severity</th>
                  <th className="p-2 text-right">Est. Cost (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                {selectedRoadInspection.potholes.map((p) => (
                  <tr key={p.id}>
                    <td className="p-2 font-mono font-bold text-slate-900">{p.id}</td>
                    <td className="p-2">{p.chainage} &bull; {p.lane}</td>
                    <td className="p-2 text-center font-mono text-red-700">-{p.depthMm} mm</td>
                    <td className="p-2 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-100 text-red-800 font-bold">
                        {p.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-2 text-right font-mono font-bold">₹{p.estimatedCostInr.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Signatures & Statutory Footer */}
        <div className="pt-6 border-t-2 border-slate-300 space-y-4 text-xs">
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-500 italic">
            Statutory Disclaimer: "AI findings support, and do not replace, engineering verification. This Situation Report is generated based on sensor telemetry calibrated under Assam PWrD specifications."
          </div>

          <div className="grid grid-cols-2 gap-8 pt-4">
            <div>
              <div className="border-b border-slate-400 w-44 mb-1" />
              <div className="font-bold text-slate-900">Road Safety Cell Telemetry Lead</div>
              <div className="text-[10px] text-slate-500">Autonomous Edge Processing Unit</div>
            </div>
            <div className="text-right flex flex-col items-end">
              <div className="border-b border-slate-400 w-44 mb-1" />
              <div className="font-bold text-slate-900">Chief Engineer (Roads)</div>
              <div className="text-[10px] text-slate-500">Public Works Roads Department, Assam</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
