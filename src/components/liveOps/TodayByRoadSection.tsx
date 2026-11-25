import React from 'react';
import { useRaiseStore } from '../../store/useRaiseStore';
import { translations } from '../../data/translations';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { BarChart3, ArrowRight, Route } from 'lucide-react';

export const TodayByRoadSection: React.FC = () => {
  const { language, roads, setSelectedRoadId } = useRaiseStore();
  const t = translations[language];

  // Sort roads by detections today
  const rankedRoads = [...roads]
    .sort((a, b) => b.detectionsTodayCount - a.detectionsTodayCount)
    .slice(0, 7);

  const chartData = rankedRoads.map((r) => ({
    name: r.name.split('(')[0].trim(),
    fullName: r.name,
    today: r.detectionsTodayCount,
    last24h: r.potholesLast24hCount,
    condition: r.conditionScore
  }));

  return (
    <div className="bg-white rounded border border-slate-300 shadow-xs p-4 space-y-4 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-1">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#1B2F4B]" />
            {t.todayByRoad} (Guwahati Arterials)
          </h3>
          <p className="text-xs text-slate-500">
            Real-time road ranking by automated camera detections logged during today's inspection shifts
          </p>
        </div>
        <div className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 font-semibold">
          Top Corridor: <strong className="text-red-700">GS Road (23 Detections)</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Recharts Bar Chart (5 cols) */}
        <div className="lg:col-span-5 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 11, fill: '#1E293B', fontWeight: 600 }}
                width={100}
              />
              <RechartsTooltip
                formatter={(val: number) => [`${val} detections`, "Today's Total"]}
                contentStyle={{
                  backgroundColor: '#1B2F4B',
                  color: '#FFFFFF',
                  borderRadius: '4px',
                  fontSize: '11px',
                  border: 'none'
                }}
              />
              <Bar dataKey="today" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`bar-${index}`}
                    fill={entry.today >= 20 ? '#DC2626' : entry.today >= 10 ? '#D97706' : '#15803D'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed High-Contrast Table (7 cols) */}
        <div className="lg:col-span-7 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-100 text-slate-700 text-[11px] uppercase font-bold tracking-wider">
                <th className="py-2 px-2 text-center">Rank</th>
                <th className="py-2 px-3">Road Corridor & Division</th>
                <th className="py-2 px-2 text-center">Today</th>
                <th className="py-2 px-2 text-center">Last 24 h</th>
                <th className="py-2 px-2 text-center">Condition</th>
                <th className="py-2 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rankedRoads.map((road, idx) => {
                const conditionColor =
                  road.conditionScore >= 70 ? 'text-emerald-700' :
                  road.conditionScore >= 50 ? 'text-amber-700' : 'text-red-700';

                return (
                  <tr key={road.id} className="hover:bg-slate-50 transition">
                    <td className="py-2 px-2 text-center font-bold text-slate-800">
                      <span className={`inline-block w-5 h-5 rounded-full text-[11px] leading-5 font-bold ${
                        idx === 0 ? 'bg-red-600 text-white' : idx === 1 ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <div className="font-bold text-slate-900 line-clamp-1">{road.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {road.division} &bull; {road.category} &bull; {road.lengthKm} km
                      </div>
                    </td>
                    <td className="py-2 px-2 text-center font-mono font-bold text-red-700 text-sm">
                      {road.detectionsTodayCount}
                    </td>
                    <td className="py-2 px-2 text-center font-mono font-semibold text-slate-700">
                      {road.potholesLast24hCount}
                    </td>
                    <td className={`py-2 px-2 text-center font-mono font-bold ${conditionColor}`}>
                      {road.conditionScore}/100
                    </td>
                    <td className="py-2 px-2 text-right">
                      <button
                        onClick={() => setSelectedRoadId(road.id)}
                        className="inline-flex items-center gap-1 text-[11px] text-[#1B2F4B] hover:text-[#F2A900] font-semibold transition"
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
      </div>
    </div>
  );
};
