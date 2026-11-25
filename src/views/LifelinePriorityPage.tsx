import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { calculateLifelineScore, LifelineScoreBreakdown } from '../data';
import { Card } from '../components/common/Card';
import {
  Activity,
  Sliders,
  Hospital,
  Users,
  Route,
  AlertOctagon,
  RotateCcw,
  Info,
  CheckCircle2,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { SeverityBadge } from '../components/common/Badge';

interface LifelinePriorityPageProps {
  onSelectRoadForPassport: (roadId: string) => void;
}

export const LifelinePriorityPage: React.FC<LifelinePriorityPageProps> = ({
  onSelectRoadForPassport,
}) => {
  const { roads, lifelineWeights, setLifelineWeights, resetToDefaultWeights } = useData();

  // Calculate live ranked list
  const rankedRoads: LifelineScoreBreakdown[] = useMemo(() => {
    const list = roads.map(road => calculateLifelineScore(road, lifelineWeights));
    return list.sort((a, b) => b.totalScore - a.totalScore);
  }, [roads, lifelineWeights]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent" />
              Lifeline Priority Ranking Engine
            </h2>
            <span className="text-xs bg-navy-100 text-navy-900 font-bold px-2 py-0.5 rounded">
              Consequence of Failure Model
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic prioritization algorithm combining physical distress with critical societal vulnerability, healthcare conduits, and detour isolation penalties.
          </p>
        </div>

        {/* Live Top Priority Callout */}
        {rankedRoads.length > 0 && (
          <div className="bg-red-50 border border-red-200 px-3.5 py-2 rounded-md text-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-red-600 text-white font-black flex items-center justify-center shrink-0">
              #1
            </div>
            <div>
              <div className="text-[11px] font-semibold text-red-700 uppercase">Top Lifeline Emergency</div>
              <div className="font-bold text-slate-900 line-clamp-1">{rankedRoads[0].road.name}</div>
              <div className="text-[11px] text-red-800 font-mono">Score: {rankedRoads[0].totalScore}/100</div>
            </div>
          </div>
        )}
      </div>

      {/* Prominent Educational Notice */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm">
        <div className="flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-amber-950">
              Core Decision Rule:
            </h4>
            <p className="text-xs text-amber-900 mt-0.5 font-medium leading-relaxed">
              "A moderately damaged road that is the only access to a hospital can outrank a severely damaged road with alternatives."
            </p>
            <p className="text-[11px] text-amber-800/80 mt-1">
              Notice how the <strong>GMCH Hill Access Road</strong> (Condition 48) and <strong>Garbhanga Forest Lifeline</strong> (Detour 22km) rank above urban highways with alternate bypasses.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Weight Tuning Sliders */}
      <Card
        title="Dynamic Consequence-of-Failure Weight Calibration"
        subtitle="Adjust the weighting policy to simulate emergency response priorities (updates ranking live)"
        headerAction={
          <button
            onClick={resetToDefaultWeights}
            className="text-xs text-slate-600 hover:text-navy-900 flex items-center gap-1 font-semibold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Weights to Standard PWD Baseline</span>
          </button>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Slider 1: Condition Weight */}
          <div className="space-y-2 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                Physical Condition
              </span>
              <span className="font-mono font-bold text-navy-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {lifelineWeights.conditionWeight}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={lifelineWeights.conditionWeight}
              onChange={(e) =>
                setLifelineWeights(prev => ({ ...prev, conditionWeight: parseInt(e.target.value) || 0 }))
              }
              className="w-full accent-navy-800 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Weights physical deterioration, pothole depth & structural wear.
            </p>
          </div>

          {/* Slider 2: Hospital Access Weight */}
          <div className="space-y-2 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                Hospital Access
              </span>
              <span className="font-mono font-bold text-navy-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {lifelineWeights.hospitalSchoolWeight}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={lifelineWeights.hospitalSchoolWeight}
              onChange={(e) =>
                setLifelineWeights(prev => ({ ...prev, hospitalSchoolWeight: parseInt(e.target.value) || 0 }))
              }
              className="w-full accent-navy-800 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Critical multiplier for ambulance routes to GMCH, MMCH, BBCI.
            </p>
          </div>

          {/* Slider 3: Population & Villages */}
          <div className="space-y-2 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                Population & Villages
              </span>
              <span className="font-mono font-bold text-navy-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {lifelineWeights.populationWeight}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={lifelineWeights.populationWeight}
              onChange={(e) =>
                setLifelineWeights(prev => ({ ...prev, populationWeight: parseInt(e.target.value) || 0 }))
              }
              className="w-full accent-navy-800 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Density of settlements and isolated peri-urban villages served.
            </p>
          </div>

          {/* Slider 4: Detour Penalty / No Alternative */}
          <div className="space-y-2 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                Detour & No Alt Route
              </span>
              <span className="font-mono font-bold text-navy-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {lifelineWeights.detourPenaltyWeight}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={lifelineWeights.detourPenaltyWeight}
              onChange={(e) =>
                setLifelineWeights(prev => ({ ...prev, detourPenaltyWeight: parseInt(e.target.value) || 0 }))
              }
              className="w-full accent-navy-800 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Severely penalizes corridors where blockage forces long detours.
            </p>
          </div>
        </div>
      </Card>

      {/* Ranked Table */}
      <Card
        title={`Ranked Lifeline Prioritization Queue (${rankedRoads.length} Corridors)`}
        subtitle="Sorted in descending order of urgent intervention need (Composite Lifeline Score)"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 uppercase text-[11px] font-semibold tracking-wider">
                <th className="py-3 px-3 w-14 text-center">Rank</th>
                <th className="py-3 px-3 min-w-[200px]">Road Name & ID</th>
                <th className="py-3 px-3 text-center min-w-[90px]">Lifeline Score</th>
                <th className="py-3 px-3 min-w-[190px]">Score Composition Breakdown</th>
                <th className="py-3 px-3 text-center">Condition Score</th>
                <th className="py-3 px-3 text-center">Villages / Pop</th>
                <th className="py-3 px-3 text-center">Hospital Access</th>
                <th className="py-3 px-3 text-center">Alt Route</th>
                <th className="py-3 px-3 text-center">Detour (km)</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rankedRoads.map((item, index) => {
                const { road, totalScore, distressComponent, hospitalComponent, populationComponent, detourComponent } = item;
                const isTopThree = index < 3;
                const scoreColor =
                  totalScore >= 75
                    ? 'bg-red-600 text-white'
                    : totalScore >= 55
                    ? 'bg-amber-500 text-white'
                    : 'bg-emerald-600 text-white';

                return (
                  <tr
                    key={road.id}
                    className={`hover:bg-slate-50 transition ${isTopThree ? 'bg-amber-50/30' : ''}`}
                  >
                    {/* Rank */}
                    <td className="py-3 px-3 text-center font-bold">
                      <span
                        className={`inline-block w-6 h-6 rounded-full text-xs leading-6 text-center ${
                          index === 0
                            ? 'bg-red-600 text-white'
                            : index === 1
                            ? 'bg-amber-500 text-white'
                            : index === 2
                            ? 'bg-amber-400 text-slate-900'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {index + 1}
                      </span>
                    </td>

                    {/* Road Name */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 hover:text-navy-800 transition">
                        {road.name}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                        <span className="font-mono">{road.id}</span>
                        <span>&bull;</span>
                        <span>{road.category}</span>
                        <span>&bull;</span>
                        <span>{road.lengthKm} km</span>
                      </div>
                    </td>

                    {/* Score */}
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded font-bold font-mono text-xs ${scoreColor}`}>
                        {totalScore}
                      </span>
                    </td>

                    {/* Stacked Bar Breakdown */}
                    <td className="py-3 px-3">
                      <div className="w-full bg-slate-100 rounded-full h-3.5 flex overflow-hidden border border-slate-200">
                        <div
                          style={{ width: `${distressComponent}%` }}
                          title={`Physical Distress: ${distressComponent} pts`}
                          className="bg-red-500 h-full hover:opacity-90"
                        ></div>
                        <div
                          style={{ width: `${hospitalComponent}%` }}
                          title={`Hospital/Emergency: ${hospitalComponent} pts`}
                          className="bg-blue-600 h-full hover:opacity-90"
                        ></div>
                        <div
                          style={{ width: `${populationComponent}%` }}
                          title={`Population & Villages: ${populationComponent} pts`}
                          className="bg-purple-600 h-full hover:opacity-90"
                        ></div>
                        <div
                          style={{ width: `${detourComponent}%` }}
                          title={`Detour Penalty: ${detourComponent} pts`}
                          className="bg-amber-500 h-full hover:opacity-90"
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                        <span className="text-red-600">Dis:{distressComponent}</span>
                        <span className="text-blue-600">Hosp:{hospitalComponent}</span>
                        <span className="text-purple-600">Pop:{populationComponent}</span>
                        <span className="text-amber-600">Det:{detourComponent}</span>
                      </div>
                    </td>

                    {/* Condition Score */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`font-mono font-bold ${
                          road.conditionScore < 50
                            ? 'text-red-600'
                            : road.conditionScore < 70
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {road.conditionScore}/100
                      </span>
                    </td>

                    {/* Villages / Pop */}
                    <td className="py-3 px-3 text-center">
                      <div className="font-semibold text-slate-800">
                        {road.villagesDependent > 0 ? `${road.villagesDependent} villages` : 'Urban corridor'}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {(road.populationServed / 1000).toFixed(0)}k pop
                      </div>
                    </td>

                    {/* Hospital Access */}
                    <td className="py-3 px-3 text-center">
                      {road.hospitalSchoolAccess ? (
                        <span
                          title={road.hospitalNames?.join(', ') || 'Critical Healthcare facility access'}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold text-[11px]"
                        >
                          <Hospital className="w-3 h-3 text-blue-700" />
                          Yes
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">No</span>
                      )}
                    </td>

                    {/* Alternative Route */}
                    <td className="py-3 px-3 text-center">
                      {road.alternativeRouteAvailable ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold text-[11px]">
                          <XCircle className="w-3.5 h-3.5 text-red-600" />
                          None
                        </span>
                      )}
                    </td>

                    {/* Detour Distance */}
                    <td className="py-3 px-3 text-center font-mono font-medium text-slate-700">
                      {road.detourDistanceKm > 0 ? `${road.detourDistanceKm} km` : '-'}
                    </td>

                    {/* Action */}
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
