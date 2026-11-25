'use client';

import React, { useEffect, useState } from 'react';
import { useRaiseStore } from './store/useRaiseStore';
import { Header } from './components/layout/Header';
import { Sidebar, NavPageId } from './components/layout/Sidebar';
import { StatusStrip } from './components/layout/StatusStrip';
import { FooterNote } from './components/layout/FooterNote';

// Existing Pages
import { HomeDashboardPage } from './views/HomeDashboardPage';
import { LiveOperationsPage } from './views/LiveOperationsPage';
import { RoadConditionMapPage } from './views/RoadConditionMapPage';
import { LifelinePriorityPage } from './views/LifelinePriorityPage';
import { RoadPassportPage } from './views/RoadPassportPage';
import { DrainageFloodRiskPage } from './views/DrainageFloodRiskPage';
import { MaintenanceRepairsPage } from './views/MaintenanceRepairsPage';

// New Advanced AI Platform Pages
import { AiRoadInspectionPage } from './views/AiRoadInspectionPage';
import { AiVisionEnginePage } from './views/AiVisionEnginePage';
import { PredictiveIntelligencePage } from './views/PredictiveIntelligencePage';
import { MaintenanceRecommendationPage } from './views/MaintenanceRecommendationPage';
import { BeforeAfterVerificationPage } from './views/BeforeAfterVerificationPage';
import { ContractorOversightPage } from './views/ContractorOversightPage';
import { CitizenReportingPage } from './views/CitizenReportingPage';
import { ReportsAnalyticsPage } from './views/ReportsAnalyticsPage';

// AI Chatbot Assistant
import { RaiseChatbot } from './components/chat/RaiseChatbot';
import { DataProvider } from './context/DataContext';

// Notifications Modal Icons
import { Bell, X, AlertTriangle, ShieldCheck, CloudRain, ExternalLink } from 'lucide-react';

