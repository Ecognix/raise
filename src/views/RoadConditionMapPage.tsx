import React from 'react';
import { useData } from '../context/DataContext';
import { LeafletRoadMap } from '../components/map/LeafletRoadMap';
import { Map, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

interface RoadConditionMapPageProps {
  onSelectRoadForPassport: (roadId: string) => void;
}

export const RoadConditionMapPage: React.FC<RoadConditionMapPageProps> = ({
  onSelectRoadForPassport,
}) => {
  const { roads, defects, drains, verifyDefect } = useData();

  return (
    <div className="space-y-3">
      {/* Page Title & Operational Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white px-5 py-3 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Map className="w-5 h-5 text-navy-800" />
              Guwahati GIS Road Condition & Infrastructure Map
            </h2>
            <span className="text-xs bg-navy-100 text-navy-900 px-2 py-0.5 rounded font-semibold border border-navy-200">
              {roads.length} Corridors &bull; {defects.length} Defects
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Colour-coded road segments (Green: Good, Amber: Moderate, Red: Severe). Click markers to inspect AI camera captures and sign-off field verification.
          </p>
        </div>

        {/* Quick legend highlight */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600"></span>
            <span className="text-slate-700 font-medium">Severe ({defects.filter(d => d.severity === 'severe').length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="text-slate-700 font-medium">Moderate ({defects.filter(d => d.severity === 'moderate').length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
            <span className="text-slate-700 font-medium">Good ({defects.filter(d => d.severity === 'good').length})</span>
          </div>
        </div>
      </div>

      {/* Full-Screen Map Component */}
      <div className="rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-white">
        <LeafletRoadMap
          roads={roads}
          defects={defects}
          drains={drains}
          onVerifyDefect={verifyDefect}
          onSelectRoad={onSelectRoadForPassport}
          heightClass="h-[calc(100vh-185px)] min-h-[580px]"
        />
      </div>
    </div>
  );
};
