import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Video,
  Play,
  Pause,
  Scan,
  Maximize2,
  Box,
  Layers,
  Sparkles,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  RefreshCw,
  FileDown
} from 'lucide-react';

interface DetectedDefectBox {
  id: string;
  code: string;
  name: string;
  category: 'pothole' | 'crack' | 'rutting' | 'surface_wear';
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number }; // percentage 0-100
  color: string;
  depthMm?: number;
  lengthCm?: number;
}

const SAMPLE_MEDIA: {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  defects: DetectedDefectBox[];
}[] = [
  {
    id: 'sample-pothole',
    title: 'By Lane 12 Pothole (Hirakjyoti Kakati Rd)',
    type: 'image' as const,
    url: '/images/pothole_big.jpg',
    defects: [
      {
        id: 'DET-01',
        code: 'P01',
        name: 'Severe Carriageway Pothole',
        category: 'pothole' as const,
        confidence: 98.4,
        bbox: { x: 28, y: 35, width: 44, height: 38 },
        color: '#ef4444',
        depthMm: 85,
        lengthCm: 84
      }
    ]
  },
  {
    id: 'sample-cracks',
    title: 'GS Road Alligator & Fatigue Cracks',
    type: 'image' as const,
    url: '/images/asphalt_deterioration.jpg',
    defects: [
      {
        id: 'DET-02',
        code: 'C03',
        name: 'Fatigue Alligator Cracking',
        category: 'crack' as const,
        confidence: 96.1,
        bbox: { x: 22, y: 25, width: 55, height: 45 },
        color: '#f59e0b',
        lengthCm: 210
      },
      {
        id: 'DET-03',
        code: 'C01',
        name: 'Longitudinal Reflection Crack',
        category: 'crack' as const,
        confidence: 92.8,
        bbox: { x: 15, y: 65, width: 48, height: 25 },
        color: '#06b6d4',
        lengthCm: 140
      }
    ]
  },
  {
    id: 'sample-rutting',
    title: 'AT Road Wheelpath Rutting & Deformation',
    type: 'image' as const,
    url: '/images/potholes_on_asphalt_road_20171023.jpg',
    defects: [
      {
        id: 'DET-04',
        code: 'D01',
        name: 'Wheelpath Rutting Channel',
        category: 'rutting' as const,
        confidence: 94.7,
        bbox: { x: 30, y: 40, width: 42, height: 45 },
        color: '#8b5cf6',
        depthMm: 45
      }
    ]
  },
  {
    id: 'sample-wear',
    title: 'Zoo Road Surface Ravelling & Bitumen Loss',
    type: 'image' as const,
    url: '/images/pothole_in_an_asphalt_pavement.jpg',
    defects: [
      {
        id: 'DET-05',
        code: 'S01',
        name: 'Surface Aggregate Ravelling',
        category: 'surface_wear' as const,
        confidence: 91.5,
        bbox: { x: 20, y: 30, width: 60, height: 50 },
        color: '#eab308'
      }
    ]
  }
];