export const App: React.FC = () => {
  const { initData, language, weatherForecast, defects, selectedRoadId, setSelectedRoadId } = useRaiseStore();
  // Default to Official Executive Home Dashboard
  const [currentPage, setCurrentPage] = useState<NavPageId>('dashboard');
  const [activeInspectionRoadId, setActiveInspectionRoadId] = useState<string>("RAISE-AS-GHY-2026-008741");
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    initData();
  }, [initData]);

  // Page title / Breadcrumb mapping
  const pageTitles: Record<NavPageId, string> = {
    'dashboard': 'Executive Command Centre & Statewide Network Overview (98,200 km)',
    'ai-inspection': 'AI Road Inspection & 3D Volumetric Analysis',
    'ai-vision': 'AI Vision Engine & Automated Defect Detection',
    'predictive': 'AI Predictive Intelligence & Waterlogging Vulnerability',
    'maintenance-rec': 'AI Maintenance Recommendations & Preliminary BOQ',
    'before-after': 'Before & After Road Repair Verification',
    'contractors': 'Contractor Oversight, Audit & Verification',
    'citizen-portal': 'Citizen Road Damage Reporting & Administrative Triage',
    'live-ops': 'Live Operations & Vehicle Telemetry',
    'weather-risk': 'Weather & Rain-Risk Intelligence',
    'defect-class': 'Defect Detection & Classification (IRC Codes)',
    'fleet': 'Real-Time Vehicle Processing & Edge Fleet',
    'duplicates': 'Shared Road Map & Anomaly Clustering',
    'review': 'Engineer Field Review Workflow',
    'lifeline': 'Lifeline Priority Engine',
    'passport': 'Road Digital Asset Passport & Ledger (56 Corridors)',
    'maintenance': 'Maintenance Planning Support',
    'repairs': 'Repair Verification & Accountability Kanban',
    'construction': 'Construction Monitoring & Progress',
    'drainage': 'Drainage & Flood Risk Intelligence',
    'safety': 'Failure Analysis & Road Safety Hypotheses',
    'reports': 'Situation Reports (SitRep) & Documentation',
    'governance': 'Security & Data Governance Controls'
  };

  const activeWeatherAlerts = weatherForecast.filter((w) => w.alertActive);
  const severeDefects = defects.filter((d) => d.severity === 'high' || d.severity === 'severe').slice(0, 5);

  return (
    <DataProvider>
      <div className="min-h-screen flex flex-col bg-[#070D18] text-slate-100 font-sans antialiased selection:bg-cyan-500/30">
        {/* 1. Official Government Header */}
        <Header onOpenNotifications={() => setShowNotifications(true)} />

        {/* 2. Status Strip with Breadcrumbs & Real-time telemetry indicators */}
        <StatusStrip breadcrumbs={[pageTitles[currentPage]]} />

        {/* 3. Main Body: Left Sidebar Navigation + Content Area */}
        <div className="flex-1 flex overflow-hidden">
          <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />

          <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 bg-[#0B1324]">
            <div className="max-w-7xl mx-auto space-y-4">
              {/* 1. OFFICIAL EXECUTIVE HOME DASHBOARD */}
              {currentPage === 'dashboard' && (
                <HomeDashboardPage
                  onNavigateTo3DView={(roadId) => {
                    setActiveInspectionRoadId(roadId);
                    setSelectedRoadId(roadId);
                    setCurrentPage('ai-inspection');
                  }}
                  onNavigateToPassport={(roadId) => {
                    setActiveInspectionRoadId(roadId);
                    setSelectedRoadId(roadId);
                    setCurrentPage('passport');
                  }}
                  onNavigateToInspectManually={() => {
                    setCurrentPage('ai-inspection');
                  }}
                />
              )}

              {/* STAR DEMO MODULE: AI Road Inspection */}
              {currentPage === 'ai-inspection' && (
                <AiRoadInspectionPage
                  activeRoadId={activeInspectionRoadId}
                  onNavigateToPassport={(roadId) => {
                    if (roadId) {
                      setActiveInspectionRoadId(roadId);
                      setSelectedRoadId(roadId);
                    }
                    setCurrentPage('passport');
                  }}
                />
              )}

              {/* AI Vision Engine */}
              {currentPage === 'ai-vision' && <AiVisionEnginePage />}

              {/* Predictive Intelligence */}
              {currentPage === 'predictive' && (
                <PredictiveIntelligencePage onSelectRoadForPassport={() => setCurrentPage('passport')} />
              )}

              {/* Maintenance Recommendations & BOQ */}
              {currentPage === 'maintenance-rec' && <MaintenanceRecommendationPage />}

              {/* Before & After Audit Slider */}
              {currentPage === 'before-after' && <BeforeAfterVerificationPage />}

              {/* Contractor Oversight */}
              {currentPage === 'contractors' && <ContractorOversightPage />}

              {/* Citizen Reporting Portal */}
              {currentPage === 'citizen-portal' && <CitizenReportingPage />}

              {/* SitRep & Reports */}
              {currentPage === 'reports' && <ReportsAnalyticsPage />}

              {/* Live Operations Landing */}
              {currentPage === 'live-ops' && <LiveOperationsPage />}

              {/* Weather & Flood Risk */}
              {currentPage === 'weather-risk' && (
                <DrainageFloodRiskPage onSelectRoadForPassport={() => setCurrentPage('passport')} />
              )}

              {/* Defect Classification Map */}
              {currentPage === 'defect-class' && (
                <RoadConditionMapPage onSelectRoadForPassport={() => setCurrentPage('passport')} />
              )}

              {/* Fleet Telemetry */}
              {currentPage === 'fleet' && (
                <div className="space-y-4">
                  <div className="bg-[#0A1220] p-4 rounded-xl border border-slate-800 shadow-xs flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-white">Assam PWrD Fleet & Edge Hardware Telemetry</h2>
                      <p className="text-xs text-slate-400">Live camera health, GNSS RTK lock quality, and offline store-and-forward buffers</p>
                    </div>
                  </div>
                  <LiveOperationsPage />
                </div>
              )}

              {/* Duplicates & Clustering */}
              {currentPage === 'duplicates' && (
                <div className="bg-[#0A1220] p-5 rounded-xl border border-slate-800 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold text-white">Shared Road Map & Spatial Duplicate Deduplication Engine</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Automated spatial clustering matches fresh video detections within 5m of existing coordinates. Seen-again counters track anomaly widening and depth growth over consecutive survey runs.
                  </p>
                  <RoadConditionMapPage onSelectRoadForPassport={() => setCurrentPage('passport')} />
                </div>
              )}

              {/* Engineer Review */}
              {currentPage === 'review' && (
                <RoadConditionMapPage onSelectRoadForPassport={() => setCurrentPage('passport')} />
              )}

              {/* Lifeline Priority Engine */}
              {currentPage === 'lifeline' && (
                <LifelinePriorityPage onSelectRoadForPassport={() => setCurrentPage('passport')} />
              )}

              {/* Road Digital Passport */}
              {currentPage === 'passport' && (
                <RoadPassportPage
                  selectedRoadId={activeInspectionRoadId}
                  onNavigateToMap={() => setCurrentPage('live-ops')}
                  onNavigateTo3DView={(roadId) => {
                    setActiveInspectionRoadId(roadId);
                    setSelectedRoadId(roadId);
                    setCurrentPage('ai-inspection');
                  }}
                />
              )}

              {/* Maintenance Planning & Repairs */}
              {currentPage === 'maintenance' && <MaintenanceRecommendationPage />}
              {currentPage === 'repairs' && <MaintenanceRepairsPage />}

              {/* Drainage & Flood Risk */}
              {currentPage === 'drainage' && (
                <DrainageFloodRiskPage onSelectRoadForPassport={() => setCurrentPage('passport')} />
              )}

              {/* Construction Monitoring */}
              {currentPage === 'construction' && (
                <ContractorOversightPage />
              )}

              {/* Failure Analysis & Road Safety */}
              {currentPage === 'safety' && (
                <PredictiveIntelligencePage onSelectRoadForPassport={() => setCurrentPage('passport')} />
              )}

              {/* Governance & Security */}
              {currentPage === 'governance' && (
                <div className="bg-[#0A1220] p-6 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-white">Security, Privacy & Data Governance Controls</h3>
                    <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded font-bold border border-cyan-700">
                      State Data Centre Certified
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                      <strong className="block text-white font-semibold">Privacy & PII Sanitization:</strong>
                      <span className="text-slate-400 text-[11px] leading-relaxed block">
                        Real-time edge blur model masks pedestrian faces and vehicle license plates on device before any frame is transmitted via cellular network.
                      </span>
                    </div>
                    <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                      <strong className="block text-white font-semibold">Sovereign Data Storage:</strong>
                      <span className="text-slate-400 text-[11px] leading-relaxed block">
                        All road survey telemetry and volumetric records reside strictly within the Assam State Data Centre (SDC) infrastructure under IT Act compliance.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* 4. Official Statutory Footer Note */}
        <FooterNote />

        {/* 5. RAISE INTELLIGENCE AI Assistant Chatbot (Floating) */}
        <RaiseChatbot />

        {/* Notification Centre Drawer Modal */}
        {showNotifications && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-[#0A1220] rounded-xl border border-slate-700 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 select-none text-slate-100">
              <div className="px-5 py-3.5 bg-[#070D18] text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-bold text-sm">PWrD Assam Alert & Incident Centre</h3>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto text-xs">
                {activeWeatherAlerts.map((w, idx) => (
                  <div key={idx} className="p-3 bg-amber-950/30 border border-amber-600/40 rounded-lg space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300">
                      <CloudRain className="w-4 h-4 text-amber-400" />
                      <span>{w.areaName} Rainfall & Defect Growth Alert</span>
                    </div>
                    <p className="text-[11px] text-amber-200/90 leading-snug">{w.alertHeadline}</p>
                    <div className="text-[10px] text-amber-400 font-semibold pt-1">
                      Forecast 24h: {w.rainfall24hMm} mm &bull; Risk indicator, requires engineer review
                    </div>
                  </div>
                ))}

                <div className="pt-2 border-t border-slate-800">
                  <h4 className="font-bold text-slate-300 text-[11px] uppercase tracking-wider mb-2">
                    Priority High-Severity Detections (Last 24h)
                  </h4>
                  <div className="space-y-1.5">
                    {severeDefects.map((d) => (
                      <div key={d.id} className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-white">{d.roadName}</div>
                          <div className="text-[10px] text-slate-400">{d.locationArea} &bull; Depth: {d.depthMm}mm</div>
                        </div>
                        <span className="font-mono text-[10px] font-bold text-red-300 bg-red-950 px-2 py-0.5 rounded border border-red-800">
                          {d.code}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-[#070D18] border-t border-slate-800 text-right">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition"
                >
                  Close Incident Centre
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DataProvider>
  );
};

export default App;
