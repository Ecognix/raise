import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { useRaiseStore } from '../../store/useRaiseStore';
import { Vehicle, Defect, DrainCulvert, Severity } from '../../types';
import {
  Layers,
  Radio,
  Truck,
  AlertTriangle,
  Droplets,
  CloudRain,
  MapPin,
  Compass,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  X
} from 'lucide-react';

interface GuwahatiLiveMapProps {
  heightClass?: string;
}

// Known Guwahati Flood-Risk Basin Polygons
const floodRiskPolygons = [
  {
    name: "Bharalu River Basin & Anil Nagar / Nabin Nagar",
    description: "Primary municipal drainage corridor; prone to river backflow during peak Brahmaputra surge.",
    coords: [
      [26.172, 91.735],
      [26.182, 91.752],
      [26.175, 91.768],
      [26.162, 91.752]
    ] as [number, number][]
  },
  {
    name: "Deepor Beel Wetland Catchment",
    description: "Ramsar wetland buffer zone; water overflow submerges Pamohi and Gorchuk link roads.",
    coords: [
      [26.135, 91.642],
      [26.128, 91.678],
      [26.112, 91.672],
      [26.110, 91.636]
    ] as [number, number][]
  },
  {
    name: "Rukminigaon & Downtown Basin",
    description: "Depression along GS Road; heavy flash flood accumulation from foothill runoff.",
    coords: [
      [26.145, 91.791],
      [26.149, 91.808],
      [26.133, 91.812],
      [26.129, 91.794]
    ] as [number, number][]
  }
];

// Weather-Risk High Alert Polygons
const weatherRiskPolygons = [
  {
    name: "Beltola Heavy Rain Impact Zone (88.5mm / 24h)",
    description: "High alert: 14 open potholes exposed to imminent rainfall softening and accelerated cavity growth.",
    coords: [
      [26.125, 91.785],
      [26.128, 91.805],
      [26.102, 91.802],
      [26.100, 91.780]
    ] as [number, number][]
  },
  {
    name: "Zoo Road High Rain Zone (74.2mm / 24h)",
    description: "Catchment runoff exceeding storm drain capacity at Zoo Tiniali.",
    coords: [
      [26.185, 91.770],
      [26.188, 91.785],
      [26.165, 91.788],
      [26.162, 91.775]
    ] as [number, number][]
  }
];

