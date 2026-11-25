import React from 'react';
import { useRaiseStore } from '../../store/useRaiseStore';
import { translations } from '../../data/translations';
import {
  Activity,
  CloudRain,
  Layers,
  Truck,
  Copy,
  UserCheck,
  Zap,
  FileText,
  Wrench,
  CheckCircle2,
  HardHat,
  Droplets,
  AlertOctagon,
  FileSpreadsheet,
  ShieldAlert,
  ChevronRight,
  Radio,
  Box,
  Camera,
  TrendingUp,
  Building2,
  Users,
  Sliders,
  Sparkles
} from 'lucide-react';

export type NavPageId =
  | 'dashboard'
  | 'live-ops'
  | 'ai-inspection'
  | 'ai-vision'
  | 'predictive'
  | 'maintenance-rec'
  | 'before-after'
  | 'contractors'
  | 'citizen-portal'
  | 'weather-risk'
  | 'defect-class'
  | 'fleet'
  | 'duplicates'
  | 'review'
  | 'lifeline'
  | 'passport'
  | 'maintenance'
  | 'repairs'
  | 'construction'
  | 'drainage'
  | 'safety'
  | 'reports'
  | 'governance';

interface SidebarProps {
  currentPage: NavPageId;
  onPageChange: (page: NavPageId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const { language, vehicles, defects, weatherForecast } = useRaiseStore();
  const t = translations[language];

  const onlineVehiclesCount = vehicles.filter((v) => v.status === 'online').length;
  const awaitingReviewCount = defects.filter((d) => d.lifecycleState === 'Under review').length;
  const activeRainAlerts = weatherForecast.filter((w) => w.alertActive).length;

  const navGroups: {
    title: string;
    items: {
      id: NavPageId;
      label: string;
      icon: React.ReactNode;
      badge?: string | number;
      badgeColor?: string;
    }[];
  }[] = [
    {
      title: "State Executive Centre",
      items: [
        {
          id: 'dashboard',
          label: "Executive Dashboard",
          icon: <Activity className="w-4 h-4 text-cyan-400" />,
          badge: "98,200 km",
          badgeColor: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
        }
      ]
    },
    {
      title: "AI Inspection & Vision (Star Demo)",
      items: [
        {
          id: 'ai-inspection',
          label: t.navAiInspection || "AI Road Inspection",
          icon: <Box className="w-4 h-4 text-cyan-400" />,
          badge: "3D Demo",
          badgeColor: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
        },
        {
          id: 'ai-vision',
          label: t.navAiVision || "AI Vision Engine",
          icon: <Camera className="w-4 h-4 text-emerald-400" />,
          badge: "YOLOv8",
          badgeColor: "bg-emerald-950 text-emerald-300 border border-emerald-700"
        },
        {
          id: 'predictive',
          label: t.navPredictive || "AI Predictive Intelligence",
          icon: <TrendingUp className="w-4 h-4 text-amber-400" />,
          badge: "Risk 0-100",
          badgeColor: "bg-amber-950 text-amber-300 border border-amber-700"
        },
        {
          id: 'maintenance-rec',
          label: t.navMaintenanceRec || "Maintenance Recommendations",
          icon: <Wrench className="w-4 h-4 text-blue-400" />,
          badge: "BOQ / SOR",
          badgeColor: "bg-blue-950 text-blue-300 border border-blue-700"
        }
      ]
    },
    {
      title: "Real-Time Telemetry & GIS",
      items: [
        {
          id: 'live-ops',
          label: t.navLiveOps,
          icon: <Activity className="w-4 h-4" />,
          badge: `${onlineVehiclesCount} Live`,
          badgeColor: 'bg-emerald-700 text-white'
        },
        {
          id: 'fleet',
          label: t.navFleet,
          icon: <Truck className="w-4 h-4" />,
          badge: vehicles.length,
          badgeColor: 'bg-slate-700 text-slate-200'
        },
        {
          id: 'weather-risk',
          label: t.navWeatherRisk,
          icon: <CloudRain className="w-4 h-4" />,
          badge: activeRainAlerts > 0 ? `${activeRainAlerts} Alert` : undefined,
          badgeColor: 'bg-amber-600 text-white'
        },
        {
          id: 'defect-class',
          label: t.navDefectClass,
          icon: <Layers className="w-4 h-4" />,
          badge: '14 Codes',
          badgeColor: 'bg-slate-700 text-slate-200'
        }
      ]
    },
    {
      title: "Asset Management & Verification",
      items: [
        {
          id: 'passport',
          label: t.navPassport,
          icon: <FileText className="w-4 h-4" />,
          badge: '56 Corridors',
          badgeColor: 'bg-slate-700 text-slate-200'
        },
        {
          id: 'before-after',
          label: t.navBeforeAfter || "Before & After Audit",
          icon: <Sliders className="w-4 h-4 text-cyan-400" />,
          badge: "Split Slider",
          badgeColor: "bg-cyan-950 text-cyan-300"
        },
        {
          id: 'contractors',
          label: t.navContractors || "Contractor Oversight",
          icon: <Building2 className="w-4 h-4 text-amber-400" />,
          badge: "Quality Audit",
          badgeColor: "bg-slate-700 text-slate-200"
        },
        {
          id: 'citizen-portal',
          label: t.navCitizenPortal || "Citizen Reporting",
          icon: <Users className="w-4 h-4 text-emerald-400" />,
          badge: "Public Desk",
          badgeColor: "bg-emerald-950 text-emerald-300"
        },
        {
          id: 'lifeline',
          label: t.navLifeline,
          icon: <Zap className="w-4 h-4" />,
          badge: 'Score 0-100',
          badgeColor: 'bg-amber-500/20 text-amber-300'
        },
        {
          id: 'repairs',
          label: t.navRepairs,
          icon: <CheckCircle2 className="w-4 h-4" />,
          badge: '5 Stages',
          badgeColor: 'bg-slate-700 text-slate-200'
        },
        {
          id: 'drainage',
          label: t.navDrainage,
          icon: <Droplets className="w-4 h-4" />,
          badge: 'Culverts',
          badgeColor: 'bg-blue-800 text-blue-200'
        }
      ]
    },
    {
      title: "Reports & Governance",
      items: [
        {
          id: 'reports',
          label: t.navReports,
          icon: <FileSpreadsheet className="w-4 h-4" />,
          badge: 'SitRep & PDF',
          badgeColor: 'bg-cyan-900 text-cyan-200'
        },
        {
          id: 'safety',
          label: t.navSafety,
          icon: <AlertOctagon className="w-4 h-4" />,
        },
        {
          id: 'governance',
          label: t.navGovernance,
          icon: <ShieldAlert className="w-4 h-4" />,
        }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#0A1220] text-slate-200 flex flex-col shrink-0 border-r border-[#152338] select-none text-xs">
      {/* Sub-header status bar */}
      <div className="px-4 py-3 border-b border-[#1A2D47] bg-[#070D18]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Assam PWrD Ops & AI
            </span>
          </div>
          <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.5 rounded font-mono">
            v3.0 AI
          </span>
        </div>
      </div>

      {/* Nav Link Groups */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {group.title}
            </div>
            {group.items.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded text-left transition font-medium ${
                    isActive
                      ? 'bg-[#152338] text-white border-l-4 border-cyan-400 font-bold shadow-xs'
                      : 'text-slate-300 hover:bg-[#111C2E] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge !== undefined && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${item.badgeColor || 'bg-slate-800 text-slate-200'}`}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Institutional Department Tag at Sidebar Bottom */}
      <div className="p-3 border-t border-[#1A2D47] bg-[#070D18] text-center text-[10px] text-slate-400">
        <p className="font-semibold text-slate-200">Public Works Roads Department</p>
        <p className="text-slate-400">Government of Assam &bull; Road Safety Cell</p>
      </div>
    </aside>
  );
};
