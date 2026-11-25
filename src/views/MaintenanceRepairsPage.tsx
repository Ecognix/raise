import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { MaintenanceKanbanCard, Severity } from '../types';
import { Card } from '../components/common/Card';
import {
  Wrench,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Users,
  Image as ImageIcon,
  DollarSign,
  AlertOctagon,
  Sparkles,
  ChevronRight,
  MoveRight
} from 'lucide-react';
import { SeverityBadge, DefectTypeBadge, ReappearedBadge } from '../components/common/Badge';

export const MaintenanceRepairsPage: React.FC = () => {
  const { kanbanCards, moveKanbanCard } = useData();

  // Filters
  const [filterSeverity, setFilterSeverity] = useState<Severity | 'ALL'>('ALL');
  const [filterReappearedOnly, setFilterReappearedOnly] = useState<boolean>(false);
  const [selectedPhotoCard, setSelectedPhotoCard] = useState<MaintenanceKanbanCard | null>(null);

  const columns: {
    id: MaintenanceKanbanCard['status'];
    label: string;
    description: string;
    headerColor: string;
    borderTopColor: string;
  }[] = [
    {
      id: 'Detected',
      label: 'Detected',
      description: 'Ingested via computer vision camera runs',
      headerColor: 'bg-blue-50 text-blue-900',
      borderTopColor: 'border-t-blue-600',
    },
    {
      id: 'Verified',
      label: 'Verified',
      description: 'Signed off on-ground by PWD Engineer',
      headerColor: 'bg-amber-50 text-amber-900',
      borderTopColor: 'border-t-amber-600',
    },
    {
      id: 'Assigned',
      label: 'Assigned',
      description: 'Work order allocated to road maintenance team',
      headerColor: 'bg-purple-50 text-purple-900',
      borderTopColor: 'border-t-purple-600',
    },
    {
      id: 'Repaired',
      label: 'Repaired',
      description: 'Patch / surfacing execution completed on-site',
      headerColor: 'bg-teal-50 text-teal-900',
      borderTopColor: 'border-t-teal-600',
    },
    {
      id: 'Verified after repair',
      label: 'Verified after repair',
      description: 'Post-repair engineering audit certified',
      headerColor: 'bg-emerald-50 text-emerald-900',
      borderTopColor: 'border-t-emerald-600',
    },
  ];

  // Filter cards
  const filteredCards = kanbanCards.filter(c => {
    if (filterSeverity !== 'ALL' && c.severity !== filterSeverity) return false;
    if (filterReappearedOnly && !c.reappeared) return false;
    return true;
  });

  const getNextStatus = (current: MaintenanceKanbanCard['status']): MaintenanceKanbanCard['status'] | null => {
    switch (current) {
      case 'Detected':
        return 'Verified';
      case 'Verified':
        return 'Assigned';
      case 'Assigned':
        return 'Repaired';
      case 'Repaired':
        return 'Verified after repair';
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Wrench className="w-5 h-5 text-accent" />
              Maintenance & Repair Workflow Operations
            </h2>
            <span className="text-xs bg-navy-100 text-navy-900 font-bold px-2 py-0.5 rounded">
              5-Stage Governance Kanban
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track remedial lifecycles from AI automated intake to certified post-repair closure. Reappeared distresses flagged with statutory alerts.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <Filter className="w-3.5 h-3.5 text-navy-800" />
            <span>Filter:</span>
          </div>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as any)}
            className="px-2.5 py-1.5 rounded border border-slate-300 bg-slate-50 text-slate-800 font-medium focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="severe">Severe</option>
            <option value="moderate">Moderate</option>
            <option value="good">Good</option>
          </select>

          <label className="flex items-center gap-1.5 cursor-pointer bg-rose-50 px-2.5 py-1.5 rounded border border-rose-200 text-rose-900 font-semibold select-none">
            <input
              type="checkbox"
              checked={filterReappearedOnly}
              onChange={(e) => setFilterReappearedOnly(e.target.checked)}
              className="rounded text-rose-700"
            />
            <span>Reappeared Failures Only ({kanbanCards.filter(k => k.reappeared).length})</span>
          </label>
        </div>
      </div>

      {/* Trust & Estimation Rule Banner */}
      <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            <strong>Statutory Protocol:</strong> Every task must complete engineering verification before budget assignment.
          </span>
        </div>
        <div className="flex items-center gap-2 text-amber-800 font-medium bg-amber-50 px-2.5 py-1 rounded border border-amber-200 text-[11px]">
          <DollarSign className="w-3.5 h-3.5 text-amber-600" />
          <span>Preliminary cost estimates require executive engineer administrative approval</span>
        </div>
      </div>

      {/* 5-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
        {columns.map(col => {
          const colCards = filteredCards.filter(c => c.status === col.id);

          return (
            <div
              key={col.id}
              className={`bg-slate-100 rounded-lg border border-slate-200 border-t-4 ${col.borderTopColor} flex flex-col min-h-[500px] shadow-sm`}
            >
              {/* Column Header */}
              <div className={`p-3.5 border-b border-slate-200 ${col.headerColor} rounded-t`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                    {col.label}
                  </h3>
                  <span className="w-5 h-5 rounded-full bg-white border border-slate-300 text-slate-800 text-[11px] font-bold flex items-center justify-center">
                    {colCards.length}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                  {col.description}
                </p>
              </div>

              {/* Cards Container */}
              <div className="p-2.5 space-y-3 flex-1 overflow-y-auto">
                {colCards.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 italic">
                    No active tasks in this stage
                  </div>
                ) : (
                  colCards.map(card => {
                    const nextStatus = getNextStatus(card.status);
                    const isRepairedStage = card.status === 'Repaired' || card.status === 'Verified after repair';

                    return (
                      <div
                        key={card.id}
                        className={`bg-white rounded-lg p-3.5 border shadow-sm transition hover:shadow-md space-y-2.5 ${
                          card.reappeared ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/20' : 'border-slate-200'
                        }`}
                      >
                        {/* Card Top: ID & Badges */}
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono text-xs font-bold text-navy-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {card.defectId}
                          </span>
                          <div className="flex items-center gap-1">
                            <SeverityBadge severity={card.severity} size="sm" />
                          </div>
                        </div>

                        {/* Reappeared Flag (Prompt requirement) */}
                        {card.reappeared && (
                          <div>
                            <ReappearedBadge />
                          </div>
                        )}

                        {/* Road Name & Defect Type */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug">
                            {card.roadName}
                          </h4>
                          <div className="mt-1 flex items-center gap-1.5 text-[11px]">
                            <DefectTypeBadge type={card.defectType} />
                          </div>
                        </div>

                        {/* Cost & Assigned Crew */}
                        <div className="bg-slate-50 p-2 rounded border border-slate-200 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-slate-500">Est. Cost:</span>
                            <span className="font-mono font-bold text-slate-900">
                              ₹{card.estimatedCost.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="text-[10px] text-amber-700 font-medium">
                            Preliminary: requires engineer review
                          </div>
                          <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
                            <span className="truncate max-w-[120px] font-medium" title={card.assignedTeam}>
                              {card.assignedTeam}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {card.detectedDate}
                            </span>
                          </div>
                        </div>

                        {/* Before/After Photo Placeholders on Repaired Cards (Prompt Requirement) */}
                        {isRepairedStage ? (
                          <div className="pt-1 border-t border-slate-100">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                              <ImageIcon className="w-3 h-3 text-slate-400" />
                              <span>Audit Photo Documentation:</span>
                            </div>
                            <div className="grid grid-cols-2 gap-1.5">
                              {/* Before photo placeholder */}
                              <div
                                onClick={() => setSelectedPhotoCard(card)}
                                className="cursor-pointer bg-slate-800 text-white rounded p-1.5 text-center flex flex-col items-center justify-center h-14 hover:opacity-90 transition border border-slate-300"
                              >
                                <span className="text-[9px] font-bold uppercase text-red-300 bg-red-950/80 px-1 rounded">
                                  Before Repair
                                </span>
                                <span className="text-[9px] text-slate-300 mt-1 line-clamp-1">
                                  {card.beforePhoto}
                                </span>
                              </div>

                              {/* After photo placeholder */}
                              <div
                                onClick={() => setSelectedPhotoCard(card)}
                                className="cursor-pointer bg-emerald-900 text-white rounded p-1.5 text-center flex flex-col items-center justify-center h-14 hover:opacity-90 transition border border-emerald-400"
                              >
                                <span className="text-[9px] font-bold uppercase text-emerald-300 bg-emerald-950/80 px-1 rounded">
                                  After Repair
                                </span>
                                <span className="text-[9px] text-emerald-200 mt-1 line-clamp-1">
                                  {card.afterPhoto || 'Compacted overlay'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Before Photo Placeholder for active queue */
                          <div className="pt-1">
                            <div className="bg-slate-100 text-slate-600 rounded p-1.5 text-[11px] flex items-center gap-1.5 border border-slate-200">
                              <ImageIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="line-clamp-1 text-[10px]">Photo: {card.beforePhoto}</span>
                            </div>
                          </div>
                        )}

                        {/* Action: Advance Card to next workflow stage */}
                        {nextStatus && (
                          <div className="pt-1">
                            <button
                              onClick={() => moveKanbanCard(card.id, nextStatus)}
                              className="w-full py-1.5 px-2 bg-navy-800 hover:bg-navy-900 text-white rounded text-[11px] font-medium flex items-center justify-center gap-1 transition shadow-xs"
                            >
                              <span>Move to {nextStatus}</span>
                              <ChevronRight className="w-3 h-3 text-accent" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Photo Comparison Modal when card photo is clicked */}
      {selectedPhotoCard && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in zoom-in-95">
            <div className="px-5 py-3.5 bg-navy-800 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">
                  Before & After Inspection Evidence ({selectedPhotoCard.defectId})
                </h3>
                <p className="text-xs text-slate-300">{selectedPhotoCard.roadName}</p>
              </div>
              <button
                onClick={() => setSelectedPhotoCard(null)}
                className="text-slate-300 hover:text-white text-lg font-bold p-1"
              >
                &times;
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Before Container */}
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-red-700 uppercase flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                    <span>Before Repair</span>
                  </div>
                  <div className="h-44 bg-slate-900 rounded-lg p-3 text-white flex flex-col items-center justify-center text-center border-2 border-red-500/50">
                    <AlertTriangle className="w-8 h-8 text-red-400 mb-2" />
                    <span className="text-xs font-medium text-slate-200">Defect Visual</span>
                    <p className="text-[11px] text-slate-400 mt-1">{selectedPhotoCard.beforePhoto}</p>
                    <span className="text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded mt-2">
                      Detected: {selectedPhotoCard.detectedDate}
                    </span>
                  </div>
                </div>

                {/* After Container */}
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-emerald-700 uppercase flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>After Repair Certified</span>
                  </div>
                  <div className="h-44 bg-slate-900 rounded-lg p-3 text-white flex flex-col items-center justify-center text-center border-2 border-emerald-500/50">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2" />
                    <span className="text-xs font-medium text-slate-200">Post-Restoration</span>
                    <p className="text-[11px] text-slate-400 mt-1">{selectedPhotoCard.afterPhoto || 'Pavement restored'}</p>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded mt-2">
                      Repaired: {selectedPhotoCard.repairDate || 'Certified'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-600">
                <strong>Supervising Engineering Unit:</strong> {selectedPhotoCard.assignedTeam}
                <div className="mt-1 text-[11px] text-slate-500 italic">
                  "{selectedPhotoCard.contractorNotes || 'Quality inspection passed with density compliance.'}"
                </div>
              </div>

              <button
                onClick={() => setSelectedPhotoCard(null)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-xs transition"
              >
                Close Visual Evidence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
