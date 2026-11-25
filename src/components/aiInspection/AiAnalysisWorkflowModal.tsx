import React, { useEffect, useState } from 'react';
import { PotholeDemoRecord } from '../../data/demonstrationRoadData';
import {
  CheckCircle2,
  Loader2,
  Cpu,
  Scan,
  Maximize,
  Box,
  Ruler,
  FileCheck,
  AlertTriangle,
  X,
  Play
} from 'lucide-react';

interface AiAnalysisWorkflowModalProps {
  pothole: PotholeDemoRecord;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface WorkflowStep {
  stepNumber: number;
  title: string;
  detail: string;
  icon: React.ReactNode;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    stepNumber: 1,
    title: "High-Resolution Image Ingestion",
    detail: "Decoding raw mobile RGB frame & calibrating lens focal length (f=28mm)",
    icon: <Scan className="w-4 h-4" />
  },
  {
    stepNumber: 2,
    title: "Image Preprocessing & Normalization",
    detail: "Contrast CLAHE filtering, shadow mitigation & road plane perspective warp",
    icon: <Cpu className="w-4 h-4" />
  },
  {
    stepNumber: 3,
    title: "Computer Vision Defect Detection",
    detail: "Inference via YOLOv8-RoadDefect-S deep neural network running tensor pass",
    icon: <Maximize className="w-4 h-4" />
  },
  {
    stepNumber: 4,
    title: "Damaged Region Semantic Segmentation",
    detail: "Polygon mask extraction separating asphalt boundary from void core",
    icon: <Box className="w-4 h-4" />
  },
  {
    stepNumber: 5,
    title: "Edge Discontinuity & Boundary Estimation",
    detail: "Sub-pixel Canny edge boundary tracing across wheelpath trajectory",
    icon: <Ruler className="w-4 h-4" />
  },
  {
    stepNumber: 6,
    title: "3D Photogrammetric Depth Mesh Generation",
    detail: "Synthesizing monocular depth disparity gradient and 16x16 elevation matrix",
    icon: <Box className="w-4 h-4" />
  },
  {
    stepNumber: 7,
    title: "Physical Dimension Metric Calculation",
    detail: "Computing length, width, and crater depth from ground plane projection",
    icon: <Ruler className="w-4 h-4" />
  },
  {
    stepNumber: 8,
    title: "Damaged Surface Area & Volume Integral",
    detail: "Numerical surface integration: computing volume of bituminous infill required",
    icon: <FileCheck className="w-4 h-4" />
  },
  {
    stepNumber: 9,
    title: "Assam PWrD Severity Classification",
    detail: "IRC:82-2015 standards classification: P01 Critical Level 4 (Severe)",
    icon: <AlertTriangle className="w-4 h-4" />
  },
  {
    stepNumber: 10,
    title: "AI Engineering Inspection Report Synthesis",
    detail: "Generating preliminary BOQ schedule of rates, repair proposal & PDF draft",
    icon: <FileCheck className="w-4 h-4 text-emerald-400" />
  }
];

