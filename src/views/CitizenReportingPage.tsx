import React, { useState } from 'react';
import {
  Users,
  Camera,
  MapPin,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Search,
  Clock,
  ShieldCheck,
  Send,
  FileText
} from 'lucide-react';

interface CitizenComplaint {
  id: string; // e.g. "CIT-GHY-2026-8912"
  roadName: string;
  landmark: string;
  damageType: 'Pothole' | 'Severe Cracking' | 'Waterlogging' | 'Edge Cave-in';
  coordinates: [number, number];
  photoUrl: string;
  submittedAt: string;
  citizenName: string;
  citizenPhone: string;
  status: 'Submitted' | 'AI Triaged' | 'Field Verified' | 'Assigned' | 'Resolved';
  adminDecision?: 'Approved' | 'Rejected' | 'Duplicate';
}

const INITIAL_COMPLAINTS: CitizenComplaint[] = [
  {
    id: "CIT-GHY-2026-8912",
    roadName: "Dr. Zakir Hussain Road",
    landmark: "Downtown Hospital to Hengrabari VIP Connector, near Chachal link",
    damageType: "Pothole",
    coordinates: [26.1485, 91.7925],
    photoUrl: "/images/pothole_big.jpg",
    submittedAt: "2026-11-18 09:30",
    citizenName: "Deepak Goswami",
    citizenPhone: "+91 98640-11234",
    status: "AI Triaged"
  },
  {
    id: "CIT-GHY-2026-8854",
    roadName: "GS Road",
    landmark: "Christian Basti near Central Mall",
    damageType: "Severe Cracking",
    coordinates: [26.1664, 91.7601],
    photoUrl: "/images/asphalt_deterioration.jpg",
    submittedAt: "2026-11-17 16:45",
    citizenName: "Ananya Baruah",
    citizenPhone: "+91 94350-55678",
    status: "Field Verified"
  }
];

