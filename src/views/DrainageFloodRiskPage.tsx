import React from 'react';
import { useData } from '../context/DataContext';
import { Card, StatCard } from '../components/common/Card';
import { rainfallData } from '../data/rainfallData';
import {
  CloudRain,
  Droplet,
  AlertTriangle,
  Hospital,
  Users,
  Compass,
  CheckCircle,
  AlertOctagon,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  Cell
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Tooltip } from 'react-leaflet';
import L from 'leaflet';

interface DrainageFloodRiskPageProps {
  onSelectRoadForPassport: (roadId: string) => void;
}

export const DrainageFloodRiskPage: React.FC<DrainageFloodRiskPageProps> = ({
  onSelectRoadForPassport,
}) => {
  const { roads, drains } = useData();

  // Flood vulnerable roads
  const floodVulnerableRoads = roads.filter(r => r.floodRiskLevel === 'High' || r.floodRiskLevel === 'Medium');

  // Drain condition counts
  const blockedDrains = drains.filter(d => d.condition === 'blocked').length;
  const partiallyBlockedDrains = drains.filter(d => d.condition === 'partially_blocked').length;
  const clearDrains = drains.filter(d => d.condition === 'clear').length;

  const drainIcon = (condition: string) => {
    return L.divIcon({
      className: 'custom-defect-marker',
      html: `<div class="marker-drain ${condition}">💧</div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-accent" />
              Drainage Infrastructure & Monsoon Inundation Risk
            </h2>
            <span className="text-xs bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded">
              High Pre-Monsoon Priority
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Hydraulic catchment analytics, culvert blockage monitoring, and vulnerability assessment for community isolation.
          </p>
        </div>

        {/* Quick Drain Condition Counter */}
        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded bg-purple-50 border border-purple-200 text-purple-900 font-medium">
            Blocked Drains: <strong>{blockedDrains}</strong>
          </div>
          <div className="px-3 py-1.5 rounded bg-sky-50 border border-sky-200 text-sky-900 font-medium">
            Partially Blocked: <strong>{partiallyBlockedDrains}</strong>
          </div>
          <div className="px-3 py-1.5 rounded bg-teal-50 border border-teal-200 text-teal-900 font-medium">
            Clear: <strong>{clearDrains}</strong>
          </div>
        </div>
      </div>

      {/* Rainfall Bar Chart with Alert Threshold */}
      <Card
        title="Guwahati Monthly Precipitation & Flash Flood Inundation Threshold"
        subtitle="Historical and recorded rainfall (mm) with designated 120mm municipal stormwater saturation threshold"
      >
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rainfallData} margin={{ top: 20, right: 30, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis
                tick={{ fontSize: 12, fill: '#64748B' }}
                label={{ value: 'Millimetres (mm)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#94A3B8' }}
              />
              <RechartsTooltip
                formatter={(val: number) => [`${val} mm`, 'Rainfall']}
                contentStyle={{ backgroundColor: '#1E293B', color: '#fff', borderRadius: '6px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

              {/* Threshold Line at 120mm */}
              <ReferenceLine
                y={120}
                stroke="#DC2626"
                strokeDasharray="4 4"
                strokeWidth={2}
                label={{
                  value: 'Alert Threshold (120mm)',
                  fill: '#DC2626',
                  fontSize: 11,
                  position: 'insideTopRight',
                  fontWeight: 600,
                }}
              />

              <Bar dataKey="recordedMm" name="Recorded Precipitation (mm)" fill="#0284C7" radius={[4, 4, 0, 0]}>
                {rainfallData.map((entry, index) => (
                  <Cell
                    key={`rain-${index}`}
                    fill={entry.recordedMm > 120 ? '#DC2626' : '#0284C7'}
                  />
                ))}
              </Bar>
              <Bar dataKey="averageMm" name="30-Yr Normal Average (mm)" fill="#94A3B8" radius={[4, 4, 0, 0]} opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 p-3 bg-red-50/70 border border-red-200 rounded-md text-xs text-red-900 flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-red-600 shrink-0" />
          <span>
            <strong>Pre-Monsoon Flood Warning:</strong> Precipitation in May, June, July, and August severely exceeds the 120mm carrying capacity of Guwahati's natural drainage arteries (Bharalu River and Mora Bharalu).
          </span>
        </div>
      </Card>

      {/* Map + Table of Drains and Culverts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Drain Map Preview (1 col) */}
        <div className="lg:col-span-1">
          <Card
            title="Drain & Culvert Geospatial Grid"
            subtitle="Locations of 15 key hydraulic discharge points"
          >
            <div className="h-96 w-full rounded-md overflow-hidden border border-slate-200">
              <MapContainer
                center={[26.155, 91.750]}
                zoom={11}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {drains.map(d => (
                  <Marker
                    key={d.id}
                    position={d.coordinates}
                    icon={drainIcon(d.condition)}
                  >
                    <Popup>
                      <div className="text-xs p-1">
                        <strong className="block text-slate-900">{d.name}</strong>
                        <span className="text-[11px] text-slate-500">{d.locationArea}</span>
                        <div className="mt-1 text-slate-700">
                          Condition: <strong className="uppercase">{d.condition.replace('_', ' ')}</strong>
                          <br />
                          Silting: {d.siltingPercentage}%
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            <div className="mt-3 space-y-1 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                <span>Purple: Blocked (&gt;70% silt choke)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
                <span>Blue: Partially Blocked (30-70% silt)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                <span>Teal: Clear & Desilted</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Drains and Culverts Table (2 cols) */}
        <div className="lg:col-span-2">
          <Card
            title="Drains & Culverts Operational Condition Register"
            subtitle="De-silting status, silting percentage, and recurring waterlogging indicators"
          >
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-slate-100 z-10">
                  <tr className="border-b border-slate-200 text-slate-700 font-semibold text-[11px]">
                    <th className="py-2.5 px-3">Drain Name & ID</th>
                    <th className="py-2.5 px-3">Location & Catchment</th>
                    <th className="py-2.5 px-3 text-center">Condition</th>
                    <th className="py-2.5 px-3 text-center">Silting %</th>
                    <th className="py-2.5 px-3">Last Cleaned</th>
                    <th className="py-2.5 px-3 text-center">Waterlogging</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {drains.map(d => {
                    const isBlocked = d.condition === 'blocked';
                    const isPartial = d.condition === 'partially_blocked';

                    return (
                      <tr key={d.id} className="hover:bg-slate-50 transition">
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-900">{d.name}</div>
                          <div className="font-mono text-[10px] text-slate-500">{d.id} &bull; {d.structuralType}</div>
                        </td>

                        <td className="py-2.5 px-3">
                          <div className="text-slate-800">{d.locationArea}</div>
                          <div className="text-[10px] text-slate-500">Into: {d.connectedWaterBody}</div>
                        </td>

                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                              isBlocked
                                ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                : isPartial
                                ? 'bg-sky-100 text-sky-800 border border-sky-300'
                                : 'bg-teal-100 text-teal-800 border border-teal-300'
                            }`}
                          >
                            {d.condition.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center gap-1.5 justify-center">
                            <div className="w-12 bg-slate-200 rounded-full h-2 overflow-hidden">
                              <div
                                style={{ width: `${d.siltingPercentage}%` }}
                                className={`h-full ${
                                  d.siltingPercentage >= 70
                                    ? 'bg-red-600'
                                    : d.siltingPercentage >= 40
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                                }`}
                              ></div>
                            </div>
                            <span className="font-mono text-[11px] text-slate-700 font-semibold">{d.siltingPercentage}%</span>
                          </div>
                        </td>

                        <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                          {d.lastCleanedDate}
                        </td>

                        <td className="py-2.5 px-3 text-center">
                          {d.recurringWaterlogging ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-bold border border-red-200">
                              <AlertTriangle className="w-3 h-3 text-red-600" />
                              Recurring
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Normal</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* List of Roads Exposed to Flood Risk with Cut-off Impacts (Prompt Requirement) */}
      <Card
        title="Roads Exposed to Severe Flood Inundation & Isolation Risk"
        subtitle="Critical corridors vulnerable to stormwater cutoff with dependent healthcare facilities and isolated hamlets"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 uppercase text-[11px] font-semibold tracking-wider">
                <th className="py-3 px-3">Road Corridor & ID</th>
                <th className="py-3 px-3 text-center">Vulnerability Level</th>
                <th className="py-3 px-3">Villages or Hospitals That Could Be Cut Off</th>
                <th className="py-3 px-3">Inundation & Drainage Mechanism</th>
                <th className="py-3 px-3 text-center">Detour If Blocked</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {floodVulnerableRoads.map(road => {
                const isHigh = road.floodRiskLevel === 'High';

                return (
                  <tr key={road.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{road.name}</div>
                      <div className="font-mono text-[11px] text-slate-500">{road.id} &bull; {road.category}</div>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded text-xs font-bold ${
                          isHigh
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {road.floodRiskLevel} Risk
                      </span>
                    </td>

                    {/* Cut-off impacts cell */}
                    <td className="py-3 px-3">
                      <div className="space-y-1">
                        {road.hospitalSchoolAccess && road.hospitalNames && (
                          <div className="flex items-center gap-1.5 text-red-950 font-bold bg-red-50 p-1.5 rounded border border-red-200">
                            <Hospital className="w-3.5 h-3.5 text-red-600 shrink-0" />
                            <span>Cut-off threat to: {road.hospitalNames.join(', ')}</span>
                          </div>
                        )}
                        {road.villagesDependent > 0 && (
                          <div className="flex items-center gap-1.5 text-purple-950 font-semibold bg-purple-50 p-1.5 rounded border border-purple-200">
                            <Users className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            <span>Isolates {road.villagesDependent} dependent peri-urban / rural hamlets</span>
                          </div>
                        )}
                        {!road.hospitalSchoolAccess && road.villagesDependent === 0 && (
                          <span className="text-slate-600">Disrupts major city transit & freight connectivity</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-600 max-w-xs">
                      {road.cutOffRiskNotes || 'Silt accumulation during intense rainfall bursts.'}
                    </td>

                    <td className="py-3 px-3 text-center font-mono font-medium text-slate-700">
                      {!road.alternativeRouteAvailable ? (
                        <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          Zero Alt Route ({road.detourDistanceKm} km detour)
                        </span>
                      ) : (
                        <span>{road.detourDistanceKm} km detour</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onSelectRoadForPassport(road.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-navy-800 bg-slate-100 hover:bg-navy-800 hover:text-white rounded transition"
                      >
                        <span>Passport</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
