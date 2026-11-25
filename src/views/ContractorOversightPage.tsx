import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Upload,
  UserCheck,
  Calendar,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

interface ContractorRecord {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  activeContractsCount: number;
  totalContractValueInr: string;
  overallRating: number; // out of 5
  assignedRoads: {
    roadId: string;
    roadName: string;
    lengthKm: number;
    budgetInr: string;
    physicalProgressPercent: number;
    financialProgressPercent: number;
    reportedRepairs: number;
    verifiedRepairs: number;
    status: 'In Progress' | 'Quality Review' | 'Completed' | 'Delayed';
  }[];
}

const CONTRACTORS_DATA: ContractorRecord[] = [
  {
    id: "CONT-AS-001",
    name: "Kamrup Infra Projects Pvt. Ltd.",
    contactPerson: "Er. Bhaskar Jyoti Sarma (Director)",
    phone: "+91 94350-18291",
    activeContractsCount: 3,
    totalContractValueInr: "₹ 4.85 Crore",
    overallRating: 4.2,
    assignedRoads: [
      {
        roadId: "RAISE-AS-GHY-2026-008741",
        roadName: "Hirakjyoti Kakati Road (By Lane 12)",
        lengthKm: 3.4,
        budgetInr: "₹ 18.4 Lakh",
        physicalProgressPercent: 68,
        financialProgressPercent: 55,
        reportedRepairs: 14,
        verifiedRepairs: 11,
        status: "Quality Review"
      },
      {
        roadId: "RD-GAU-003",
        roadName: "Beltola-Basistha Arterial",
        lengthKm: 4.8,
        budgetInr: "₹ 1.25 Crore",
        physicalProgressPercent: 84,
        financialProgressPercent: 80,
        reportedRepairs: 28,
        verifiedRepairs: 26,
        status: "In Progress"
      }
    ]
  },
  {
    id: "CONT-AS-002",
    name: "Brahmputra Infrastructure Ltd.",
    contactPerson: "Rajeev Choudhury (Project Lead)",
    phone: "+91 98640-77123",
    activeContractsCount: 2,
    totalContractValueInr: "₹ 8.20 Crore",
    overallRating: 4.6,
    assignedRoads: [
      {
        roadId: "RD-GAU-001",
        roadName: "GS Road (Guwahati-Shillong Arterial)",
        lengthKm: 8.4,
        budgetInr: "₹ 3.40 Crore",
        physicalProgressPercent: 92,
        financialProgressPercent: 90,
        reportedRepairs: 45,
        verifiedRepairs: 44,
        status: "Completed"
      },
      {
        roadId: "RD-GAU-002",
        roadName: "AT Road (Assam Trunk Corridor)",
        lengthKm: 7.2,
        budgetInr: "₹ 2.80 Crore",
        physicalProgressPercent: 60,
        financialProgressPercent: 50,
        reportedRepairs: 34,
        verifiedRepairs: 22,
        status: "In Progress"
      }
    ]
  },
  {
    id: "CONT-AS-003",
    name: "Guwahati City Builders Pvt. Ltd.",
    contactPerson: "Pranab Goswami",
    phone: "+91 94351-44582",
    activeContractsCount: 2,
    totalContractValueInr: "₹ 3.10 Crore",
    overallRating: 3.8,
    assignedRoads: [
      {
        roadId: "RD-GAU-004",
        roadName: "RG Baruah (Zoo) Road Corridor",
        lengthKm: 4.2,
        budgetInr: "₹ 95.0 Lakh",
        physicalProgressPercent: 45,
        financialProgressPercent: 40,
        reportedRepairs: 18,
        verifiedRepairs: 12,
        status: "Delayed"
      }
    ]
  }
];