export const CitizenReportingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'submit' | 'track' | 'adminTriage'>('submit');
  const [complaints, setComplaints] = useState<CitizenComplaint[]>(INITIAL_COMPLAINTS);

  // Form states
  const [roadName, setRoadName] = useState('GS Road');
  const [landmark, setLandmark] = useState('Near Bhangagarh Flyover');
  const [damageType, setDamageType] = useState<CitizenComplaint['damageType']>('Pothole');
  const [coords, setCoords] = useState<[number, number]>([26.1738, 91.7831]);
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string>(
    '/images/potholes_on_asphalt_road_20171023.jpg'
  );
  const [submittedToken, setSubmittedToken] = useState<string | null>(null);

  // Track search state
  const [searchToken, setSearchToken] = useState('');
  const [trackedComplaint, setTrackedComplaint] = useState<CitizenComplaint | null>(null);

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    const token = `CIT-GHY-2026-${Math.floor(Math.random() * 9000 + 1000)}`;
    const newRecord: CitizenComplaint = {
      id: token,
      roadName,
      landmark,
      damageType,
      coordinates: coords,
      photoUrl: photoPreview,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      citizenName: citizenName || 'Anonymous Citizen',
      citizenPhone: citizenPhone || '+91 98000-00000',
      status: 'Submitted'
    };

    setComplaints([newRecord, ...complaints]);
    setSubmittedToken(token);
  };

  const handleTrackLookup = () => {
    const found = complaints.find((c) => c.id.toLowerCase() === searchToken.trim().toLowerCase());
    setTrackedComplaint(found || null);
  };

  const handleAdminTriage = (id: string, decision: 'Approved' | 'Rejected') => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              adminDecision: decision,
              status: decision === 'Approved' ? 'Field Verified' : 'Resolved'
            }
          : c
      )
    );
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-[#0A1220] border border-cyan-500/40 rounded-xl p-5 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              Public Grievance & Citizen Sourcing
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-800">
              Guwahati Municipal & PWrD Joint Cell
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white tracking-wide">
            Citizen Road Damage Reporting & Administrative Triage
          </h1>
          <p className="text-xs text-slate-400">
            Submit geo-tagged pavement hazards, monitor repair status, and review community reports
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-3 py-1.5 rounded-md font-semibold transition ${
              activeTab === 'submit' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Report Defect
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`px-3 py-1.5 rounded-md font-semibold transition ${
              activeTab === 'track' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Track Status
          </button>
          <button
            onClick={() => setActiveTab('adminTriage')}
            className={`px-3 py-1.5 rounded-md font-semibold transition ${
              activeTab === 'adminTriage' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Admin Triage ({complaints.filter(c => !c.adminDecision).length})
          </button>
        </div>
      </div>

      {/* 1. REPORT DEFECT FORM */}
      {activeTab === 'submit' && (
        <div className="max-w-3xl mx-auto bg-[#0A1220] border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white">
              Lodge Road Infrastructure Hazard
            </h2>
            <p className="text-xs text-slate-400">
              Provide photographic evidence and approximate location for automated AI classification and engineer triage
            </p>
          </div>

          {submittedToken ? (
            <div className="p-6 bg-emerald-950/40 border border-emerald-600/60 rounded-xl text-center space-y-3 animate-in zoom-in-95">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Complaint Submitted Successfully!</h3>
              <p className="text-xs text-slate-300">
                Your report has entered the PWrD Assam verification queue.
              </p>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 inline-block font-mono text-cyan-400 font-bold text-sm">
                Tracking Token: {submittedToken}
              </div>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSubmittedToken(null);
                    setActiveTab('track');
                    setSearchToken(submittedToken);
                  }}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition"
                >
                  Track This Complaint
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitComplaint} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Corridor / Road Name:</label>
                  <input
                    type="text"
                    required
                    value={roadName}
                    onChange={(e) => setRoadName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Specific Landmark / By-Lane:</label>
                  <input
                    type="text"
                    required
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Damage Category:</label>
                  <select
                    value={damageType}
                    onChange={(e) => setDamageType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option value="Pothole">Pothole (Carriageway Depression)</option>
                    <option value="Severe Cracking">Severe Cracking / Structural Fracture</option>
                    <option value="Waterlogging">Waterlogging / Culvert Choke</option>
                    <option value="Edge Cave-in">Edge Cave-in / Shoulder Drop</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">GPS Location Tag:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${coords[0].toFixed(4)}, ${coords[1].toFixed(4)} (Guwahati)`}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-cyan-300 font-mono text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={() => setCoords([26.1738 + (Math.random() - 0.5) * 0.01, 91.7831 + (Math.random() - 0.5) * 0.01])}
                      className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg shrink-0 flex items-center gap-1 font-semibold"
                    >
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      Pin GPS
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Defect Photograph Evidence:</label>
                <div className="p-4 border-2 border-dashed border-slate-700 rounded-lg bg-slate-950 flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-24 h-20 object-cover rounded-lg border border-slate-700"
                  />
                  <div className="text-center sm:text-left space-y-1">
                    <p className="text-slate-300 font-medium">Uploaded optical evidence ready for AI analysis</p>
                    <p className="text-[11px] text-slate-500">EXIF Geotagging & timestamp extracted automatically</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Citizen Name (Optional):</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Saikia"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Mobile Number for SMS Tracking:</label>
                  <input
                    type="tel"
                    placeholder="+91 94350-XXXXX"
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-lg transition flex items-center gap-2 shadow-lg shadow-cyan-950/40"
                >
                  <Send className="w-4 h-4" />
                  Submit Grievance to PWrD
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 2. TRACK COMPLAINT STATUS */}
      {activeTab === 'track' && (
        <div className="max-w-2xl mx-auto bg-[#0A1220] border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white">Track Grievance Status</h2>
            <p className="text-xs text-slate-400">
              Enter your complaint reference token (e.g. <code>CIT-GHY-2026-8912</code>)
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter reference token..."
              value={searchToken}
              onChange={(e) => setSearchToken(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono text-xs"
            />
            <button
              onClick={handleTrackLookup}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              Track
            </button>
          </div>

          {trackedComplaint && (
            <div className="bg-[#070D18] border border-slate-800 rounded-xl p-5 space-y-4 animate-in fade-in">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <span className="font-mono text-sm font-bold text-cyan-400">
                    {trackedComplaint.id}
                  </span>
                  <h3 className="font-bold text-white text-xs mt-1">
                    {trackedComplaint.roadName} &bull; {trackedComplaint.landmark}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Logged: {trackedComplaint.submittedAt}
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {trackedComplaint.status}
                </span>
              </div>

              {/* Progress Milestones */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>1. Grievance Logged & Geotagged into Guwahati Joint Cell</span>
                </div>
                <div className="flex items-center gap-3 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>2. AI Vision Triage: Confirmed Pothole (Severity: Critical Level 4)</span>
                </div>
                <div className="flex items-center gap-3 text-cyan-300 font-semibold animate-pulse">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>3. Field Inspection & Mobile Vision Unit Dispatched</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px]">
                    4
                  </span>
                  <span>4. Repair Work Order Certified & Closed</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. ADMINISTRATIVE TRIAGE WORKFLOW */}
      {activeTab === 'adminTriage' && (
        <div className="bg-[#0A1220] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white">
              PWrD Road Safety Cell &bull; Grievance Intake Triage Desk
            </h3>
            <p className="text-xs text-slate-400">
              Verify incoming citizen photographs and coordinates before admitting into the official Assam PWrD Defect Register
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#070D18] text-slate-400 font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Reference Token</th>
                  <th className="p-3">Corridor & Landmark</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Photo Evidence</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Administrative Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-mono font-bold text-cyan-400">{c.id}</td>
                    <td className="p-3">
                      <div className="font-bold text-white">{c.roadName}</div>
                      <div className="text-[11px] text-slate-400">{c.landmark}</div>
                    </td>
                    <td className="p-3 font-mono">{c.damageType}</td>
                    <td className="p-3">
                      <img src={c.photoUrl} alt="Complaint" className="w-12 h-10 object-cover rounded border border-slate-700" />
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.adminDecision === 'Approved'
                          ? 'bg-emerald-950 text-emerald-300'
                          : c.adminDecision === 'Rejected'
                          ? 'bg-red-950 text-red-300'
                          : 'bg-amber-950 text-amber-300'
                      }`}>
                        {c.adminDecision || c.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {!c.adminDecision ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleAdminTriage(c.id, 'Approved')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAdminTriage(c.id, 'Rejected')}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Action Logged</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
