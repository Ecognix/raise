import { LiveEvent, Vehicle, Defect } from '../types';
import { initialVehiclesData } from '../data/vehiclesData';

type EventListener = (event: LiveEvent) => void;
type VehiclePositionListener = (vehicles: Vehicle[]) => void;

// Active subscribers
const eventListeners: Set<EventListener> = new Set();
const vehicleListeners: Set<VehiclePositionListener> = new Set();

// In-memory simulation state
let simulatedVehicles: Vehicle[] = initialVehiclesData.map((v) => ({ ...v }));
let streamIntervalId: any = null;
let eventCounter = 100;

// Sample event templates reflecting real Guwahati corridors
const sampleEventsPool = [
  {
    vehicleId: "V-017",
    roadName: "AT Road, Chandmari",
    locationArea: "Chandmari Flyover Approach",
    severity: "high" as const,
    defectType: "Pothole (Depth: 64mm)",
    defectCode: "P01" as const,
    message: "Vehicle V-017 detected a high-severity pothole on AT Road, Chandmari",
    isNew: true
  },
  {
    vehicleId: "V-001",
    roadName: "GS Road",
    locationArea: "Bhangagarh Underpass",
    severity: "medium" as const,
    defectType: "Pothole",
    defectCode: "P01" as const,
    message: "23 potholes detected today on GS Road (Batch sync by Vehicle V-001)",
    isNew: false
  },
  {
    vehicleId: "V-008",
    roadName: "Beltola-Basistha Road",
    locationArea: "Beltola Weekly Market",
    severity: "high" as const,
    defectType: "Subgrade Pothole (Depth: 72mm)",
    defectCode: "P01" as const,
    message: "Vehicle V-008 flagged high-severity crater near Beltola Market square",
    isNew: true
  },
  {
    vehicleId: "V-003",
    roadName: "GMCH Hill Access Road",
    locationArea: "GMCH Emergency Gate Incline",
    severity: "high" as const,
    defectType: "Alligator Fatigue Cracking",
    defectCode: "C03" as const,
    message: "Vehicle V-003 detected alligator crack expansion (16mm) on GMCH Ambulance link",
    isNew: false,
    worsening: true
  },
  {
    vehicleId: "V-004",
    roadName: "RG Baruah Road (Zoo Road)",
    locationArea: "State Zoo Gate",
    severity: "medium" as const,
    defectType: "Pothole (Area: 0.42 sq.m)",
    defectCode: "P01" as const,
    message: "Vehicle V-004 reported ponding pothole opposite State Zoo entrance",
    isNew: true
  },
  {
    vehicleId: "V-007",
    roadName: "Assam Trunk Road (AT Road)",
    locationArea: "Maligaon Gate 4",
    severity: "high" as const,
    defectType: "Wheel-Path Rutting (Depth: 55mm)",
    defectCode: "D01" as const,
    message: "Vehicle V-007 detected heavy-axle rutting on AT Road westbound lane",
    isNew: true
  },
  {
    vehicleId: "V-032",
    roadName: "Garbhanga Forest Road",
    locationArea: "Forest Border Stream",
    severity: "medium" as const,
    defectType: "Offline Store & Forward",
    defectCode: "P01" as const,
    message: "Vehicle V-032 in dead zone: 4 events queued offline for store-and-forward",
    isNew: false
  },
  {
    vehicleId: "V-012",
    roadName: "Chandmari - Noonmati Road",
    locationArea: "Bamunimaidam Industrial",
    severity: "low" as const,
    defectType: "Edge Crack (C05)",
    defectCode: "C05" as const,
    message: "Vehicle V-012 detected shoulder edge crack near Bamunimaidam",
    isNew: true
  }
];

let poolIdx = 0;

const startSimulationStream = () => {
  if (streamIntervalId) return;

  streamIntervalId = setInterval(() => {
    // 1. Move a subset of online vehicles along slight GPS vectors to simulate live traffic
    simulatedVehicles = simulatedVehicles.map((v) => {
      if (v.status !== 'online') return v;
      // Slight motion jitter in direction of heading
      const deltaLat = (Math.sin(Date.now() / 8000 + parseInt(v.id.replace('V-', '')))) * 0.0003;
      const deltaLng = (Math.cos(Date.now() / 8000 + parseInt(v.id.replace('V-', '')))) * 0.0003;
      const newSpeed = Math.max(15, Math.min(50, Math.round(v.speedKmh + (Math.random() * 4 - 2))));

      return {
        ...v,
        coordinates: [+(v.coordinates[0] + deltaLat).toFixed(5), +(v.coordinates[1] + deltaLng).toFixed(5)],
        speedKmh: newSpeed,
        lastReportTime: "Just now"
      };
    });

    // Notify vehicle position subscribers
    vehicleListeners.forEach((listener) => {
      try {
        listener([...simulatedVehicles]);
      } catch (err) {
        console.error("Error in vehicle position listener", err);
      }
    });

    // 2. Emit a live event every cycle
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const template = sampleEventsPool[poolIdx % sampleEventsPool.length];
    poolIdx++;
    eventCounter++;

    const newEvent: LiveEvent = {
      id: `EVT-${Date.now()}-${eventCounter}`,
      timestamp: timeStr,
      fullIso: now.toISOString(),
      type: 'defect_detected',
      vehicleId: template.vehicleId,
      roadName: template.roadName,
      locationArea: template.locationArea,
      severity: template.severity,
      defectType: template.defectType,
      defectCode: template.defectCode,
      message: `${timeStr.substring(0, 5)} ${template.message}`,
      isNew: template.isNew,
      worsening: template.worsening
    };

    // Notify live event subscribers
    eventListeners.forEach((listener) => {
      try {
        listener(newEvent);
      } catch (err) {
        console.error("Error in live event listener", err);
      }
    });
  }, 3500);
};

/**
 * Subscribe to the real-time event stream.
 * Equivalent to WebSocket `ws.addEventListener('message', ...)`
 */
export const subscribeToEvents = (listener: EventListener): (() => void) => {
  eventListeners.add(listener);
  startSimulationStream();

  return () => {
    eventListeners.delete(listener);
  };
};

/**
 * Subscribe to real-time vehicle movement updates.
 */
export const subscribeToVehiclePositions = (listener: VehiclePositionListener): (() => void) => {
  vehicleListeners.add(listener);
  startSimulationStream();

  // Immediately send initial state
  listener([...simulatedVehicles]);

  return () => {
    vehicleListeners.delete(listener);
  };
};

/**
 * Get current vehicles snapshot
 */
export const getLiveVehiclesSnapshot = (): Vehicle[] => {
  return [...simulatedVehicles];
};
