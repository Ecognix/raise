import React, { useState } from 'react';
import { HIRAKJYOTI_POTHOLES, HIRAKJYOTI_CRACKS, PotholeDemoRecord } from '../data/demonstrationRoadData';
import {
  Wrench,
  FileDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  ShieldAlert,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

export const MaintenanceRecommendationPage: React.FC = () => {
  const [selectedPothole, setSelectedPothole] = useState<PotholeDemoRecord>(HIRAKJYOTI_POTHOLES[0]);
  const [rateModifier, setRateModifier] = useState<number>(1.0); // Rate multiplier
  const [approvedDefects, setApprovedDefects] = useState<Record<string, boolean>>({});
  const [showProposalPdf, setShowProposalPdf] = useState<boolean>(false);

  const toggleApproval = (id: string) => {
    setApprovedDefects((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const totalEstimatedCost = HIRAKJYOTI_POTHOLES.reduce(
    (sum, p) => sum + p.estimatedCostInr * rateModifier,
    0
  );

  return (
    <div className="space-y-6 select-none animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-[#0A1220] border border-cyan-500/40 rounded-xl p-5 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-cyan-400" />
              Automated Maintenance Recommendation Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-800">
              Assam PWrD SOR 2024-25
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white tracking-wide">
            AI Maintenance Proposals, Materials & Preliminary BOQ
          </h1>
          <p className="text-xs text-slate-400">
            Intelligent work order generation with material quantification, labor schedules, and engineer verification
          </p>
        </div>

        <button
          onClick={() => setShowProposalPdf(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-xl shadow-emerald-950/40 self-start lg:self-auto shrink-0"
        >
          <FileDown className="w-4 h-4" />
          <span>Generate Maintenance Proposal PDF</span>
        </button>
      </div>

      {/* Main Grid: Left = Pothole Selector & Recommendations; Right = Detailed Defect BOQ & Labor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Recommendations List (5 cols) */}
        <div className="lg:col-span-5 bg-[#0A1220] border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-300">
              Hirakjyoti Kakati Road Detections (14)
            </span>
            <span className="text-[10px] font-mono text-cyan-400">
              Total: ₹{Math.round(totalEstimatedCost).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {HIRAKJYOTI_POTHOLES.map((p) => {
              const isSelected = selectedPothole.id === p.id;
              const isApproved = approvedDefects[p.id];
              const isCritical = p.severity === 'severe';

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPothole(p)}
                  className={`p-3 rounded-lg border cursor-pointer transition text-xs space-y-2 ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 shadow-md'
                      : 'bg-[#070D18] border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">{p.id}</span>
                      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                        {p.chainage}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isCritical
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {p.severity.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 line-clamp-1">{p.recommendedMethod}</p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px]">
                    <span className="font-mono font-bold text-emerald-400">
                      ₹{Math.round(p.estimatedCostInr * rateModifier).toLocaleString('en-IN')}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleApproval(p.id);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition flex items-center gap-1 border ${
                        isApproved
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {isApproved ? 'Engineer Verified' : 'Pending Review'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed BOQ, Materials & Labour for Selected Defect (7 cols) */}
        <div className="lg:col-span-7 bg-[#0A1220] border border-cyan-500/40 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">
                  Work Order Formulation &bull; {selectedPothole.id}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {selectedPothole.chainage} ({selectedPothole.lane})
                </span>
              </div>
              <p className="text-xs text-slate-400">
                PWrD Road Safety Cell &bull; Preliminary Specifications
              </p>
            </div>

            <span className="font-mono text-base font-bold text-emerald-400">
              ₹{Math.round(selectedPothole.estimatedCostInr * rateModifier).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Statutory Note */}
          <div className="p-2.5 bg-amber-950/20 border border-amber-600/40 rounded-lg text-xs text-amber-200 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-tight">
              <strong>Statutory Requirement:</strong> "Engineer verification must be required before recommendations become approved maintenance instructions."
            </p>
          </div>

          {/* Recommended Method Description */}
          <div className="bg-[#070D18] p-3.5 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-cyan-400 block tracking-wider">
              Recommended Method of Repair:
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {selectedPothole.recommendedMethod}
            </p>
          </div>

          {/* Material Quantities & Labor Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Required Materials */}
            <div className="bg-[#070D18] p-3.5 rounded-lg border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Required Material Quantities:
              </span>
              <ul className="space-y-1.5 text-slate-300">
                {selectedPothole.requiredMaterials.map((m, idx) => (
                  <li key={idx} className="flex justify-between items-center py-1 border-b border-slate-800/60">
                    <span>{m.name}</span>
                    <strong className="font-mono text-cyan-300">{m.quantity} {m.unit}</strong>
                  </li>
                ))}
              </ul>
            </div>

            {/* Labour Requirements */}
            <div className="bg-[#070D18] p-3.5 rounded-lg border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Assigned Labour & Plant:
              </span>
              <ul className="space-y-1.5 text-slate-300">
                {selectedPothole.labourRequired.map((l, idx) => (
                  <li key={idx} className="flex items-center gap-2 py-1 border-b border-slate-800/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{l}</span>
                  </li>
                ))}
                <li className="pt-1 text-[11px] text-slate-400">
                  Timeline: <strong className="text-amber-300">Within 48 hours</strong>
                </li>
              </ul>
            </div>
          </div>

          {/* Detailed BOQ Table */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Itemized Bill of Quantities (Assam PWD Schedule of Rates):
            </span>
            <div className="border border-slate-800 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#070D18] text-slate-400 font-mono text-[10px]">
                  <tr>
                    <th className="p-2">Item Code</th>
                    <th className="p-2">Specification</th>
                    <th className="p-2 text-right">Qty</th>
                    <th className="p-2 text-right">Rate (₹)</th>
                    <th className="p-2 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono text-[11px]">
                  {selectedPothole.boqItems.map((b, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-2 text-cyan-400 font-bold">{b.itemCode}</td>
                      <td className="p-2 font-sans">{b.description}</td>
                      <td className="p-2 text-right">{b.quantity} {b.unit}</td>
                      <td className="p-2 text-right">₹{b.rateInr}</td>
                      <td className="p-2 text-right font-bold text-white">
                        ₹{Math.round(b.amountInr * rateModifier).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action verification toggle */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <div className="text-xs text-slate-400">
              Status:{' '}
              <strong className={approvedDefects[selectedPothole.id] ? 'text-emerald-400' : 'text-amber-400'}>
                {approvedDefects[selectedPothole.id] ? 'Engineer Verified & Approved' : 'Awaiting Field Engineer Signature'}
              </strong>
            </div>

            <button
              onClick={() => toggleApproval(selectedPothole.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                approvedDefects[selectedPothole.id]
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {approvedDefects[selectedPothole.id] ? 'Revoke Approval' : 'Approve Recommendation'}
            </button>
          </div>
        </div>
      </div>

      {/* PDF Maintenance Proposal Modal */}
      {showProposalPdf && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-lg shadow-2xl max-w-4xl w-full p-6 space-y-4 print:p-0 print:m-0 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <div>
                <h2 className="text-base font-bold uppercase tracking-wide">
                  Public Works Roads Department (PWrD), Assam
                </h2>
                <p className="text-xs text-slate-600">
                  Preliminary Road Maintenance & Rehabilitation Proposal &bull; Hirakjyoti Kakati Road
                </p>
              </div>
              <div className="text-right text-xs font-mono">
                <div>PROPOSAL REF: PWrD-GHY-2026-PROP-008741</div>
                <div className="text-slate-500">Total Corridor Est: ₹18.4 Lakh</div>
              </div>
            </div>

            <div className="text-xs space-y-2">
              <div className="p-3 bg-slate-100 rounded border border-slate-300">
                <span className="font-bold">Executive Summary:</span> AI surveillance identified 14 potholes and 23 crack formations along Hirakjyoti Kakati Road (By Lane 12, Km 0+000 to 3+400). Siltation along Sarania stream culvert transition has saturated the base course. Immediate milling, geotextile infill, and bituminous concrete overlay is proposed.
              </div>

              <div className="border border-slate-300 rounded overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 font-bold border-b">
                    <tr>
                      <th className="p-2">Defect ID</th>
                      <th className="p-2">Chainage</th>
                      <th className="p-2">Recommended Method</th>
                      <th className="p-2 text-right">Est. Cost (₹)</th>
                      <th className="p-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-700">
                    {HIRAKJYOTI_POTHOLES.map((p) => (
                      <tr key={p.id}>
                        <td className="p-2 font-mono font-bold text-slate-900">{p.id}</td>
                        <td className="p-2 font-mono">{p.chainage}</td>
                        <td className="p-2">{p.recommendedMethod}</td>
                        <td className="p-2 text-right font-mono font-bold">₹{p.estimatedCostInr.toLocaleString('en-IN')}</td>
                        <td className="p-2 text-center">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200">
                            {approvedDefects[p.id] ? 'VERIFIED' : 'PRELIMINARY'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-4 border-t border-slate-300 flex justify-between items-center print:hidden">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  Print Proposal (PDF)
                </button>
                <button
                  onClick={() => setShowProposalPdf(false)}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
