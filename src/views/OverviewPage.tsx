import React from 'react';
import { useData } from '../context/DataContext';
import { StatCard, Card } from '../components/common/Card';
import {
  Route,
  AlertTriangle,
  ShieldCheck,
  CheckCircle,
  CloudRain,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Cell
} from 'recharts';
import { monthlyDefectsTrend } from '../data/rainfallData';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { SeverityBadge, SourceTrustBadge, DefectTypeBadge } from '../components/common/Badge';

interface OverviewPageProps {
  onNavigateToMap: () => void;
  onSelectRoadForPassport: (roadId: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onNavigateToMap,
  onSelectRoadForPassport: _onSelectRoadForPassport,
}) => {
  const { roads, defects, kanbanCards } = useData();

  // KPI Calculations
  const totalRoads = roads.length;
  const totalDefects = defects.length;
  const verifiedDefects = defects.filter(
    d => d.source === 'Field-verified' || d.status === 'Field-verified' || d.status === 'Verified after repair'
  ).length;
  const repairsCompleted = defects.filter(
    d => d.status === 'Repaired' || d.status === 'Verified after repair'
  ).length;
  const highFloodRiskRoads = roads.filter(r => r.floodRiskLevel === 'High').length;
  const pendingMaintenance = kanbanCards.filter(
    k => k.status !== 'Verified after repair'
  ).length;

  // Chart 1: Defects by Type
  const defectTypeCounts = [
    { name: 'Pothole', count: defects.filter(d => d.defectType === 'pothole').length, color: '#DC2626' },
    { name: 'Crack', count: defects.filter(d => d.defectType === 'crack').length, color: '#D97706' },
    { name: 'Surface Wear', count: defects.filter(d => d.defectType === 'surface_wear').length, color: '#EA580C' },
    { name: 'Drain Blockage', count: defects.filter(d => d.defectType === 'drain_blockage').length, color: '#7C3AED' },
  ];

  // Latest 5 defects for priority list
  const recentDefects = [...defects].reverse().slice(0, 5);

  const miniMarkerIcon = (severity: string) => {
    return L.divIcon({
      className: 'custom-defect-marker',
      html: `<div class="marker-pin ${severity} scale-75"><div class="marker-pin-inner"></div></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 20],
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Operational Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Executive Road Network Overview
            </h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
              Active Sensor Feed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time automated surveillance and engineering triage for Guwahati Urban Division &bull; Kamrup Metro
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToMap}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-navy-800 hover:bg-navy-900 text-white text-xs font-semibold rounded-md shadow transition"
          >
            <span>Launch Full GIS Map</span>
            <ArrowUpRight className="w-4 h-4 text-accent" />
          </button>
        </div>
      </div>

      {/* 6 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          label="Total Roads Monitored"
          value={totalRoads}
          subtext="88.7 km surveyed"
          highlightColor="blue"
          icon={<Route className="w-4 h-4" />}
        />
        <StatCard
          label="Defects Detected"
          value={totalDefects}
          subtext="By AI cameras & sensors"
          highlightColor="amber"
          trend={{ value: "+8 this week", isGood: false }}
          icon={<AlertTriangle className="w-4 h-4" />}
        />
        <StatCard
          label="Field Verified"
          value={verifiedDefects}
          subtext={`${Math.round((verifiedDefects / totalDefects) * 100)}% engineer sign-off`}
          highlightColor="emerald"
          icon={<ShieldCheck className="w-4 h-4" />}
        />
        <StatCard
          label="Repairs Completed"
          value={repairsCompleted}
          subtext="Bitumen & concrete"
          highlightColor="emerald"
          trend={{ value: "+5 closed", isGood: true }}
          icon={<CheckCircle className="w-4 h-4" />}
        />
        <StatCard
          label="High Flood Risk"
          value={highFloodRiskRoads}
          subtext="Critical monsoon alert"
          highlightColor="red"
          icon={<CloudRain className="w-4 h-4" />}
        />
        <StatCard
          label="Pending Maintenance"
          value={pendingMaintenance}
          subtext="Active in work queue"
          highlightColor="amber"
          icon={<Clock className="w-4 h-4" />}
        />
      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Defects by Type */}
        <Card
          title="Defects Breakdown by Type"
          subtitle="Distribution of road surface and drainage structural anomalies"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={defectTypeCounts} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} allowDecimals={false} />
                <RechartsTooltip
                  formatter={(val: number) => [`${val} defects`, 'Count']}
                  contentStyle={{ backgroundColor: '#1E293B', color: '#fff', borderRadius: '6px', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {defectTypeCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Potholes remain primary vehicle damage contributor (40%)</span>
            <span className="font-medium text-slate-700">Total: {totalDefects} items</span>
          </div>
        </Card>

        {/* Chart 2: Detected vs Repaired (Last 6 Months) */}
        <Card
          title="Defect Detection vs Repairs Completed (6-Month Trend)"
          subtitle="AI surveillance discovery rate vs Municipal maintenance completion throughput"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyDefectsTrend} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#1E293B', color: '#fff', borderRadius: '6px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="detected"
                  name="Detected (Surveillance AI)"
                  stroke="#DC2626"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="repaired"
                  name="Repairs Closed (PWD & GMC)"
                  stroke="#16A34A"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Peak detection correlates with pre-monsoon precipitation spikes in April/May</span>
            <span className="text-emerald-700 font-medium">Repairs pacing up +22%</span>
          </div>
        </Card>
      </div>

      {/* Map Preview + Recent Findings Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Small Map Preview (2 cols) */}
        <div className="lg:col-span-2">
          <Card
            title="Live Geospatial Defect Density Preview"
            subtitle="Guwahati Metropolitan corridor overview"
            headerAction={
              <button
                onClick={onNavigateToMap}
                className="text-xs font-semibold text-navy-800 hover:text-accent flex items-center gap-1 transition"
              >
                <span>Interactive Map & Filters</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            }
          >
            <div className="h-72 w-full rounded-md overflow-hidden border border-slate-200 relative">
              <MapContainer
                center={[26.155, 91.750]}
                zoom={11}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Road polylines */}
                {roads.slice(0, 15).map(r => (
                  <Polyline
                    key={r.id}
                    positions={r.coordinates}
                    pathOptions={{
                      color: r.conditionScore >= 70 ? '#16A34A' : r.conditionScore >= 50 ? '#D97706' : '#DC2626',
                      weight: 4,
                      opacity: 0.75,
                    }}
                  />
                ))}

                {/* Latest defects markers */}
                {defects.slice(0, 25).map(d => (
                  <Marker
                    key={d.id}
                    position={d.coordinates}
                    icon={miniMarkerIcon(d.severity)}
                  >
                    <Tooltip>
                      <div className="text-xs font-medium">
                        {d.roadName}: {d.defectType} ({d.severity})
                      </div>
                    </Tooltip>
                  </Marker>
                ))}
              </MapContainer>

              {/* Floating Overlay Pill */}
              <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded shadow text-xs border border-slate-200 z-[400] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                <span className="font-medium text-slate-700">Displaying 25 high-priority geo-markers</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Priority Findings / Action Triage (1 col) */}
        <div>
          <Card
            title="Recent AI Surveillance Findings"
            subtitle="Most recently ingested anomalies"
          >
            <div className="divide-y divide-slate-100">
              {recentDefects.map(defect => (
                <div key={defect.id} className="py-2.5 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-semibold text-slate-800">{defect.id}</span>
                    <SeverityBadge severity={defect.severity} size="sm" />
                  </div>
                  <div className="text-xs font-medium text-slate-700 line-clamp-1">
                    {defect.roadName}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <DefectTypeBadge type={defect.defectType || defect.code} />
                    <SourceTrustBadge source={defect.source} size="sm" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={onNavigateToMap}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium rounded text-xs border border-slate-200 transition text-center"
              >
                Inspect All {defects.length} Findings on Map
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
