import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Tooltip, Polygon } from 'react-leaflet';
import L from 'leaflet';
import { RoadSegment, Defect, DrainCulvert, Severity, DefectType, DefectStatus, RoadCategory } from '../../types';
import { DefectDetailDrawer } from './DefectDetailDrawer';
import {
  Filter,
  Layers,
  MapPin,
  Eye,
  RotateCcw,
  AlertTriangle,
  Info,
  Droplet,
  Compass
} from 'lucide-react';

interface LeafletRoadMapProps {
  roads: RoadSegment[];
  defects: Defect[];
  drains: DrainCulvert[];
  onVerifyDefect: (defectId: string, engineerName: string) => void;
  onSelectRoad?: (roadId: string) => void;
  heightClass?: string;
}

// Known Guwahati Flood-Risk Zones with polygon coordinates
const floodRiskPolygons: { name: string; description: string; coords: [number, number][] }[] = [
  {
    name: "Bharalu River Basin & Anil Nagar / Nabin Nagar",
    description: "Primary municipal drainage corridor; prone to river backflow during peak Brahmaputra surge.",
    coords: [
      [26.172, 91.735],
      [26.182, 91.752],
      [26.175, 91.768],
      [26.162, 91.752]
    ]
  },
  {
    name: "Deepor Beel Wetland Catchment",
    description: "Ramsar wetland buffer zone; water overflow submerges Pamohi and Gorchuk link roads.",
    coords: [
      [26.135, 91.642],
      [26.128, 91.678],
      [26.112, 91.672],
      [26.110, 91.636]
    ]
  },
  {
    name: "Rukminigaon & Downtown Basin",
    description: "Depression along GS Road; heavy flash flood accumulation from Meghalaya foothill runoff.",
    coords: [
      [26.145, 91.791],
      [26.149, 91.808],
      [26.133, 91.812],
      [26.129, 91.794]
    ]
  },
  {
    name: "Pandu & Maligaon Lowland Zone",
    description: "Railway colony low-lying basin adjacent to Brahmaputra river plain.",
    coords: [
      [26.174, 91.691],
      [26.179, 91.706],
      [26.165, 91.710],
      [26.159, 91.693]
    ]
  }
];