export const AiAnalysisWorkflowModal: React.FC<AiAnalysisWorkflowModalProps> = ({
  pothole,
  isOpen,
  onClose,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setIsFinished(false);
      return;
    }

    // Step through the 10 stages
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= 10) {
          clearInterval(timer);
          setIsFinished(true);
          return 10;
        }
        return prev + 1;
      });
    }, 450); // fast, responsive feel ~4.5s total

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const progressPercent = Math.round((currentStep / 10) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="bg-[#0A1220] border border-cyan-500/40 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden text-slate-100 flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-[#070D18] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white tracking-wide">
                  RAISE Neural Vision Engine &bull; Automated 10-Step Pipeline
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
                  CV v3.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Target: {pothole.defectId} &bull; {pothole.chainage} ({pothole.lane})
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

        {/* Live Processing Preview Panel */}
        <div className="p-5 space-y-4">
          <div className="relative rounded-lg overflow-hidden border border-slate-700/80 bg-slate-950 h-52 flex items-center justify-center">
            {/* Background Pothole Image */}
            <img
              src={pothole.photoUrl}
              alt="Pothole under analysis"
              className="w-full h-full object-cover opacity-85"
            />

            {/* Futuristic Scanning Beam Animation */}
            {!isFinished && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-pulse"
                     style={{
                       position: 'absolute',
                       top: `${(currentStep * 9.5)}%`,
                       transition: 'top 0.4s ease-in-out'
                     }}
                />
                <div className="absolute inset-0 bg-cyan-950/20 backdrop-saturate-150" />
              </div>
            )}

            {/* Bounding Box Overlay appearing in step 3+ */}
            {currentStep >= 3 && (
              <div className="absolute inset-x-24 inset-y-10 border-2 border-dashed border-red-500/90 bg-red-500/10 rounded flex flex-col justify-between p-1.5 pointer-events-none transition-all">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold bg-red-950/80 text-red-300 px-1.5 py-0.5 rounded border border-red-600/60 w-fit">
                  <span>P01 POTHOLE: {(pothole.confidenceScore).toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between text-[9px] font-mono text-cyan-300 bg-slate-900/80 px-1 py-0.5 rounded w-fit self-end">
                  <span>W:{pothole.widthCm}cm &times; L:{pothole.lengthCm}cm</span>
                </div>
              </div>
            )}

            {/* 3D Wireframe Mesh Silhouette in step 6+ */}
            {currentStep >= 6 && (
              <div className="absolute inset-x-28 inset-y-12 border border-cyan-400/60 rounded-full flex items-center justify-center pointer-events-none">
                <span className="text-[10px] font-mono text-cyan-300 bg-[#0A1220]/90 px-2 py-0.5 rounded border border-cyan-500/40">
                  Depth Profile: -{pothole.depthMm}mm (Disparity Mesh Ready)
                </span>
              </div>
            )}

            {/* Real-time Telemetry Overlay Stamp */}
            <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur px-2 py-1 rounded text-[10px] font-mono text-slate-300 border border-slate-700/60 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>FPS: 58.2 &bull; Tensor RT 8.6 &bull; {progressPercent}%</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Pipeline Progress</span>
              <span className="font-mono text-cyan-400 font-bold">{progressPercent}% Completed</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Steps List (Active, Completed, Pending) */}
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
            {WORKFLOW_STEPS.map((step) => {
              const isDone = currentStep > step.stepNumber || isFinished;
              const isCurrent = currentStep === step.stepNumber && !isFinished;

              return (
                <div
                  key={step.stepNumber}
                  className={`p-2 rounded border flex items-center justify-between transition-all ${
                    isDone
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                      : isCurrent
                      ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200 shadow-sm'
                      : 'bg-slate-900/40 border-slate-800/60 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-500">
                          {step.stepNumber}
                        </span>
                      )}
                    </span>
                    <div>
                      <div className="font-semibold text-xs leading-tight">
                        {step.stepNumber}. {step.title}
                      </div>
                      <div className="text-[10px] opacity-80 leading-normal">
                        {step.detail}
                      </div>
                    </div>
                  </div>

                  {isDone && (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">
                      PASS
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-[10px] font-mono text-cyan-400 font-bold shrink-0 animate-pulse">
                      PROCESSING
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-[#070D18] border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Preliminary AI finding &bull; Engineering verification required</span>
          </div>

          <div className="flex items-center gap-2">
            {!isFinished ? (
              <button
                onClick={() => {
                  setCurrentStep(10);
                  setIsFinished(true);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium transition"
              >
                Fast-Forward
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onComplete();
                }}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded font-bold transition flex items-center gap-2 shadow-lg shadow-cyan-900/40 animate-pulse"
              >
                <Box className="w-4 h-4" />
                Launch 3D Analysis & Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
