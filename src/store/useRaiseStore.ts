import { create } from 'zustand';
import {
  Vehicle,
  Defect,
  RoadSegment,
  DrainCulvert,
  WeatherForecastArea,
  LiveEvent,
  AppRole,
  Language,
  DefectLifecycleState
} from '../types';
import * as api from '../services/api';
import { subscribeToEvents, subscribeToVehiclePositions } from '../services/eventStream';

export interface ActiveMapLayers {
  vehicles: boolean;
  defects: boolean;
  floodZones: boolean;
  drains: boolean;
  weatherRisk: boolean;
}

interface RaiseStoreState {
  // Core datasets
  vehicles: Vehicle[];
  defects: Defect[];
  roads: RoadSegment[];
  drains: DrainCulvert[];
  weatherForecast: WeatherForecastArea[];
  liveEvents: LiveEvent[];

  // App settings & filters
  currentRole: AppRole;
  language: Language;
  selectedDivision: string;
  globalSearchQuery: string;
  lastSyncedTime: string;

  // Selected item drawers/modals
  selectedVehicle: Vehicle | null;
  selectedDefect: Defect | null;
  selectedRoadId: string | null;

  // Active Map Layers
  mapLayers: ActiveMapLayers;

  // Loading state
  isLoading: boolean;
  isStreamConnected: boolean;

  // Actions
  initData: () => Promise<void>;
  setRole: (role: AppRole) => void;
  setLanguage: (lang: Language) => void;
  setSelectedDivision: (div: string) => void;
  setGlobalSearchQuery: (query: string) => void;
  toggleMapLayer: (layer: keyof ActiveMapLayers) => void;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  setSelectedDefect: (defect: Defect | null) => void;
  setSelectedRoadId: (roadId: string | null) => void;
  verifyDefect: (defectId: string, engineerName: string, notes?: string) => Promise<void>;
  updateDefectState: (defectId: string, newState: DefectLifecycleState, notes?: string) => Promise<void>;
}

export const useRaiseStore = create<RaiseStoreState>((set, get) => ({
  vehicles: [],
  defects: [],
  roads: [],
  drains: [],
  weatherForecast: [],
  liveEvents: [
    {
      id: "EVT-INIT-01",
      timestamp: "10:14:20",
      fullIso: new Date().toISOString(),
      type: "defect_detected",
      vehicleId: "V-017",
      roadName: "AT Road, Chandmari",
      locationArea: "Chandmari Flyover Approach",
      severity: "high",
      defectType: "Pothole (Depth: 64mm)",
      defectCode: "P01",
      message: "10:14 Vehicle V-017 detected a high-severity pothole on AT Road, Chandmari",
      isNew: true
    },
    {
      id: "EVT-INIT-02",
      timestamp: "10:12:05",
      fullIso: new Date().toISOString(),
      type: "defect_detected",
      vehicleId: "V-001",
      roadName: "GS Road",
      locationArea: "Bhangagarh Underpass",
      severity: "medium",
      defectType: "Pothole",
      defectCode: "P01",
      message: "10:12 23 potholes detected today on GS Road (Batch sync by Vehicle V-001)",
      isNew: false
    },
    {
      id: "EVT-INIT-03",
      timestamp: "10:09:44",
      fullIso: new Date().toISOString(),
      type: "defect_detected",
      vehicleId: "V-008",
      roadName: "Beltola-Basistha Road",
      locationArea: "Beltola Market Square",
      severity: "high",
      defectType: "Subgrade Pothole",
      defectCode: "P01",
      message: "10:09 Vehicle V-008 flagged high-severity crater near Beltola Market square",
      isNew: true
    }
  ],

  currentRole: 'Field Engineer',
  language: 'en',
  selectedDivision: 'All Divisions (Kamrup Metro)',
  globalSearchQuery: '',
  lastSyncedTime: new Date().toTimeString().split(' ')[0] + ' IST',

  selectedVehicle: null,
  selectedDefect: null,
  selectedRoadId: 'RD-GAU-001',

  mapLayers: {
    vehicles: true,
    defects: true,
    floodZones: true,
    drains: true,
    weatherRisk: true
  },

  isLoading: true,
  isStreamConnected: false,

  initData: async () => {
    set({ isLoading: true });
    try {
      const [vehicles, defects, roads, drains, weatherForecast] = await Promise.all([
        api.getVehicles(),
        api.getDefects(),
        api.getRoads(),
        api.getDrains(),
        api.getWeatherForecast()
      ]);

      set({
        vehicles,
        defects,
        roads,
        drains,
        weatherForecast,
        isLoading: false,
        lastSyncedTime: new Date().toTimeString().split(' ')[0] + ' IST'
      });

      // Connect real-time simulation stream if not already connected
      if (!get().isStreamConnected) {
        subscribeToVehiclePositions((updatedVehicles) => {
          set({
            vehicles: updatedVehicles,
            lastSyncedTime: new Date().toTimeString().split(' ')[0] + ' IST'
          });
        });

        subscribeToEvents((newEvent) => {
          set((state) => ({
            liveEvents: [newEvent, ...state.liveEvents].slice(0, 50),
            lastSyncedTime: new Date().toTimeString().split(' ')[0] + ' IST'
          }));
        });

        set({ isStreamConnected: true });
      }
    } catch (err) {
      console.error("Failed to load initial data", err);
      set({ isLoading: false });
    }
  },

  setRole: (role) => set({ currentRole: role }),
  setLanguage: (lang) => set({ language: lang }),
  setSelectedDivision: (div) => set({ selectedDivision: div }),
  setGlobalSearchQuery: (query) => set({ globalSearchQuery: query }),

  toggleMapLayer: (layer) =>
    set((state) => ({
      mapLayers: {
        ...state.mapLayers,
        [layer]: !state.mapLayers[layer]
      }
    })),

  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
  setSelectedDefect: (defect) => set({ selectedDefect: defect }),
  setSelectedRoadId: (roadId) => set({ selectedRoadId: roadId }),

  verifyDefect: async (defectId, engineerName, notes) => {
    const updated = await api.verifyDefect(defectId, engineerName, notes);
    set((state) => ({
      defects: state.defects.map((d) => (d.id === defectId ? updated : d)),
      selectedDefect: state.selectedDefect?.id === defectId ? updated : state.selectedDefect
    }));
  },

  updateDefectState: async (defectId, newState, notes) => {
    const user = get().currentRole;
    const updated = await api.updateDefectState(defectId, newState, user, notes);
    set((state) => ({
      defects: state.defects.map((d) => (d.id === defectId ? updated : d)),
      selectedDefect: state.selectedDefect?.id === defectId ? updated : state.selectedDefect
    }));
  }
}));