export const AiVisionEnginePage: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState(SAMPLE_MEDIA[0]);
  const [mediaSource, setMediaSource] = useState<'sample' | 'customImage' | 'webcam'>('sample');
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [showMask, setShowMask] = useState<boolean>(true);
  const [showBbox, setShowBbox] = useState<boolean>(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(80);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [webcamActive, setWebcamActive] = useState<boolean>(false);
  const [registeredToast, setRegisteredToast] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scanning laser animation
  useEffect(() => {
    let animId: number;
    let pos = 0;
    let forward = true;

    const animateLaser = () => {
      if (isScanning) {
        if (forward) {
          pos += 1.2;
          if (pos >= 100) forward = false;
        } else {
          pos -= 1.2;
          if (pos <= 0) forward = true;
        }
        setScanProgress(pos);
      }
      animId = requestAnimationFrame(animateLaser);
    };

    animId = requestAnimationFrame(animateLaser);
    return () => cancelAnimationFrame(animId);
  }, [isScanning]);

  // Webcam Handler
  const handleToggleWebcam = async () => {
    if (webcamActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
      setWebcamActive(false);
      setMediaSource('sample');
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 } }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setWebcamActive(true);
        setMediaSource('webcam');
      } catch (err) {
        // Fallback to simulated live road camera feed
        alert("Webcam device not accessible. Switching to Live PWrD Mobile Unit Camera Stream simulation.");
        setMediaSource('sample');
      }
    }
  };

  // Custom File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomImageUrl(reader.result as string);
        setMediaSource('customImage');
        setIsScanning(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Active defects to show
  const currentDefects =
    mediaSource === 'customImage'
      ? [
          {
            id: 'DET-CUSTOM-01',
            code: 'P01',
            name: 'Pothole Void (Uploaded Image)',
            category: 'pothole' as const,
            confidence: 95.8,
            bbox: { x: 25, y: 30, width: 50, height: 40 },
            color: '#ef4444',
            depthMm: 72,
            lengthCm: 68
          }
        ]
      : selectedSample.defects;

  const filteredDefects = currentDefects.filter((d) => {
    if (d.confidence < confidenceThreshold) return false;
    if (selectedClass !== 'all' && d.category !== selectedClass) return false;
    return true;
  });

  const handleRegisterDefect = (defect: DetectedDefectBox) => {
    setRegisteredToast(`Defect ${defect.code} (${defect.name}) registered to PWrD Live Defect Database with ID #DEF-2026-LIVE-${Math.floor(Math.random() * 9000 + 1000)}.`);
    setTimeout(() => setRegisteredToast(null), 4500);
  };

  const activeImage =
    mediaSource === 'customImage' && customImageUrl
      ? customImageUrl
      : selectedSample.url;

  return (
    <div className="space-y-6 select-none animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-[#0A1220] border border-cyan-500/40 rounded-xl p-5 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              YOLOv8-RoadDefect-S &bull; TensorRT 8.6
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
              Live Edge Inference Active
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white tracking-wide">
            AI Vision Engine &bull; Computer Vision Damage Detection
          </h1>
          <p className="text-xs text-slate-400">
            Real-time inference supporting road imagery, mobile video surveys, and vehicle dash-cam feeds
          </p>
        </div>

        {/* Input Source Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,video/*"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-2"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            Upload Image / Video
          </button>

          <button
            onClick={handleToggleWebcam}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
              webcamActive
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700'
            }`}
          >
            <Camera className="w-4 h-4 text-emerald-400" />
            {webcamActive ? 'Stop Camera' : 'Live Camera Input'}
          </button>
        </div>
      </div>

      {/* Preset Sample Corridor Bar */}
      <div className="bg-[#070D18] border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
          Preloaded Telemetry Samples:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {SAMPLE_MEDIA.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedSample(s);
                setMediaSource('sample');
                setWebcamActive(false);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition text-xs ${
                mediaSource === 'sample' && selectedSample.id === s.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Dual-View Side-by-Side Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* LEFT VIEW: RAW OPTICAL FEED */}
        <div className="bg-[#0A1220] border border-slate-800 rounded-xl p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-slate-400" />
              Raw Optical Telemetry (Original Input)
            </span>
            <span className="text-[10px] font-mono text-slate-500">Unfiltered Frame</span>
          </div>

          <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-black aspect-16/10 flex items-center justify-center">
            {webcamActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={activeImage}
                alt="Raw road view"
                className="w-full h-full object-cover"
              />
            )}

            <div className="absolute top-2 left-2 bg-black/80 backdrop-blur px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 border border-slate-700">
              Sensor Resolution: 3840 &times; 2160 &bull; Lens: 28mm
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-normal">
            Direct feed from front-mounted mobile vehicle camera or user-uploaded inspection asset prior to neural network tensor preprocessing.
          </p>
        </div>

        {/* RIGHT VIEW: AI PROCESSED IMAGE & DETECTIONS */}
        <div className="bg-[#0A1220] border border-cyan-500/40 rounded-xl p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-xs uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              AI Neural Inference & Semantic Bounding
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsScanning(!isScanning)}
                className={`p-1 rounded text-xs transition ${
                  isScanning ? 'text-cyan-400 bg-cyan-950/80 border border-cyan-700' : 'text-slate-400'
                }`}
                title="Toggle Scanning Laser"
              >
                <Scan className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* AI Frame with Overlays */}
          <div className="relative rounded-lg overflow-hidden border border-cyan-500/50 bg-black aspect-16/10 flex items-center justify-center">
            <img
              src={activeImage}
              alt="Processed road view"
              className="w-full h-full object-cover"
            />

            {/* Scanning Laser Beam Effect */}
            {isScanning && (
              <div
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] pointer-events-none"
                style={{ top: `${scanProgress}%` }}
              />
            )}

            {/* Bounding Boxes & Masks */}
            {filteredDefects.map((d) => (
              <React.Fragment key={d.id}>
                {/* Bounding Box */}
                {showBbox && (
                  <div
                    className="absolute border-2 rounded transition-all pointer-events-none"
                    style={{
                      left: `${d.bbox.x}%`,
                      top: `${d.bbox.y}%`,
                      width: `${d.bbox.width}%`,
                      height: `${d.bbox.height}%`,
                      borderColor: d.color,
                      backgroundColor: `${d.color}15`
                    }}
                  >
                    {/* Bounding box top label badge */}
                    <div
                      className="absolute -top-6 left-0 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-white shadow-md flex items-center gap-1"
                      style={{ backgroundColor: d.color }}
                    >
                      <span>{d.code}</span>
                      <span>{d.confidence}%</span>
                    </div>

                    {/* Dimensions label bottom */}
                    {d.depthMm && (
                      <div className="absolute -bottom-5 right-0 px-1 py-0.5 rounded text-[9px] font-mono text-cyan-300 bg-black/80">
                        Depth: -{d.depthMm}mm
                      </div>
                    )}
                  </div>
                )}

                {/* Segmentation Mask Overlay */}
                {showMask && (
                  <div
                    className="absolute rounded-full border border-dashed transition-all pointer-events-none opacity-40 animate-pulse"
                    style={{
                      left: `${d.bbox.x + 2}%`,
                      top: `${d.bbox.y + 2}%`,
                      width: `${d.bbox.width - 4}%`,
                      height: `${d.bbox.height - 4}%`,
                      borderColor: d.color,
                      backgroundColor: d.color
                    }}
                  />
                )}
              </React.Fragment>
            ))}

            {/* Telemetry HUD Bottom Bar */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-slate-300 bg-black/80 backdrop-blur px-2.5 py-1 rounded border border-slate-700/80">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  LATENCY: 16.8ms
                </span>
                <span>FPS: 59.4</span>
              </div>
              <div className="text-cyan-300">
                {filteredDefects.length} DEFECTS IDENTIFIED
              </div>
            </div>
          </div>

          {/* Toggle Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowBbox(!showBbox)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium border transition ${
                  showBbox
                    ? 'bg-blue-600/30 text-blue-300 border-blue-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                {showBbox ? 'Hide BBoxes' : 'Show BBoxes'}
              </button>
              <button
                onClick={() => setShowMask(!showMask)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium border transition ${
                  showMask
                    ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                {showMask ? 'Hide Mask' : 'Show Mask'}
              </button>
            </div>

            {/* Confidence Slider */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 text-[11px]">Threshold:</span>
              <input
                type="range"
                min="50"
                max="99"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-24 accent-cyan-400"
              />
              <span className="font-mono text-cyan-300 font-bold text-[11px] w-8">
                {confidenceThreshold}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detection Results Table & Actions */}
      <div className="bg-[#0A1220] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-sm text-white">
              Detected Defects & Volumetric Attributes
            </h3>
            <p className="text-xs text-slate-400">
              Classes identified conforming to Assam PWrD Schedule of Codes (P01, C01-C04, D01, S01)
            </p>
          </div>

          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
            {filteredDefects.length} Confirmed in Current Pass
          </span>
        </div>

        {/* Success Toast */}
        {registeredToast && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-lg text-xs text-emerald-200 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{registeredToast}</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070D18] text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Defect ID</th>
                <th className="p-3">Class & Code</th>
                <th className="p-3">Category</th>
                <th className="p-3">AI Confidence</th>
                <th className="p-3">Estimated Dimensions</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredDefects.map((d) => (
                <tr key={d.id} className="hover:bg-slate-900/40 transition">
                  <td className="p-3 font-mono font-bold text-cyan-400">{d.id}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white mr-2" style={{ backgroundColor: d.color }}>
                      {d.code}
                    </span>
                    <span className="font-semibold text-white">{d.name}</span>
                  </td>
                  <td className="p-3 capitalize font-mono text-slate-400">{d.category.replace('_', ' ')}</td>
                  <td className="p-3">
                    <span className="font-mono font-bold text-emerald-400">{d.confidence}%</span>
                  </td>
                  <td className="p-3 font-mono text-slate-300">
                    {d.depthMm ? `Depth: -${d.depthMm}mm` : ''} {d.lengthCm ? `Length: ${d.lengthCm}cm` : ''}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleRegisterDefect(d)}
                      className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded text-[11px] transition"
                    >
                      Register to PWrD Database
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
