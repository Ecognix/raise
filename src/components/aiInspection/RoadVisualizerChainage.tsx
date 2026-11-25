import React, { useState } from 'react';
import {
  HIRAKJYOTI_ROAD_META,
  HIRAKJYOTI_POTHOLES,
  HIRAKJYOTI_CRACKS,
  PotholeDemoRecord,
  CrackDemoRecord
} from '../../data/demonstrationRoadData';
import { MapPin, AlertCircle, Layers, Eye, Navigation, ShieldAlert, Sparkles } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

interface RoadVisualizerChainageProps {
  meta?: typeof HIRAKJYOTI_ROAD_META;
  potholes?: PotholeDemoRecord[];
  cracks?: CrackDemoRecord[];
  onSelectPothole: (pothole: PotholeDemoRecord) => void;
  onExaminePothole: (pothole: PotholeDemoRecord) => void;
}

export const RoadVisualizerChainage: React.FC<RoadVisualizerChainageProps> = ({
  meta = HIRAKJYOTI_ROAD_META,
  potholes = HIRAKJYOTI_POTHOLES,
  cracks = HIRAKJYOTI_CRACKS,
  onSelectPothole,
  onExaminePothole
}) => {
  const [viewTab, setViewTab] = useState<'schematic' | 'satelliteMap'>('schematic');
  const [filterType, setFilterType] = useState<'all' | 'potholes' | 'cracks' | 'critical'>('all');
  const [selectedItem, setSelectedItem] = useState<{
    type: 'pothole' | 'crack';
    data: PotholeDemoRecord | CrackDemoRecord;
  } | null>(null);

  // Total road length in meters
  const totalLengthM = (meta.totalLengthKm || 3.4) * 1000;

  // Filtered lists
  const filteredPotholes = potholes.filter(p => {
    if (filterType === 'cracks') return false;
    if (filterType === 'critical') return p.severity === 'severe';
    return true;
  });

  const filteredCracks = cracks.filter(c => {
    if (filterType === 'potholes') return false;
    if (filterType === 'critical') return c.severity === 'high';
    return true;
  });

  // Coordinates for Leaflet Map
  const roadCoordinates: [number, number][] = [
    [26.1745, 91.7820],
    [26.1712, 91.7855],
    [26.1678, 91.7892],
    [26.1634, 91.7928],
    [26.1595, 91.7960]
  ];

  const mapCenter: [number, number] = [26.1678, 91.7892];

  // Custom marker icon helper
  const createMarkerIcon = (color: string) =>
    new L.DivIcon({
      html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px ${color}"></div>`,
      className: '',
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

  return (
    <div className="bg-[#0A1220] border border-slate-800 rounded-xl overflow-hidden shadow-xl text-slate-200">
      {/* Visualizer Top Control Bar */}
      <div className="px-5 py-3.5 bg-[#070D18] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white tracking-wide">
                {meta.name} &bull; Full Corridor Visualisation
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                {meta.totalLengthKm.toFixed(3)} km
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive Top-Down Visual Strip with Clickable Defect Markers &bull; {meta.location}
            </p>
          </div>
        </div>

        {/* View Mode & Filter Toggles */}
        <div className="flex items-center gap-2">
          {/* Schematic vs Map Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setViewTab('schematic')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                viewTab === 'schematic'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Road Strip View
            </button>
            <button
              onClick={() => setViewTab('satelliteMap')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                viewTab === 'satelliteMap'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              GIS Map View
            </button>
          </div>

          {/* Defect Filter */}
          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1.5 rounded text-[11px] font-semibold transition ${
                filterType === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({potholes.length + cracks.length})
            </button>
            <button
              onClick={() => setFilterType('potholes')}
              className={`px-2.5 py-1.5 rounded text-[11px] font-semibold transition ${
                filterType === 'potholes' ? 'bg-red-900/60 text-red-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Potholes ({potholes.length})
            </button>
            <button
              onClick={() => setFilterType('cracks')}
              className={`px-2.5 py-1.5 rounded text-[11px] font-semibold transition ${
                filterType === 'cracks' ? 'bg-amber-900/60 text-amber-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cracks ({cracks.length})
            </button>
            <button
              onClick={() => setFilterType('critical')}
              className={`px-2.5 py-1.5 rounded text-[11px] font-semibold transition ${
                filterType === 'critical' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Critical ({meta.criticalDamageLocations || 2})
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <div className="p-5">
        {viewTab === 'schematic' ? (
          <div className="space-y-6">
            {/* Health condition legend */}
            <div className="flex flex-wrap items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-4">
                <span className="text-slate-400 font-semibold text-[11px]">Road Health Zones:</span>
                <span className="flex items-center gap-1.5 text-[11px]">
                  <span className="w-3 h-2 rounded bg-emerald-500" /> Good (Score 80-100)
                </span>
                <span className="flex items-center gap-1.5 text-[11px]">
                  <span className="w-3 h-2 rounded bg-amber-500" /> Moderate (Score 60-79)
                </span>
                <span className="flex items-center gap-1.5 text-[11px]">
                  <span className="w-3 h-2 rounded bg-rose-500" /> Critical / Flood Risk (&lt;60)
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span>Click any marker to inspect</span>
                </span>
              </div>
            </div>

            {/* Segment health colored bar */}
            <div className="space-y-1">
              <div className="h-2 w-full rounded-full flex overflow-hidden">
                <div style={{ width: '15%' }} className="bg-emerald-500" title="Km 0+000 - 0+500: Good Condition (Score 82)" />
                <div style={{ width: '20%' }} className="bg-amber-500" title="Km 0+500 - 1+200: Moderate (Score 68)" />
                <div style={{ width: '22%' }} className="bg-rose-600 animate-pulse" title="Km 1+200 - 1+950: Critical Flood Zone (Score 48)" />
                <div style={{ width: '18%' }} className="bg-amber-500" title="Km 1+950 - 2+550: Moderate Wear (Score 64)" />
                <div style={{ width: '15%' }} className="bg-rose-600" title="Km 2+550 - 3+050: Sarania Stream Subgrade Failure (Score 52)" />
                <div style={{ width: '10%' }} className="bg-emerald-500" title="Km 3+050 - 3+400: Good Condition (Score 85)" />
              </div>
            </div>

            {/* TOP-DOWN SCHEMATIC ROAD STRIP */}
            <div className="relative bg-[#151D2A] border-y-2 border-slate-600 py-6 px-4 rounded shadow-inner overflow-x-auto min-w-[700px]">
              {/* White shoulder lines */}
              <div className="absolute top-2 left-0 right-0 h-0.5 bg-white/70" />
              <div className="absolute bottom-2 left-0 right-0 h-0.5 bg-white/70" />

              {/* Yellow centre dashed dividing line */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 border-t-2 border-dashed border-amber-400/80" />

              {/* Lane labels */}
              <div className="absolute top-3 left-4 text-[9px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Inbound Lane (To Japorigog)
              </div>
              <div className="absolute bottom-3 left-4 text-[9px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Outbound Lane (To Zoo Road)
              </div>

              {/* Chainage Landmarks across road */}
              <div className="relative h-24 flex items-center">
                {(meta.chainageMarkers || []).map((m, idx) => {
                  const mKm = parseFloat(m.chainage.replace('+', '.'));
                  const pct = Math.min(98, Math.max(2, (mKm / (meta.totalLengthKm || 3.4)) * 100));

                  return (
                    <div
                      key={idx}
                      className="absolute -top-4 transform -translate-x-1/2 flex flex-col items-center pointer-events-none"
                      style={{ left: `${pct}%` }}
                    >
                      <div className="h-32 border-l border-slate-700/60 border-dashed" />
                      <span className="text-[10px] font-mono font-bold text-cyan-400 bg-slate-900/90 px-1 rounded -mt-32">
                        {m.chainage}
                      </span>
                      <span className="text-[9px] text-slate-400 whitespace-nowrap mt-1">
                        {m.label}
                      </span>
                    </div>
                  );
                })}

                {/* Plot Potholes as Clickable Pulsing Circles */}
                {filteredPotholes.map((p) => {
                  const pct = Math.min(97, Math.max(3, (p.chainageMeters / totalLengthM) * 100));
                  const isTopLane = p.lane.includes('Left') || p.lane.includes('Inbound');
                  const topPos = isTopLane ? '28%' : p.lane.includes('Centre') ? '48%' : '70%';

                  const sevBg =
                    p.severity === 'severe'
                      ? 'bg-rose-500 ring-rose-400 shadow-[0_0_12px_#f43f5e]'
                      : p.severity === 'high'
                      ? 'bg-amber-500 ring-amber-400 shadow-[0_0_10px_#f59e0b]'
                      : 'bg-yellow-400 ring-yellow-300';

                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedItem({ type: 'pothole', data: p });
                        onSelectPothole(p);
                      }}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${sevBg} ring-2 ring-white cursor-pointer hover:scale-150 transition-transform z-20 group`}
                      style={{ left: `${pct}%`, top: topPos }}
                      title={`Pothole: ${p.id} at ${p.chainage} (Depth: ${p.depthMm}mm)`}
                    >
                      {/* Tooltip on hover */}
                      <div className="hidden group-hover:block absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-cyan-500/80 rounded px-2 py-1 text-[10px] whitespace-nowrap shadow-2xl text-white font-mono z-30 pointer-events-none">
                        <div className="font-bold text-cyan-300">{p.id} &bull; {p.chainage}</div>
                        <div>Depth: {p.depthMm}mm | Area: {p.surfaceAreaM2}m²</div>
                        <div className="text-amber-400 font-sans text-[9px]">Click to Inspect & Examine</div>
                      </div>
                    </button>
                  );
                })}

                {/* Plot Cracks as Fractures / Diamond Badges */}
                {filteredCracks.map((c) => {
                  const kmVal = parseFloat(c.chainage.replace('Km ', '').replace('+', '.'));
                  const pct = Math.min(97, Math.max(3, (kmVal / 3.4) * 100));
                  const sevColor = c.severity === 'high' ? 'bg-red-500' : 'bg-amber-400';

                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedItem({ type: 'crack', data: c })}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rotate-45 ${sevColor} border border-slate-900 cursor-pointer hover:scale-150 transition-transform z-10 group`}
                      style={{ left: `${pct}%`, top: '40%' }}
                      title={`Crack: ${c.id} (${c.type})`}
                    >
                      <div className="hidden group-hover:block absolute bottom-5 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-slate-700 rounded px-2 py-1 text-[10px] whitespace-nowrap shadow-xl text-white font-mono z-30 pointer-events-none">
                        <div className="font-bold text-amber-300">{c.type}</div>
                        <div>Length: {c.lengthM}m &bull; Width: {c.widthMm}mm</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clicked Item Quick Inspection Ribbon */}
            {selectedItem && (
              <div className="p-4 bg-slate-900/90 border border-cyan-500/40 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        {selectedItem.type === 'pothole'
                          ? `Selected Defect: ${(selectedItem.data as PotholeDemoRecord).id}`
                          : `Selected Crack: ${(selectedItem.data as CrackDemoRecord).id}`}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-rose-950 text-rose-300 border border-rose-800">
                        {selectedItem.data.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Location: {selectedItem.data.chainage} &bull;{' '}
                      {selectedItem.type === 'pothole'
                        ? `Depth: ${(selectedItem.data as PotholeDemoRecord).depthMm}mm, Area: ${(selectedItem.data as PotholeDemoRecord).surfaceAreaM2}m²`
                        : `Type: ${(selectedItem.data as CrackDemoRecord).type}, Length: ${(selectedItem.data as CrackDemoRecord).lengthM}m`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {selectedItem.type === 'pothole' && (
                    <button
                      onClick={() => onExaminePothole(selectedItem.data as PotholeDemoRecord)}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 animate-pulse"
                    >
                      <Sparkles className="w-4 h-4" />
                      EXAMINE POTHOLE
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Satellite Leaflet GIS Map View */
          <div className="h-96 rounded-lg overflow-hidden border border-slate-700 relative">
            <MapContainer
              center={mapCenter}
              zoom={15}
              scrollWheelZoom={false}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Hirakjyoti Kakati Road Polyline */}
              <Polyline
                positions={roadCoordinates}
                pathOptions={{ color: '#0284c7', weight: 6, opacity: 0.85 }}
              />

              {/* Pothole Markers on Map */}
              {filteredPotholes.slice(0, 6).map((p, idx) => {
                const markerCoords = roadCoordinates[idx % roadCoordinates.length];
                const markerColor = p.severity === 'severe' ? '#ef4444' : '#f59e0b';

                return (
                  <Marker
                    key={p.id}
                    position={markerCoords}
                    icon={createMarkerIcon(markerColor)}
                    eventHandlers={{
                      click: () => onSelectPothole(p)
                    }}
                  >
                    <Popup>
                      <div className="text-xs space-y-1 p-1">
                        <div className="font-bold text-slate-900">{p.id} &bull; {p.chainage}</div>
                        <div className="text-slate-600">Depth: {p.depthMm}mm | Area: {p.surfaceAreaM2}m²</div>
                        <div className="font-semibold text-rose-700">{p.severityLevel}</div>
                        <button
                          onClick={() => onExaminePothole(p)}
                          className="mt-2 w-full py-1 bg-amber-500 text-slate-950 font-bold rounded text-[11px]"
                        >
                          EXAMINE POTHOLE
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
};
