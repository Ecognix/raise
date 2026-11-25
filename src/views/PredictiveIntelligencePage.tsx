import React, { useState } from 'react';
import { useRaiseStore } from '../store/useRaiseStore';
import {
  CloudRain,
  TrendingUp,
  AlertTriangle,
  Sliders,
  ShieldCheck,
  Droplets,
  Activity,
  Layers,
  ArrowRight,
  RefreshCw,
  Info
} from 'lucide-react';

export const PredictiveIntelligencePage: React.FC<{ onSelectRoadForPassport?: () => void }> = ({
  onSelectRoadForPassport
}) => {
  const { roads, weatherForecast } = useRaiseStore();

  // Interactive Simulation Controls
  const [monsoonIntensityMultiplier, setMonsoonIntensityMultiplier] = useState<number>(1.2); // 1.0x to 2.5x
  const [trafficSurgePercent, setTrafficSurgePercent] = useState<number>(15); // 0 to 50%
  const [drainageClogSeverity, setDrainageClogSeverity] = useState<'normal' | 'moderate' | 'severe'>('moderate');
  const [selectedRiskZone, setSelectedRiskZone] = useState<string>('all');

  // Compute Deterioration Risk Score (0 - 100)
  const computeRoadRisk = (road: any) => {
    let score = (100 - road.conditionScore) * 0.35; // base condition wear

    // Drainage impact
    const drainWeight =
      road.drainageCondition === 'Blocked'
        ? 30
        : road.drainageCondition === 'Inadequate'
        ? 20
        : 8;
    const clogMultiplier = drainageClogSeverity === 'severe' ? 1.5 : drainageClogSeverity === 'moderate' ? 1.2 : 1.0;
    score += drainWeight * clogMultiplier * 0.3;

    // Traffic impact
    const trafficWeight = road.trafficLevel === 'High' ? 25 : road.trafficLevel === 'Medium' ? 15 : 5;
    score += trafficWeight * (1 + trafficSurgePercent / 100) * 0.2;

    // Weather impact
    const rainMultiplier = monsoonIntensityMultiplier * 0.15 * 100;
    score += rainMultiplier * (road.floodRiskLevel === 'High' ? 1.3 : 0.8) * 0.15;

    return Math.min(99, Math.max(12, Math.round(score)));
  };

  const rankedRoads = roads.map((r) => ({
    ...r,
    predictiveRiskScore: computeRoadRisk(r),
    potholeGrowthRateDays: Math.max(3, Math.round(45 / (computeRoadRisk(r) / 20))),
    predictedNextInspection: computeRoadRisk(r) > 75 ? 'Within 48 Hours' : computeRoadRisk(r) > 50 ? 'Within 7 Days' : 'Routine 30-Day Cycle'
  })).sort((a, b) => b.predictiveRiskScore - a.predictiveRiskScore);

  const filteredRoads = rankedRoads.filter((r) => {
    if (selectedRiskZone === 'critical') return r.predictiveRiskScore >= 75;
    if (selectedRiskZone === 'high') return r.predictiveRiskScore >= 60 && r.predictiveRiskScore < 75;
    return true;
  });

  return (
    <div className="space-y-6 select-none animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-[#0A1220] border border-cyan-500/40 rounded-xl p-5 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              Multi-Factor Predictive Deterioration Model
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-800">
              Assam Monsoon Calibrated
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white tracking-wide">
            AI Predictive Infrastructure Intelligence & Waterlogging Vulnerability
          </h1>
          <p className="text-xs text-slate-400">
            Synthesizing historical pavement degradation, IMD 72h rainfall, drainage capacity, and traffic loading
          </p>
        </div>

        <div className="p-3 bg-amber-950/20 border border-amber-600/40 rounded-lg text-xs text-amber-200 flex items-start gap-2 max-w-md">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-tight">
            <strong>Predictive Hypothesis Notice:</strong> Outputs represent stochastic vulnerability projections to assist preventive dispatch; they do not represent guaranteed physical outcomes.
          </p>
        </div>
      </div>

      {/* Interactive Simulation Parameters Deck */}
      <div className="bg-[#0A1220] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Environmental Stress Simulation Sliders</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Real-time sensitivity recalculation enabled
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Slider 1: Monsoon Intensity */}
          <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-cyan-400" />
                Monsoon Rain Multiplier:
              </span>
              <span className="font-mono font-bold text-cyan-300 text-sm">
                {monsoonIntensityMultiplier.toFixed(1)}&times; Baseline
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={monsoonIntensityMultiplier}
              onChange={(e) => setMonsoonIntensityMultiplier(parseFloat(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Dry Spell (0.5x)</span>
              <span>Normal (1.0x)</span>
              <span>Flash Cloudburst (2.5x)</span>
            </div>
          </div>

          {/* Slider 2: Traffic Surge */}
          <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-amber-400" />
                Axle Traffic Loading Surge:
              </span>
              <span className="font-mono font-bold text-amber-300 text-sm">
                +{trafficSurgePercent}% Volume
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={trafficSurgePercent}
              onChange={(e) => setTrafficSurgePercent(parseInt(e.target.value))}
              className="w-full accent-amber-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Baseline (0%)</span>
              <span>Peak Festival (+25%)</span>
              <span>Extreme Detour (+50%)</span>
            </div>
          </div>

          {/* Drainage Condition Override */}
          <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-400" />
              Siltation & Culvert Choke State:
            </span>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {(['normal', 'moderate', 'severe'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setDrainageClogSeverity(lvl)}
                  className={`py-1.5 rounded text-xs capitalize font-semibold transition border ${
                    drainageClogSeverity === lvl
                      ? 'bg-blue-600/30 text-blue-300 border-blue-500'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500">
              Simulates subgrade pore-water saturation and edge softening.
            </p>
          </div>
        </div>
      </div>

      {/* Predictive Deterioration Heatmap Ranking Table */}
      <div className="bg-[#0A1220] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-sm text-white">
              Guwahati Corridor Defect Growth Risk Ranking
            </h3>
            <p className="text-xs text-slate-400">
              Road corridors ranked by probability of rapid cavitation and subgrade failure
            </p>
          </div>

          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setSelectedRiskZone('all')}
              className={`px-3 py-1 rounded font-semibold transition ${
                selectedRiskZone === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Roads ({rankedRoads.length})
            </button>
            <button
              onClick={() => setSelectedRiskZone('critical')}
              className={`px-3 py-1 rounded font-semibold transition ${
                selectedRiskZone === 'critical' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Critical Risk (&gt;75)
            </button>
            <button
              onClick={() => setSelectedRiskZone('high')}
              className={`px-3 py-1 rounded font-semibold transition ${
                selectedRiskZone === 'high' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              High Risk (60-74)
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070D18] text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Rank & Corridor</th>
                <th className="p-3">Passport ID</th>
                <th className="p-3 text-center">Defect Growth Risk (0-100)</th>
                <th className="p-3">Drainage Vulnerability</th>
                <th className="p-3">Est. Cavitation Doubling</th>
                <th className="p-3">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredRoads.slice(0, 10).map((road, index) => {
                const isHirakjyoti = road.id === 'RAISE-AS-GHY-2026-008741';
                const riskColor =
                  road.predictiveRiskScore >= 75
                    ? 'text-rose-400 bg-rose-950/80 border-rose-700'
                    : road.predictiveRiskScore >= 60
                    ? 'text-amber-400 bg-amber-950/80 border-amber-700'
                    : 'text-emerald-400 bg-emerald-950/80 border-emerald-700';

                return (
                  <tr
                    key={road.id}
                    className={`hover:bg-slate-900/40 transition ${
                      isHirakjyoti ? 'bg-cyan-950/30 border-l-4 border-cyan-400' : ''
                    }`}
                  >
                    <td className="p-3">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span className="text-slate-500 font-mono text-xs">#{index + 1}</span>
                        <span>{road.name}</span>
                        {isHirakjyoti && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-900 text-cyan-200 border border-cyan-600">
                            DEMO ROAD
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">{road.locationArea} &bull; {road.lengthKm} km</div>
                    </td>

                    <td className="p-3 font-mono text-cyan-300 font-semibold">{road.id}</td>

                    <td className="p-3 text-center">
                      <div className="inline-flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${riskColor}`}>
                          {road.predictiveRiskScore} / 100
                        </span>
                      </div>
                    </td>

                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        road.floodRiskLevel === 'High' ? 'bg-red-950 text-red-300' : 'bg-slate-800 text-slate-300'
                      }`}>
                        Flood: {road.floodRiskLevel} &bull; Drain: {road.drainageCondition}
                      </span>
                    </td>

                    <td className="p-3 font-mono text-slate-300">
                      <span className="text-amber-400 font-bold">{road.potholeGrowthRateDays} Days</span>
                      <span className="block text-[10px] text-slate-500">{road.predictedNextInspection}</span>
                    </td>

                    <td className="p-3">
                      <span className="text-[11px] text-slate-300 block">
                        {road.predictiveRiskScore > 75
                          ? 'Emergency culvert desilting & pre-monsoon seal coat'
                          : 'Schedule edge patch milling before next rainfall'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
