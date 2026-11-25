import React, { useState } from 'react';
import { useRaiseStore } from '../../store/useRaiseStore';
import { translations } from '../../data/translations';
import { Truck, Radio, WifiOff, HardDriveDownload, Search, RefreshCw, Battery, Thermometer } from 'lucide-react';
import { VehicleStatus } from '../../types';

export const FleetStatusPanel: React.FC = () => {
  const { language, vehicles, setSelectedVehicle } = useRaiseStore();
  const t = translations[language];

  const [statusFilter, setStatusFilter] = useState<'ALL' | VehicleStatus>('ALL');
  const [search, setSearch] = useState('');

  const onlineCount = vehicles.filter((v) => v.status === 'online').length;
  const deadZoneCount = vehicles.filter((v) => v.status === 'dead_zone').length;
  const offlineCount = vehicles.filter((v) => v.status === 'offline').length;

  const filteredVehicles = vehicles.filter((v) => {
    if (statusFilter !== 'ALL' && v.status !== statusFilter) return false;
    if (
      search &&
      !v.id.toLowerCase().includes(search.toLowerCase()) &&
      !v.registrationNumber.toLowerCase().includes(search.toLowerCase()) &&
      !v.department.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-white rounded border border-slate-300 shadow-xs p-4 space-y-4 select-none">
      {/* Header and Filter Strips */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#1B2F4B]" />
            {t.fleetStatus} (43 Assigned Units)
          </h3>
          <p className="text-xs text-slate-500">
            Real-time telemetry, store-and-forward dead zone cache, and upload timestamp ledger
          </p>
        </div>

        {/* Status Count Pills */}
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-2.5 py-1 rounded border transition ${
              statusFilter === 'ALL'
                ? 'bg-[#1B2F4B] text-white border-[#1B2F4B]'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            All (43)
          </button>
          <button
            onClick={() => setStatusFilter('online')}
            className={`px-2.5 py-1 rounded border transition flex items-center gap-1 ${
              statusFilter === 'online'
                ? 'bg-emerald-700 text-white border-emerald-800'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Online ({onlineCount})
          </button>
          <button
            onClick={() => setStatusFilter('dead_zone')}
            className={`px-2.5 py-1 rounded border transition flex items-center gap-1 ${
              statusFilter === 'dead_zone'
                ? 'bg-amber-600 text-white border-amber-700'
                : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <HardDriveDownload className="w-3 h-3 text-amber-600" />
            Dead Zone ({deadZoneCount})
          </button>
          <button
            onClick={() => setStatusFilter('offline')}
            className={`px-2.5 py-1 rounded border transition flex items-center gap-1 ${
              statusFilter === 'offline'
                ? 'bg-slate-700 text-white border-slate-800'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <WifiOff className="w-3 h-3 text-slate-500" />
            Offline ({offlineCount})
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vehicle ID, license plate or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1B2F4B]"
          />
        </div>
        <div className="text-[11px] text-slate-500">
          Showing <strong className="text-slate-800">{filteredVehicles.length}</strong> vehicles
        </div>
      </div>

      {/* High-Contrast Table */}
      <div className="overflow-x-auto max-h-72 overflow-y-auto border border-slate-200 rounded">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 bg-slate-100 z-10 border-b border-slate-300">
            <tr className="text-slate-700 font-bold text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3">Vehicle ID & Reg</th>
              <th className="py-2.5 px-3">Type & Department</th>
              <th className="py-2.5 px-2 text-center">Status</th>
              <th className="py-2.5 px-2 text-center">Signal / Speed</th>
              <th className="py-2.5 px-3 text-center">Offline Queued Events</th>
              <th className="py-2.5 px-3">Last Upload Time</th>
              <th className="py-2.5 px-2 text-center">Edge Temp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredVehicles.map((v) => {
              const isOnline = v.status === 'online';
              const isDeadZone = v.status === 'dead_zone';

              return (
                <tr
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  className="hover:bg-slate-50 transition cursor-pointer"
                >
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-[#1B2F4B]">{v.id}</div>
                    <div className="font-mono text-[10px] text-slate-500">{v.registrationNumber}</div>
                  </td>

                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-800">{v.vehicleType}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[180px]">{v.department}</div>
                  </td>

                  <td className="py-2.5 px-2 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isOnline
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : isDeadZone
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isDeadZone ? 'Dead Zone' : v.status}
                    </span>
                  </td>

                  <td className="py-2.5 px-2 text-center font-mono">
                    <div className="font-bold text-slate-800">{v.speedKmh} km/h</div>
                    <div className="text-[10px] text-slate-500">{v.signalBars > 0 ? `${v.signalStrengthDbm} dBm` : 'No Signal'}</div>
                  </td>

                  <td className="py-2.5 px-3 text-center">
                    {v.queuedEventsCount > 0 ? (
                      <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded text-[11px]">
                        <HardDriveDownload className="w-3 h-3 text-amber-700" />
                        {v.queuedEventsCount} events queued
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono">0 (Synced)</span>
                    )}
                  </td>

                  <td className="py-2.5 px-3">
                    <div className="font-mono font-medium text-slate-800 text-[11px]">{v.lastUploadTime}</div>
                    <div className="text-[10px] text-slate-400">Report: {v.lastReportTime}</div>
                  </td>

                  <td className="py-2.5 px-2 text-center font-mono text-[11px] text-slate-700">
                    <span className={v.temperatureC > 45 ? 'text-amber-700 font-bold' : ''}>
                      {v.temperatureC}°C
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
