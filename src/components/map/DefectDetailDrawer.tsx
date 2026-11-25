import React, { useState } from 'react';
import { Defect } from '../../types';
import {
  X,
  MapPin,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  Bot,
  Ruler,
  DollarSign,
  UserCheck,
  CheckCircle,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { SeverityBadge, SourceTrustBadge, DefectTypeBadge, StatusBadge, ReappearedBadge } from '../common/Badge';

interface DefectDetailDrawerProps {
  defect: Defect | null;
  onClose: () => void;
  onVerify: (defectId: string, engineerName: string) => void;
  onViewPassport?: (roadId: string) => void;
}

export const DefectDetailDrawer: React.FC<DefectDetailDrawerProps> = ({
  defect,
  onClose,
  onVerify,
  onViewPassport,
}) => {
  const [engineerName, setEngineerName] = useState('Er. H. Sarma (Executive Engineer, PWD)');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  if (!defect) return null;

  const handleVerifyClick = () => {
    setIsVerifying(true);
    setTimeout(() => {
      onVerify(defect.id, engineerName);
      setIsVerifying(false);
      setVerificationSuccess(true);
      setTimeout(() => setVerificationSuccess(false), 3000);
    }, 400);
  };

  return (
    <div className="absolute top-0 right-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl border-l border-slate-200 z-[1000] flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="px-5 py-4 bg-navy-800 text-white flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-navy-900 text-amber-400 font-semibold border border-navy-700">
              {defect.id}
            </span>
            {defect.reappeared && <ReappearedBadge />}
          </div>
          <h2 className="text-base font-bold text-white mt-1 line-clamp-1">
            {defect.roadName}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-navy-700 transition"
          aria-label="Close panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Photo Placeholder / Inspection Visual */}
        <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
          <div className="relative h-44 bg-slate-800 flex flex-col items-center justify-center p-4 text-center">
            {/* Defect Illustration / Placeholder */}
            <div className="w-full h-full rounded border-2 border-dashed border-slate-600 flex flex-col items-center justify-center p-3 bg-slate-900/40">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-2 text-amber-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
                Computer Vision Camera Capture
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Frame #{defect.id.replace('DEF-', '')} &bull; Sensor Resolution: 4K 60fps
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] bg-red-950/80 text-red-300 border border-red-700/50 px-2 py-0.5 rounded">
                  Bounding Box Confidence: 94.2%
                </span>
              </div>
            </div>

            {/* Status watermark */}
            <div className="absolute top-2 left-2">
              <SourceTrustBadge source={defect.source} size="sm" />
            </div>
            <div className="absolute top-2 right-2">
              <SeverityBadge severity={defect.severity} size="sm" />
            </div>
          </div>
          <div className="p-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>Sensor Unit: GAU-CV-BUS-04</span>
            <span>Recorded: {defect.dateDetected}</span>
          </div>
        </div>

        {/* Verification Success Toast */}
        {verificationSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-md text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Successfully verified defect! Audit record updated in municipal registry.</span>
          </div>
        )}

        {/* Status & Trust Overview */}
        <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Status</span>
            <StatusBadge status={defect.status || defect.lifecycleState} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Classification</span>
            <DefectTypeBadge type={defect.defectType || defect.code} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Data Provenance</span>
            <SourceTrustBadge source={defect.source} />
          </div>
        </div>

        {/* Technical Specifications */}
        <div>
          <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5 text-navy-800" />
            Defect Dimensions & Geo-coordinates
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-white border border-slate-200 rounded">
              <span className="text-slate-400 block text-[11px]">Latitude</span>
              <span className="font-mono font-medium text-slate-800">{defect.coordinates[0].toFixed(5)}° N</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded">
              <span className="text-slate-400 block text-[11px]">Longitude</span>
              <span className="font-mono font-medium text-slate-800">{defect.coordinates[1].toFixed(5)}° E</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded">
              <span className="text-slate-400 block text-[11px]">Estimated Depth</span>
              <span className="font-medium text-slate-800">{defect.depthCm ? `${defect.depthCm} cm` : 'Surface distress'}</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded">
              <span className="text-slate-400 block text-[11px]">Affected Area</span>
              <span className="font-medium text-slate-800">{defect.areaSqM ? `${defect.areaSqM} sq.m` : 'Point anomaly'}</span>
            </div>
          </div>
        </div>

        {/* Preliminary Cost Estimate */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-900 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-amber-700" />
              Estimated Repair Cost
            </span>
            <span className="text-base font-bold text-amber-900 font-mono">
              ₹{(defect.estimatedCost || defect.estimatedRepairCost || 0).toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-amber-700/90 mt-1">
            <strong>Preliminary:</strong> requires engineer review. Derived from Assam PWD Schedule of Rates (SOR 2023-24).
          </p>
        </div>

        {/* Engineer Notes / Verification Section */}
        <div>
          <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-navy-800" />
            Field Verification Details
          </h4>
          {defect.verifiedBy ? (
            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded text-xs space-y-1">
              <div className="font-semibold text-emerald-900 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified by {defect.verifiedBy}
              </div>
              <div className="text-emerald-700 text-[11px]">
                Date: {defect.verificationDate || 'Recent'}
              </div>
              {defect.notes && (
                <div className="text-slate-700 text-xs mt-1 bg-white/70 p-2 rounded border border-emerald-100">
                  "{defect.notes}"
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-3">
              <p className="text-slate-600 text-xs">
                This item is currently flagged by AI computer vision. Engineer on-ground verification is pending.
              </p>

              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Assigning Certifying Engineer:
                </label>
                <input
                  type="text"
                  value={engineerName}
                  onChange={(e) => setEngineerName(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-navy-800"
                />
              </div>

              <button
                onClick={handleVerifyClick}
                disabled={isVerifying}
                className="w-full py-2 px-3 bg-navy-800 hover:bg-navy-900 text-white rounded font-medium text-xs flex items-center justify-center gap-1.5 transition shadow"
              >
                {isVerifying ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Submitting Verification...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-accent" />
                    <span>Verify & Confirm Defect</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* View Road Passport shortcut */}
        {onViewPassport && (
          <button
            onClick={() => onViewPassport(defect.roadId)}
            className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition border border-slate-200"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Open Road Digital Passport ({defect.roadId})</span>
            <ArrowRight className="w-3.5 h-3.5 ml-auto" />
          </button>
        )}
      </div>
    </div>
  );
};