export const GuwahatiLiveMap: React.FC<GuwahatiLiveMapProps> = ({
  heightClass = "h-[540px]"
}) => {
  const {
    vehicles,
    defects,
    roads,
    drains,
    mapLayers,
    toggleMapLayer,
    selectedVehicle,
    setSelectedVehicle,
    selectedDefect,
    setSelectedDefect,
    verifyDefect
  } = useRaiseStore();

  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  // Filter defects
  const visibleDefects = useMemo(() => {
    return defects.filter((d) => {
      if (filterSeverity === 'ALL') return true;
      if (filterSeverity === 'high' && (d.severity === 'high' || d.severity === 'severe')) return true;
      if (filterSeverity === 'medium' && (d.severity === 'medium' || d.severity === 'moderate')) return true;
      if (filterSeverity === 'low' && (d.severity === 'low' || d.severity === 'good')) return true;
      return false;
    });
  }, [defects, filterSeverity]);

  // Create Vehicle Marker Icon
  const createVehicleMarkerIcon = (vehicle: Vehicle) => {
    const isOnline = vehicle.status === 'online';
    const isDeadZone = vehicle.status === 'dead_zone';
    const statusClass = isOnline ? 'online' : isDeadZone ? 'dead_zone' : 'offline';

    const pulseHtml = isOnline
      ? `<div class="vehicle-pulse-ring"></div><div class="vehicle-pulse-dot"></div>`
      : '';

    const queuedBadge = isDeadZone && vehicle.queuedEventsCount > 0
      ? `<div style="position: absolute; bottom:-6px; right:-6px; background:#D97706; color:white; font-size:9px; font-weight:800; border-radius:3px; padding:0 3px; border:1px solid white;">${vehicle.queuedEventsCount}</div>`
      : '';

    return L.divIcon({
      className: 'custom-defect-marker',
      html: `
        <div class="marker-vehicle-container">
          <div class="marker-vehicle ${statusClass}" title="${vehicle.id}: ${vehicle.vehicleType}">
            🚗
          </div>
          ${pulseHtml}
          ${queuedBadge}
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14]
    });
  };

  // Create Defect Marker Icon
  const createDefectMarkerIcon = (severity: Severity) => {
    const s = severity === 'high' || severity === 'severe' ? 'high' :
              severity === 'medium' || severity === 'moderate' ? 'medium' : 'low';

    return L.divIcon({
      className: 'custom-defect-marker',
      html: `<div class="marker-pin ${s}"><div class="marker-pin-inner"></div></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24]
    });
  };

  // Create Drain Marker Icon
  const createDrainMarkerIcon = (condition: string) => {
    return L.divIcon({
      className: 'custom-defect-marker',
      html: `<div class="marker-drain ${condition}">💧</div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10]
    });
  };

  return (
    <div className={`relative w-full ${heightClass} bg-slate-100 rounded border border-slate-300 overflow-hidden flex flex-col select-none`}>
      {/* Top Map Layer Toggles & Severity Filter Bar */}
      <div className="bg-white/95 backdrop-blur-xs border-b border-slate-200 px-3 py-2 z-20 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Layer Toggles */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          <span className="font-bold text-[#1B2F4B] flex items-center gap-1 text-[11px] uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            Layers:
          </span>

          <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 hover:text-slate-900 transition">
            <input
              type="checkbox"
              checked={mapLayers.vehicles}
              onChange={() => toggleMapLayer('vehicles')}
              className="rounded text-[#1B2F4B] focus:ring-0"
            />
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Vehicles ({vehicles.length})
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 hover:text-slate-900 transition">
            <input
              type="checkbox"
              checked={mapLayers.defects}
              onChange={() => toggleMapLayer('defects')}
              className="rounded text-[#1B2F4B] focus:ring-0"
            />
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              Defects ({visibleDefects.length})
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 hover:text-slate-900 transition">
            <input
              type="checkbox"
              checked={mapLayers.floodZones}
              onChange={() => toggleMapLayer('floodZones')}
              className="rounded text-[#1B2F4B] focus:ring-0"
            />
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-blue-500"></span>
              Flood-Risk Zones
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 hover:text-slate-900 transition">
            <input
              type="checkbox"
              checked={mapLayers.drains}
              onChange={() => toggleMapLayer('drains')}
              className="rounded text-[#1B2F4B] focus:ring-0"
            />
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              Drains ({drains.length})
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 hover:text-slate-900 transition">
            <input
              type="checkbox"
              checked={mapLayers.weatherRisk}
              onChange={() => toggleMapLayer('weatherRisk')}
              className="rounded text-[#1B2F4B] focus:ring-0"
            />
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-amber-500"></span>
              Weather-Risk Zones
            </span>
          </label>
        </div>

        {/* Severity Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-[11px] font-semibold">Severity:</span>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-2 py-1 rounded border border-slate-300 bg-slate-50 text-slate-800 text-xs font-semibold focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="high">High (Red)</option>
            <option value="medium">Medium (Amber)</option>
            <option value="low">Low (Green)</option>
          </select>
        </div>
      </div>

      {/* Main Leaflet Map Canvas */}
      <div className="flex-1 relative">
        <MapContainer
          center={[26.155, 91.750]} // Central Guwahati coordinates
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          {/* OpenStreetMap Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &bull; PWrD Assam'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 1. Road Segments Polylines */}
          {roads.map((road) => {
            const color =
              road.conditionScore >= 70 ? '#15803D' : road.conditionScore >= 50 ? '#D97706' : '#DC2626';
            return (
              <Polyline
                key={road.id}
                positions={road.coordinates}
                pathOptions={{
                  color: color,
                  weight: 5,
                  opacity: 0.8,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              >
                <Tooltip sticky>
                  <div className="p-1 text-xs">
                    <div className="font-bold text-slate-900">{road.name}</div>
                    <div className="text-[10px] text-slate-500">
                      {road.category} &bull; {road.lengthKm} km &bull; Condition: <strong>{road.conditionScore}/100</strong>
                    </div>
                    <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
                      Detections Today: {road.detectionsTodayCount}
                    </div>
                  </div>
                </Tooltip>
              </Polyline>
            );
          })}

          {/* 2. Flood-Risk Zones Polygons */}
          {mapLayers.floodZones &&
            floodRiskPolygons.map((zone, idx) => (
              <Polygon
                key={`flood-${idx}`}
                positions={zone.coords}
                pathOptions={{
                  fillColor: '#3B82F6',
                  fillOpacity: 0.18,
                  color: '#2563EB',
                  weight: 2,
                  dashArray: '4, 6'
                }}
              >
                <Tooltip sticky>
                  <div className="p-1 text-xs max-w-xs">
                    <strong className="text-blue-900 block font-bold">{zone.name}</strong>
                    <p className="text-[10px] text-slate-600 mt-0.5 leading-snug">{zone.description}</p>
                    <span className="inline-block mt-1 text-[9px] bg-blue-100 text-blue-800 px-1 rounded font-bold">
                      Inundation Vulnerability
                    </span>
                  </div>
                </Tooltip>
              </Polygon>
            ))}

          {/* 3. Weather-Risk Alert Zones Polygons */}
          {mapLayers.weatherRisk &&
            weatherRiskPolygons.map((wZone, idx) => (
              <Polygon
                key={`weather-${idx}`}
                positions={wZone.coords}
                pathOptions={{
                  fillColor: '#F59E0B',
                  fillOpacity: 0.22,
                  color: '#D97706',
                  weight: 2,
                  dashArray: '3, 4'
                }}
              >
                <Tooltip sticky>
                  <div className="p-1 text-xs max-w-xs">
                    <strong className="text-amber-950 block font-bold flex items-center gap-1">
                      <CloudRain className="w-3.5 h-3.5 text-amber-600" />
                      {wZone.name}
                    </strong>
                    <p className="text-[10px] text-amber-900 mt-0.5 leading-snug">{wZone.description}</p>
                    <span className="inline-block mt-1 text-[9px] bg-amber-200 text-amber-900 px-1 rounded font-bold">
                      Defect Growth Risk Active
                    </span>
                  </div>
                </Tooltip>
              </Polygon>
            ))}

          {/* 4. Drains and Culverts Layer */}
          {mapLayers.drains &&
            drains.map((drain) => (
              <Marker
                key={drain.id}
                position={drain.coordinates}
                icon={createDrainMarkerIcon(drain.condition)}
              >
                <Popup>
                  <div className="p-1 text-xs min-w-[190px]">
                    <div className="font-bold text-slate-900">{drain.name}</div>
                    <div className="text-[10px] text-slate-500">{drain.locationArea}</div>
                    <div className="mt-1.5 space-y-0.5 text-slate-700 text-[11px]">
                      <div>Type: <strong>{drain.structuralType}</strong></div>
                      <div>Condition: <strong className="uppercase">{drain.condition.replace('_', ' ')}</strong></div>
                      <div>Silting: <strong className="text-amber-700">{drain.siltingPercentage}%</strong></div>
                      <div>Into: <strong>{drain.connectedWaterBody}</strong></div>
                    </div>
                    {drain.recurringWaterlogging && (
                      <div className="mt-1.5 text-[9px] bg-red-100 text-red-800 p-1 rounded font-bold border border-red-200">
                        Recurring Waterlogging Flagged
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}

          {/* 5. Defect Markers Layer */}
          {mapLayers.defects &&
            visibleDefects.map((defect) => (
              <Marker
                key={defect.id}
                position={defect.coordinates}
                icon={createDefectMarkerIcon(defect.severity)}
                eventHandlers={{
                  click: () => {
                    setSelectedDefect(defect);
                  }
                }}
              >
                <Tooltip direction="top" offset={[0, -24]}>
                  <div className="p-1 text-xs">
                    <div className="font-bold text-slate-900">{defect.roadName}</div>
                    <div className="text-[10px] text-slate-600 font-medium">
                      Code: <strong className="font-mono">{defect.code}</strong> &bull; {defect.name}
                    </div>
                    <div className="text-[10px] text-slate-500 capitalize">
                      Severity: <strong>{defect.severity}</strong> &bull; State: {defect.lifecycleState}
                    </div>
                    <div className="text-[9px] text-amber-700 font-bold mt-0.5">
                      Click to open defect review drawer
                    </div>
                  </div>
                </Tooltip>
              </Marker>
            ))}

          {/* 6. Vehicle Markers Layer (Pulsing online, grey offline) */}
          {mapLayers.vehicles &&
            vehicles.map((v) => (
              <Marker
                key={v.id}
                position={v.coordinates}
                icon={createVehicleMarkerIcon(v)}
                eventHandlers={{
                  click: () => {
                    setSelectedVehicle(v);
                  }
                }}
              >
                {/* Specific Popup required by prompt */}
                <Popup>
                  <div className="p-1 text-xs min-w-[240px] space-y-1.5 select-none">
                    {/* Header */}
                    <div className="border-b border-slate-200 pb-1 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[#1B2F4B] text-sm flex items-center gap-1.5">
                          <span>{v.id}</span>
                          <span className="text-[11px] font-mono font-medium text-slate-600">({v.registrationNumber})</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">{v.department}</div>
                      </div>
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          v.status === 'online'
                            ? 'bg-emerald-100 text-emerald-800'
                            : v.status === 'dead_zone'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {v.status === 'dead_zone' ? 'Dead Zone' : v.status}
                      </span>
                    </div>

                    {/* Specifications Grid */}
                    <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-700">
                      <div>
                        <span className="text-slate-400 block text-[9px]">Vehicle Type:</span>
                        <strong className="text-slate-800">{v.vehicleType}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">Current Speed:</span>
                        <strong className="font-mono text-slate-900">{v.speedKmh} km/h</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">Signal Strength:</span>
                        <strong className="font-mono text-slate-800">{v.signalStrengthDbm} dBm ({v.signalBars}/4 bars)</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">Last Report Time:</span>
                        <strong className="text-slate-800">{v.lastReportTime}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">Detections Today:</span>
                        <strong className="font-mono text-amber-800 font-bold">{v.detectionsToday} anomalies</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">Camera & GNSS:</span>
                        <strong className="text-slate-800">{v.cameraStatus} &bull; {v.gnssQuality.split(' ')[0]}</strong>
                      </div>
                    </div>

                    {/* Store & Forward Offline Queue Indicator */}
                    <div
                      className={`p-1.5 rounded text-[11px] font-medium border ${
                        v.queuedEventsCount > 0
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>Offline Event Buffer:</span>
                        <strong className="font-mono">
                          {v.queuedEventsCount > 0 ? `${v.queuedEventsCount} events queued waiting to send` : '0 events queued (Synced)'}
                        </strong>
                      </div>
                      {v.queuedEventsCount > 0 && (
                        <div className="text-[9px] text-amber-800 mt-0.5">
                          Vehicle currently in dead zone. Data will upload automatically upon reconnecting to 4G cell tower.
                        </div>
                      )}
                    </div>

                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 flex items-center justify-between">
                      <span>Last Upload Batch: {v.lastUploadTime}</span>
                      <span>Edge Temp: {v.temperatureC}°C</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>

        {/* Legend Box in Bottom-Left */}
        <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-xs p-3 rounded border border-slate-300 shadow-md text-xs space-y-1.5 pointer-events-auto">
          <div className="font-bold text-[#1B2F4B] text-[10px] uppercase tracking-wider flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            Official PWrD GIS Legend
          </div>
          <div className="space-y-1 text-[11px] text-slate-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
              <span>High Severity Defect / Critical Road (&lt;50)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              <span>Medium Severity Defect / Watchlist (50-70)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
              <span>Low Severity / Good Condition (&gt;70)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 border border-emerald-600 rounded bg-white text-[9px] text-center leading-3">🚗</span>
              <span>Survey Vehicle (Green dot: Live 4G transmission)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500/30 border border-blue-600 rounded inline-block"></span>
              <span>Monsoon Inundation Vulnerability Basin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Defect Inspection Drawer if defect selected */}
      {selectedDefect && (
        <div className="absolute top-0 right-0 bottom-0 w-84 sm:w-96 bg-white shadow-2xl border-l border-slate-300 z-[1000] flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
          <div className="px-4 py-3 bg-[#1B2F4B] text-white flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold bg-[#0F1D30] text-[#F2A900] px-1.5 py-0.5 rounded border border-slate-700">
                {selectedDefect.id} &bull; Code {selectedDefect.code}
              </span>
              <h3 className="text-sm font-bold text-white mt-1 line-clamp-1">{selectedDefect.name}</h3>
            </div>
            <button
              onClick={() => setSelectedDefect(null)}
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* Visual bounding box placeholder */}
            <div className="bg-slate-900 rounded p-4 text-center border border-slate-300 relative h-36 flex flex-col items-center justify-center text-white">
              <div className="w-full h-full border-2 border-dashed border-red-500 rounded flex flex-col items-center justify-center p-2 bg-red-950/20">
                <span className="text-[10px] font-mono text-red-400 font-bold uppercase">
                  Bounding Box Overlay: [{selectedDefect.code}]
                </span>
                <span className="text-[11px] font-bold mt-1 text-slate-100">{selectedDefect.roadName}</span>
                <span className="text-[10px] text-slate-400">Chainage: KM {selectedDefect.chainageKm} &bull; Conf: {(selectedDefect.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                <span className="text-[10px] text-slate-500 block">Pothole Depth:</span>
                <strong className="text-slate-900 text-sm font-mono">{selectedDefect.depthMm} mm</strong>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                <span className="text-[10px] text-slate-500 block">Affected Area:</span>
                <strong className="text-slate-900 text-sm font-mono">{selectedDefect.areaSqM} m²</strong>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                <span className="text-[10px] text-slate-500 block">GPS Coordinates:</span>
                <strong className="text-slate-800 text-[11px] font-mono">{selectedDefect.coordinates[0]}, {selectedDefect.coordinates[1]}</strong>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                <span className="text-[10px] text-slate-500 block">Detecting Sensor:</span>
                <strong className="text-slate-800 text-[11px] font-mono">{selectedDefect.detectingVehicleId} ({selectedDefect.modelVersion})</strong>
              </div>
            </div>

            {/* Preliminary cost estimate */}
            <div className="p-3 bg-amber-50 border border-amber-300 rounded text-amber-950 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px]">Estimated Repair Cost:</span>
                <span className="font-mono font-bold text-sm">₹{(selectedDefect.estimatedRepairCost || selectedDefect.estimatedCost || 0).toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[10px] text-amber-800">
                <strong>Preliminary:</strong> requires engineer review. Suggested treatment: {selectedDefect.suggestedTreatment}
              </p>
            </div>

            {/* Verification status / Action button */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Lifecycle State:</span>
                <span className="font-bold text-[#1B2F4B] uppercase">{selectedDefect.lifecycleState}</span>
              </div>

              {selectedDefect.verifiedBy ? (
                <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 p-2 rounded">
                  <div className="font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Field-verified by {selectedDefect.verifiedBy}
                  </div>
                  <div className="text-[10px] text-emerald-700 mt-0.5">Date: {selectedDefect.verifiedDate}</div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    verifyDefect(selectedDefect.id, "Er. H. Sarma (Executive Engineer, PWrD)");
                  }}
                  className="w-full py-2 bg-[#1B2F4B] hover:bg-[#142339] text-white rounded font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#F2A900]" />
                  <span>Sign Off Field Verification</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
