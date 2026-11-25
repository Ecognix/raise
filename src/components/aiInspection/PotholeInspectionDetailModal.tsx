import React, { useState } from 'react';
import { PotholeDemoRecord } from '../../data/demonstrationRoadData';
import { ThreePotholeViewer } from './ThreePotholeViewer';
import {
  X,
  FileDown,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Maximize2,
  Box,
  Layers,
  Ruler,
  DollarSign,
  Printer,
  Sparkles,
  Info
} from 'lucide-react';

interface PotholeInspectionDetailModalProps {
  pothole: PotholeDemoRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PotholeInspectionDetailModal: React.FC<PotholeInspectionDetailModalProps> = ({
  pothole,
  isOpen,
  onClose
}) => {
  const [showMask, setShowMask] = useState<boolean>(true);
  const [showBbox, setShowBbox] = useState<boolean>(true);
  const [showPdfPreview, setShowPdfPreview] = useState<boolean>(false);

  if (!isOpen || !pothole) return null;

  // Approximate material volume in m3 (e.g., surfaceArea * (depth / 2) to account for parabolic void profile)
  const estimatedVolumeM3 = (pothole.surfaceAreaM2 * (pothole.depthMm / 1000) * 0.55).toFixed(3);
  const estimatedColdMixKg = Math.round(parseFloat(estimatedVolumeM3) * 2300); // ~2300 kg/m3 compacted asphalt

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="bg-[#0A1220] border border-cyan-500/50 rounded-xl shadow-2xl max-w-7xl w-full max-h-[96vh] flex flex-col overflow-hidden text-slate-100">
        {/* Top Control Bar */}
        <div className="px-5 py-3.5 bg-[#070D18] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white tracking-wide">
                  AI 3D Pothole Inspection & Volumetric Analysis
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
                  {pothole.defectId}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Demonstration Mode
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Road: Hirakjyoti Kakati Road &bull; Chainage: {pothole.chainage} &bull; Lane: {pothole.lane}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPdfPreview(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
            >
              <FileDown className="w-4 h-4" />
              <span>Export Inspection Report (PDF)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3-Panel Inspection Layout */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* PANEL 1: LEFT - 2D Optical Photograph & Segmentation (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col space-y-3 bg-[#070D18] p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                2D Optical Telemetry
              </span>
              <span className="text-[10px] font-mono text-slate-500">RGB 4K Sensor</span>
            </div>

            {/* Photo with Overlay Controls */}
            <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-950 aspect-4/3 flex items-center justify-center">
              <img
                src={pothole.photoUrl}
                alt={pothole.id}
                className="w-full h-full object-cover"
              />

              {/* Bounding Box Overlay */}
              {showBbox && (
                <div className="absolute inset-4 border-2 border-dashed border-red-500 bg-red-500/10 rounded pointer-events-none flex flex-col justify-between p-1">
                  <span className="text-[9px] font-mono font-bold bg-red-950/90 text-red-300 px-1 py-0.5 rounded border border-red-600 w-fit">
                    P01: {pothole.confidenceScore}%
                  </span>
                  <span className="text-[9px] font-mono text-cyan-300 bg-slate-900/90 px-1 rounded w-fit self-end">
                    {pothole.lengthCm}&times;{pothole.widthCm}cm
                  </span>
                </div>
              )}

              {/* Polygon Mask overlay */}
              {showMask && (
                <div className="absolute inset-8 rounded-full border-2 border-cyan-400/80 bg-cyan-500/20 pointer-events-none flex items-center justify-center">
                  <span className="text-[9px] font-mono text-cyan-200 bg-slate-950/80 px-1 rounded">
                    Area: {pothole.surfaceAreaM2} m²
                  </span>
                </div>
              )}
            </div>

            {/* Overlay Toggles */}
            <div className="flex items-center justify-between text-xs pt-1">
              <button
                onClick={() => setShowBbox(!showBbox)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium border transition ${
                  showBbox
                    ? 'bg-red-500/20 text-red-300 border-red-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                {showBbox ? 'Hide BBox' : 'Show BBox'}
              </button>

              <button
                onClick={() => setShowMask(!showMask)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium border transition ${
                  showMask
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                {showMask ? 'Hide Mask' : 'Show Mask'}
              </button>
            </div>

            {/* Quick Context Details */}
            <div className="space-y-2 text-xs pt-2 border-t border-slate-800 text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Road ID:</span>
                <span className="font-mono text-cyan-300">RAISE-AS-GHY-2026-008741</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Chainage:</span>
                <span className="font-mono font-bold text-white">{pothole.chainage}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Lane Alignment:</span>
                <span className="text-right text-slate-200">{pothole.lane}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Water Accumulation:</span>
                <span className={pothole.waterFilled ? 'text-cyan-400 font-bold' : 'text-slate-400'}>
                  {pothole.waterFilled ? 'Yes (Saturated)' : 'None (Dry)'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Subgrade Integrity:</span>
                <span className={pothole.soilSubgradeExposed ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                  {pothole.soilSubgradeExposed ? 'Exposed Subgrade' : 'Asphalt Surface Only'}
                </span>
              </div>
            </div>
          </div>

          {/* PANEL 2: CENTRE - Three.js Interactive 3D Depth Mesh (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-2 bg-[#070D18] p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-cyan-400" />
                Interactive 3D Photogrammetric Depth Model
              </span>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">
                Elevation Disparity: -{pothole.depthMm}mm
              </span>
            </div>

            {/* Three.js Canvas Container */}
            <div className="flex-1 min-h-[340px]">
              <ThreePotholeViewer pothole={pothole} className="w-full h-full" />
            </div>

            {/* Dimensional Cross-Section Summary Bar */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
              <div className="p-2 bg-slate-900/80 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Est. Length</div>
                <div className="font-mono text-sm font-bold text-cyan-300">{pothole.lengthCm} cm</div>
              </div>
              <div className="p-2 bg-slate-900/80 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Est. Width</div>
                <div className="font-mono text-sm font-bold text-cyan-300">{pothole.widthCm} cm</div>
              </div>
              <div className="p-2 bg-slate-900/80 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Peak Depth</div>
                <div className="font-mono text-sm font-bold text-rose-400">-{pothole.depthMm} mm</div>
              </div>
            </div>
          </div>

          {/* PANEL 3: RIGHT - AI Assessment, BOQ, Calibration Disclaimer (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col space-y-3 bg-[#070D18] p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-cyan-400" />
                AI Engineering Metrics & BOQ
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-700">
                {pothole.severityLevel}
              </span>
            </div>

            {/* Statutory Calibration Disclaimer Box */}
            <div className="p-2.5 bg-amber-950/20 border border-amber-600/40 rounded-lg text-[11px] text-amber-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="leading-tight">
                <strong className="block text-amber-300 font-semibold mb-0.5">
                  Engineering Calibration Notice:
                </strong>
                Depth & dimensions are estimated from 2D monocular disparity. Physical contractual billing requires calibrated gauge confirmation by a certified Sectional Officer.
              </div>
            </div>

            {/* Physical Metrics Grid */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 bg-slate-900/70 rounded border border-slate-800">
                <span className="text-slate-400">Damaged Surface Area:</span>
                <span className="font-mono font-bold text-white">{pothole.surfaceAreaM2} m²</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-900/70 rounded border border-slate-800">
                <span className="text-slate-400">Estimated Void Volume:</span>
                <span className="font-mono font-bold text-cyan-300">{estimatedVolumeM3} m³</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-900/70 rounded border border-slate-800">
                <span className="text-slate-400">Required Asphalt Fill:</span>
                <span className="font-mono font-bold text-white">~{estimatedColdMixKg} kg mix</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-900/70 rounded border border-slate-800">
                <span className="text-slate-400">AI Confidence:</span>
                <span className="font-mono font-bold text-emerald-400">{pothole.confidenceScore}%</span>
              </div>
            </div>

            {/* Preliminary BOQ Table */}
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 pt-1">
                <span>Preliminary BOQ (Assam SOR 2024-25)</span>
                <span className="text-cyan-400 font-mono">₹{pothole.estimatedCostInr.toLocaleString('en-IN')}</span>
              </div>

              <div className="border border-slate-800 rounded-lg overflow-hidden text-[11px] max-h-36 overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 text-slate-400 font-mono text-[10px]">
                    <tr>
                      <th className="p-1.5">Item</th>
                      <th className="p-1.5 text-right">Qty</th>
                      <th className="p-1.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300 font-mono text-[10px]">
                    {pothole.boqItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="p-1.5 font-sans truncate max-w-[150px]" title={item.description}>
                          <span className="text-cyan-400 font-mono font-semibold mr-1">{item.itemCode}:</span>
                          {item.description}
                        </td>
                        <td className="p-1.5 text-right">{item.quantity} {item.unit}</td>
                        <td className="p-1.5 text-right font-bold text-slate-100">₹{item.amountInr.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recommended Method Summary */}
            <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-xs">
              <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">
                Recommended Maintenance Action:
              </span>
              <p className="text-slate-300 leading-tight text-[11px]">
                {pothole.recommendedMethod}
              </p>
            </div>
          </div>
        </div>

        {/* Printable Official Inspection PDF Report Modal Overlay */}
        {showPdfPreview && (
          <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white text-slate-900 rounded-lg shadow-2xl max-w-3xl w-full p-6 space-y-4 print:p-0 print:m-0 print:shadow-none animate-in zoom-in-95">
              {/* Report Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded border border-slate-400 flex items-center justify-center font-bold text-xs text-slate-700">
                    PWrD
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                      Public Works Roads Department (PWrD), Assam
                    </h2>
                    <p className="text-xs text-slate-600 font-medium">
                      Road Safety Cell &bull; AI Road Infrastructure Inspection Division
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <div className="font-mono font-bold text-slate-900">DOC REF: RAISE-REP-2026-{pothole.id}</div>
                  <div className="text-slate-500">Date: 2026-11-18 &bull; Guwahati</div>
                </div>
              </div>

              {/* Title Strip */}
              <div className="bg-slate-100 p-3 rounded border border-slate-300 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 uppercase">
                    AI Pothole Inspection & Volumetric Assessment Report
                  </span>
                  <div className="text-xs text-slate-600">
                    Road: Hirakjyoti Kakati Road &bull; Chainage: {pothole.chainage} ({pothole.lane})
                  </div>
                </div>
                <span className="px-2 py-1 bg-red-100 border border-red-300 text-red-800 font-bold text-xs rounded">
                  {pothole.severityLevel}
                </span>
              </div>

              {/* Photos & Dimensions */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="border border-slate-300 rounded p-2 space-y-2">
                  <span className="font-bold text-slate-800 block text-[11px] uppercase">Optical Sensor Telemetry</span>
                  <img src={pothole.photoUrl} alt="Inspection" className="w-full h-36 object-cover rounded" />
                  <div className="text-[10px] text-slate-500 font-mono">
                    Vehicle: V-017 &bull; AI Confidence: {pothole.confidenceScore}% &bull; Camera: 4K RGB
                  </div>
                </div>

                <div className="border border-slate-300 rounded p-3 space-y-2">
                  <span className="font-bold text-slate-800 block text-[11px] uppercase">Dimensional Measurements</span>
                  <div className="space-y-1 text-slate-700">
                    <div className="flex justify-between border-b pb-1">
                      <span>Length:</span>
                      <strong className="font-mono">{pothole.lengthCm} cm</strong>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span>Width:</span>
                      <strong className="font-mono">{pothole.widthCm} cm</strong>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span>Peak Cavity Depth:</span>
                      <strong className="font-mono text-red-700">-{pothole.depthMm} mm</strong>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span>Damaged Surface Area:</span>
                      <strong className="font-mono">{pothole.surfaceAreaM2} m²</strong>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span>Est. Fill Volume:</span>
                      <strong className="font-mono">{estimatedVolumeM3} m³ (~{estimatedColdMixKg} kg)</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preliminary BOQ Table in PDF */}
              <div className="border border-slate-300 rounded overflow-hidden text-xs">
                <div className="bg-slate-100 px-3 py-1.5 font-bold text-slate-800 border-b border-slate-300 flex justify-between">
                  <span>Preliminary Bill of Quantities (Assam SOR 2024-25)</span>
                  <span>Estimated Total: ₹{pothole.estimatedCostInr.toLocaleString('en-IN')}</span>
                </div>
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="p-2">Item Code & Specification</th>
                      <th className="p-2 text-right">Qty</th>
                      <th className="p-2 text-right">Rate</th>
                      <th className="p-2 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-700">
                    {pothole.boqItems.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-mono"><strong className="text-slate-900">{item.itemCode}:</strong> {item.description}</td>
                        <td className="p-2 text-right">{item.quantity} {item.unit}</td>
                        <td className="p-2 text-right">₹{item.rateInr}</td>
                        <td className="p-2 text-right font-bold">₹{item.amountInr.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Statutory Note & Signature Blocks */}
              <div className="text-[10px] text-slate-500 border border-slate-200 p-2.5 rounded bg-slate-50 italic">
                Statutory Notice: "AI findings support, and do not replace, engineering verification. This preliminary inspection report is generated automatically for prioritization and triage under PWrD Assam Road Safety guidelines."
              </div>

              <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-300 text-xs text-slate-700">
                <div>
                  <div className="border-b border-slate-400 w-48 mb-1" />
                  <div className="font-bold">Prepared by AI Telemetry Engine</div>
                  <div className="text-[10px] text-slate-500">Autonomous Inference Unit V-017</div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="border-b border-slate-400 w-48 mb-1" />
                  <div className="font-bold">Verified by Assistant Executive Engineer</div>
                  <div className="text-[10px] text-slate-500">Guwahati City Sub-Division I, PWrD Assam</div>
                </div>
              </div>

              {/* Actions in PDF preview */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 print:hidden">
                <button
                  onClick={handlePrintPdf}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save as PDF
                </button>
                <button
                  onClick={() => setShowPdfPreview(false)}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded text-xs"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