export const ContractorOversightPage: React.FC = () => {
  const [contractors, setContractors] = useState<ContractorRecord[]>(CONTRACTORS_DATA);
  const [selectedContractor, setSelectedContractor] = useState<ContractorRecord>(CONTRACTORS_DATA[0]);
  const [verificationModalOpen, setVerificationModalOpen] = useState<boolean>(false);
  const [verificationSuccess, setVerificationSuccess] = useState<string | null>(null);

  const handleVerifyWork = (roadId: string) => {
    setContractors((prev) =>
      prev.map((c) => ({
        ...c,
        assignedRoads: c.assignedRoads.map((r) =>
          r.roadId === roadId
            ? { ...r, verifiedRepairs: r.reportedRepairs, status: 'Completed' }
            : r
        )
      }))
    );
    setVerificationSuccess(`Inspection verification registered for ${roadId}. Work certified for billing disbursement.`);
    setVerificationModalOpen(false);
    setTimeout(() => setVerificationSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-[#0A1220] border border-cyan-500/40 rounded-xl p-5 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              Contractor Accountability & Quality Oversight
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-800">
              Assam PWrD Verified Register
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white tracking-wide">
            Infrastructure Oversight, Works Verification & Contractor Scorecard
          </h1>
          <p className="text-xs text-slate-400">
            Transparent tracking of reported versus independently verified road rehabilitation contracts
          </p>
        </div>

        <div className="p-3 bg-amber-950/20 border border-amber-600/40 rounded-lg text-xs text-amber-200 flex items-start gap-2 max-w-md">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-tight">
            <strong>Oversight Principle:</strong> "Transparent infrastructure monitoring. Authorised engineers upload inspection evidence and verify completed maintenance work."
          </p>
        </div>
      </div>

      {verificationSuccess && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-500 rounded-lg text-xs text-emerald-200 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{verificationSuccess}</span>
        </div>
      )}

      {/* Contractor Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {contractors.map((c) => {
          const isSelected = selectedContractor.id === c.id;

          return (
            <div
              key={c.id}
              onClick={() => setSelectedContractor(c)}
              className={`bg-[#0A1220] rounded-xl border p-5 cursor-pointer transition flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'border-cyan-500 shadow-xl shadow-cyan-950/30 ring-1 ring-cyan-500/40'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    {c.id}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 font-mono font-bold text-xs">
                    <span>★ {c.overallRating}</span>
                    <span className="text-slate-500 text-[10px]">/ 5.0</span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-white">{c.name}</h3>
                <p className="text-xs text-slate-400">{c.contactPerson} &bull; {c.phone}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs font-mono">
                <div className="p-2 bg-slate-900 rounded border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">Total Commitment</span>
                  <span className="font-bold text-white">{c.totalContractValueInr}</span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">Active Corridors</span>
                  <span className="font-bold text-cyan-300">{c.assignedRoads.length} Projects</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assigned Projects Detail Table */}
      <div className="bg-[#0A1220] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-sm text-white">
              Assigned Road Contracts &bull; {selectedContractor.name}
            </h3>
            <p className="text-xs text-slate-400">
              Reported vs Independently Field-Verified Pavement Rectifications
            </p>
          </div>

          <button
            onClick={() => setVerificationModalOpen(true)}
            className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>Engineer Verification & Sign-off</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070D18] text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Corridor Name & ID</th>
                <th className="p-3">Budget</th>
                <th className="p-3">Physical Progress</th>
                <th className="p-3">Financial Disbursed</th>
                <th className="p-3">Reported vs Verified</th>
                <th className="p-3">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {selectedContractor.assignedRoads.map((r) => {
                const isHirakjyoti = r.roadId === 'RAISE-AS-GHY-2026-008741';

                return (
                  <tr key={r.roadId} className="hover:bg-slate-900/40">
                    <td className="p-3">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{r.roadName}</span>
                        {isHirakjyoti && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-900 text-amber-300 border border-amber-600">
                            DEMO ROAD
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[10px] text-cyan-400">{r.roadId} &bull; {r.lengthKm} km</div>
                    </td>

                    <td className="p-3 font-mono font-bold text-slate-200">{r.budgetInr}</td>

                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-cyan-400 h-full" style={{ width: `${r.physicalProgressPercent}%` }} />
                        </div>
                        <span className="font-mono text-cyan-300 font-bold">{r.physicalProgressPercent}%</span>
                      </div>
                    </td>

                    <td className="p-3 font-mono text-slate-300">{r.financialProgressPercent}%</td>

                    <td className="p-3 font-mono">
                      <span className="text-white font-bold">{r.reportedRepairs}</span>
                      <span className="text-slate-500"> reported / </span>
                      <span className="text-emerald-400 font-bold">{r.verifiedRepairs} verified</span>
                    </td>

                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.status === 'Completed'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : r.status === 'Quality Review'
                          ? 'bg-amber-950 text-amber-300 border border-amber-700'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Engineer Verification Modal */}
      {verificationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0A1220] border border-cyan-500/50 rounded-xl shadow-2xl max-w-lg w-full p-5 space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">
                  Field Engineer Repair Verification Portal
                </h3>
              </div>
              <button
                onClick={() => setVerificationModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Sign off on completed repairs for <strong>Hirakjyoti Kakati Road (RAISE-AS-GHY-2026-008741)</strong> by Kamrup Infra Projects Pvt. Ltd.
            </p>

            <div className="space-y-2 text-xs">
              <label className="block text-slate-400 font-semibold">Inspection Evidence Upload:</label>
              <div className="p-4 border-2 border-dashed border-slate-700 rounded-lg text-center text-slate-400 hover:border-cyan-500/50 cursor-pointer">
                <Upload className="w-6 h-6 mx-auto mb-1 text-slate-500" />
                <span>Drag post-repair photo or click to attach geo-tagged proof</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded border border-slate-800 text-[11px] text-slate-400">
              By certifying, the Sectional Officer confirms that layer thickness and bituminous surface meet PWrD Assam specifications.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setVerificationModalOpen(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => handleVerifyWork('RAISE-AS-GHY-2026-008741')}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-bold transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Certify & Release Work Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