export const LeafletRoadMap: React.FC<LeafletRoadMapProps> = ({
  roads,
  defects,
  drains,
  onVerifyDefect,
  onSelectRoad,
  heightClass = "h-[calc(100vh-140px)]"
}) => {
  // Selected defect for drawer
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null);

  // Layer toggles
  const [layerDefects, setLayerDefects] = useState<boolean>(true);
  const [layerRoads, setLayerRoads] = useState<boolean>(true);
  const [layerFloodZones, setLayerFloodZones] = useState<boolean>(true);
  const [layerDrains, setLayerDrains] = useState<boolean>(true);

  // Filters
  const [filterType, setFilterType] = useState<DefectType | 'ALL'>('ALL');
  const [filterSeverity, setFilterSeverity] = useState<Severity | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<DefectStatus | 'ALL'>('ALL');
  const [filterCategory, setFilterCategory] = useState<RoadCategory | 'ALL'>('ALL');

  // Filtered defects
  const filteredDefects = useMemo(() => {
    return defects.filter(d => {
      if (filterType !== 'ALL' && d.defectType !== filterType) return false;
      if (filterSeverity !== 'ALL' && d.severity !== filterSeverity) return false;
      if (filterStatus !== 'ALL' && d.status !== filterStatus) return false;
      return true;
    });
  }, [defects, filterType, filterSeverity, filterStatus]);

  // Filtered roads
  const filteredRoads = useMemo(() => {
    return roads.filter(r => {
      if (filterCategory !== 'ALL' && r.category !== filterCategory) return false;
      return true;
    });
  }, [roads, filterCategory]);

  // Reset filters
  const resetFilters = () => {
    setFilterType('ALL');
    setFilterSeverity('ALL');
    setFilterStatus('ALL');
    setFilterCategory('ALL');
  };

  const hasActiveFilters =
    filterType !== 'ALL' ||
    filterSeverity !== 'ALL' ||
    filterStatus !== 'ALL' ||
    filterCategory !== 'ALL';

  // Custom marker creators
  const createDefectMarkerIcon = (severity: Severity) => {
    return L.divIcon({
      className: 'custom-defect-marker',
      html: `<div class="marker-pin ${severity}"><div class="marker-pin-inner"></div></div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 26],
      popupAnchor: [0, -26]
    });
  };

  const createDrainMarkerIcon = (condition: string) => {
    return L.divIcon({
      className: 'custom-defect-marker',
      html: `<div class="marker-drain ${condition}">💧</div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      popupAnchor: [0, -11]
    });
  };

  // Color mapper for road severity
  const getRoadColor = (score: number) => {
    if (score >= 70) return '#16A34A'; // Good - green
    if (score >= 50) return '#D97706'; // Moderate - amber
    return '#DC2626'; // Severe - red
  };

  return (
    <div className={`relative w-full ${heightClass} bg-slate-100 overflow-hidden flex flex-col`}>
      {/* Top Filter and Controls Bar */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 py-2.5 z-20 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 font-semibold text-slate-700 mr-1">
            <Filter className="w-3.5 h-3.5 text-navy-800" />
            <span>Filters:</span>
          </div>

          {/* Defect Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-2.5 py-1.5 rounded border border-slate-300 bg-white text-slate-700 font-medium focus:ring-1 focus:ring-navy-800 focus:outline-none"
          >
            <option value="ALL">All Defect Types</option>
            <option value="pothole">Potholes</option>
            <option value="crack">Cracks</option>
            <option value="surface_wear">Surface Wear</option>
            <option value="drain_blockage">Drain Blockages</option>
          </select>

          {/* Severity Filter */}
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as any)}
            className="px-2.5 py-1.5 rounded border border-slate-300 bg-white text-slate-700 font-medium focus:ring-1 focus:ring-navy-800 focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="severe">Severe (Red)</option>
            <option value="moderate">Moderate (Amber)</option>
            <option value="good">Good (Green)</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-2.5 py-1.5 rounded border border-slate-300 bg-white text-slate-700 font-medium focus:ring-1 focus:ring-navy-800 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="AI-detected">AI-detected</option>
            <option value="Field-verified">Field-verified</option>
            <option value="Assigned">Assigned</option>
            <option value="Repaired">Repaired</option>
            <option value="Verified after repair">Verified after repair</option>
          </select>

          {/* Road Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="px-2.5 py-1.5 rounded border border-slate-300 bg-white text-slate-700 font-medium focus:ring-1 focus:ring-navy-800 focus:outline-none"
          >
            <option value="ALL">All Road Categories</option>
            <option value="Urban Arterial">Urban Arterial</option>
            <option value="State Highway">State Highway</option>
            <option value="Major District Road">Major District Road</option>
            <option value="Feeder Road">Feeder Road</option>
            <option value="Rural Link">Rural Link</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 px-2 py-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>

        {/* Right: Layer Toggles */}
        <div className="flex items-center gap-3 bg-slate-50 px-3 py-1 rounded border border-slate-200">
          <div className="flex items-center gap-1 font-semibold text-slate-700">
            <Layers className="w-3.5 h-3.5 text-navy-800" />
            <span>Layers:</span>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 select-none">
            <input
              type="checkbox"
              checked={layerDefects}
              onChange={(e) => setLayerDefects(e.target.checked)}
              className="rounded text-navy-800 focus:ring-0"
            />
            <span>Defects ({filteredDefects.length})</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 select-none">
            <input
              type="checkbox"
              checked={layerRoads}
              onChange={(e) => setLayerRoads(e.target.checked)}
              className="rounded text-navy-800 focus:ring-0"
            />
            <span>Roads ({filteredRoads.length})</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 select-none">
            <input
              type="checkbox"
              checked={layerFloodZones}
              onChange={(e) => setLayerFloodZones(e.target.checked)}
              className="rounded text-navy-800 focus:ring-0"
            />
            <span>Flood Zones</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 select-none">
            <input
              type="checkbox"
              checked={layerDrains}
              onChange={(e) => setLayerDrains(e.target.checked)}
              className="rounded text-navy-800 focus:ring-0"
            />
            <span>Drains ({drains.length})</span>
          </label>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="flex-1 relative">
        <MapContainer
          center={[26.155, 91.750]} // Central Guwahati coordinates
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          {/* OpenStreetMap Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 1. Road Segments Polylines Layer */}
          {layerRoads &&
            filteredRoads.map(road => {
              const color = getRoadColor(road.conditionScore);
              return (
                <Polyline
                  key={road.id}
                  positions={road.coordinates}
                  pathOptions={{
                    color: color,
                    weight: 6,
                    opacity: 0.85,
                    lineCap: 'round',
                    lineJoin: 'round',
                  }}
                  eventHandlers={{
                    click: () => {
                      if (onSelectRoad) onSelectRoad(road.id);
                    },
                  }}
                >
                  <Tooltip sticky>
                    <div className="p-1 text-xs">
                      <div className="font-bold text-slate-900">{road.name}</div>
                      <div className="text-[11px] text-slate-500">{road.category} &bull; {road.lengthKm} km</div>
                      <div className="mt-1 flex items-center justify-between gap-3">
                        <span>Condition Score:</span>
                        <span className="font-mono font-bold" style={{ color }}>{road.conditionScore}/100</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Click to view Digital Passport</div>
                    </div>
                  </Tooltip>
                </Polyline>
              );
            })}

          {/* 2. Flood-Risk Zones Polygons Layer */}
          {layerFloodZones &&
            floodRiskPolygons.map((zone, idx) => (
              <Polygon
                key={idx}
                positions={zone.coords}
                pathOptions={{
                  fillColor: '#3B82F6',
                  fillOpacity: 0.22,
                  color: '#2563EB',
                  weight: 2,
                  dashArray: '4, 6',
                }}
              >
                <Tooltip sticky>
                  <div className="p-1 text-xs max-w-xs">
                    <div className="font-bold text-blue-900 flex items-center gap-1">
                      <Droplet className="w-3.5 h-3.5 text-blue-600" />
                      {zone.name}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">{zone.description}</p>
                    <span className="inline-block mt-1 text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-semibold">
                      High Inundation Susceptibility
                    </span>
                  </div>
                </Tooltip>
              </Polygon>
            ))}

          {/* 3. Drains and Culverts Markers Layer */}
          {layerDrains &&
            drains.map(drain => (
              <Marker
                key={drain.id}
                position={drain.coordinates}
                icon={createDrainMarkerIcon(drain.condition)}
              >
                <Popup>
                  <div className="p-1 text-xs min-w-[200px]">
                    <div className="font-bold text-slate-900">{drain.name}</div>
                    <div className="text-[11px] text-slate-500">{drain.locationArea}</div>
                    <div className="mt-2 space-y-1 text-slate-700">
                      <div>Type: <strong className="font-medium">{drain.structuralType}</strong></div>
                      <div>Condition: <strong className="font-medium uppercase">{drain.condition.replace('_', ' ')}</strong></div>
                      <div>Silting: <strong className="font-medium text-amber-700">{drain.siltingPercentage}%</strong></div>
                      <div>Connected to: <strong className="font-medium">{drain.connectedWaterBody}</strong></div>
                    </div>
                    {drain.recurringWaterlogging && (
                      <div className="mt-2 text-[10px] bg-red-50 text-red-700 p-1 rounded font-semibold border border-red-200">
                        Recurring Waterlogging Flagged
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}

          {/* 4. Defect Markers Layer */}
          {layerDefects &&
            filteredDefects.map(defect => (
              <Marker
                key={defect.id}
                position={defect.coordinates}
                icon={createDefectMarkerIcon(defect.severity)}
                eventHandlers={{
                  click: () => {
                    setSelectedDefect(defect);
                  },
                }}
              >
                <Tooltip direction="top" offset={[0, -26]}>
                  <div className="p-1 text-xs">
                    <div className="font-bold text-slate-900">{defect.roadName}</div>
                    <div className="text-[11px] text-slate-600 capitalize">
                      {(defect.defectType || defect.name || defect.code).replace('_', ' ')} &bull; {defect.severity}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Click to open verify panel</div>
                  </div>
                </Tooltip>
              </Marker>
            ))}
        </MapContainer>

        {/* Legend Overlay at Bottom-Left */}
        <div className="absolute bottom-5 left-5 z-[500] bg-white/95 backdrop-blur-sm p-3 rounded-lg border border-slate-200 shadow-md text-xs space-y-2 pointer-events-auto">
          <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-navy-800" />
            Map Legend & Severity
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 inline-block border border-white shadow-xs"></span>
              <span>Severe Defect / Critical Road (&lt;50)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block border border-white shadow-xs"></span>
              <span>Moderate Defect / Watchlist Road (50-70)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block border border-white shadow-xs"></span>
              <span>Good Condition Road / Minor (&gt;70)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-500/40 border border-blue-600 inline-block"></span>
              <span>Flood Inundation Vulnerability Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-600 inline-block text-[8px] text-white text-center leading-3">💧</span>
              <span>Drain / Culvert Infrastructure</span>
            </div>
          </div>
        </div>

        {/* Side Panel Drawer when Defect is clicked */}
        {selectedDefect && (
          <DefectDetailDrawer
            defect={selectedDefect}
            onClose={() => setSelectedDefect(null)}
            onVerify={(defectId, engineerName) => {
              onVerifyDefect(defectId, engineerName);
              // Also update local selected defect state
              setSelectedDefect(prev => prev ? {
                ...prev,
                source: 'Field-verified',
                status: prev.status === 'AI-detected' ? 'Field-verified' : prev.status,
                verifiedBy: engineerName,
                verificationDate: new Date().toISOString().split('T')[0]
              } : null);
            }}
            onViewPassport={onSelectRoad}
          />
        )}
      </div>
    </div>
  );
};
