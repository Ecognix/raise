export type DefectClassCode =
  | 'P01' // Pothole
  | 'C01' // Longitudinal crack
  | 'C02' // Transverse crack
  | 'C03' // Alligator (fatigue) cracking
  | 'C04' // Block (map) cracking
  | 'C05' // Edge crack
  | 'S01' // Ravelling (loss of surface stones)
  | 'S02' // Bleeding (excess bitumen)
  | 'D01' // Rutting
  | 'D02' // Depression or settlement
  | 'D03' // Shoving or corrugation
  | 'E01' // Edge break
  | 'T01' // Patch (sound)
  | 'T02'; // Failed patch

export interface DefectClassMeta {
  code: DefectClassCode;
  name: string;
  category: 'Pothole' | 'Cracking' | 'Surface Wear' | 'Deformation' | 'Edge' | 'Patch';
  description: string;
}

export type Severity = 'low' | 'medium' | 'high' | 'good' | 'moderate' | 'severe';

export type DefectLifecycleState =
  | 'New'
  | 'Under review'
  | 'Confirmed'
  | 'Rejected'
  | 'Assigned for repair'
  | 'Repair claimed'
  | 'Repair verified'
  | 'Reappeared'
  | 'Possibly repaired';

// For backward compatibility
export type DefectStatus =
  | 'AI-detected'
  | 'Field-verified'
  | 'Repaired'
  | 'Assigned'
  | 'Verified after repair'
  | DefectLifecycleState;

export type DefectType =
  | 'pothole'
  | 'crack'
  | 'surface_wear'
  | 'drain_blockage'
  | DefectClassCode;

export type VehicleStatus = 'online' | 'offline' | 'dead_zone';

export type VehicleType =
  | 'PWD Inspection Jeep'
  | 'GMC Municipal Tipper Truck'
  | 'City Transit Surveillance Bus'
  | 'Rapid Response Patrol';

export interface Vehicle {
  id: string; // e.g. "V-001"
  registrationNumber: string; // e.g. "AS-01-GB-4120"
  department: string; // "PWrD Guwahati Division", "GMC", etc.
  vehicleType: VehicleType;
  status: VehicleStatus;
  coordinates: [number, number];
  speedKmh: number;
  heading: number;
  signalStrengthDbm: number; // e.g. -78 dBm
  signalBars: number; // 1 to 4
  lastReportTime: string; // HH:MM:SS
  lastUploadTime: string; // Last batch sync
  detectionsToday: number;
  queuedEventsCount: number; // Stored offline in dead zone
  cameraStatus: 'Normal 60fps' | 'Degraded' | 'Offline';
  gnssQuality: 'RTK Fixed (8mm)' | 'DGPS (0.3m)' | 'Standard 3D (1.8m)';
  edgeComputerHealth: 'Optimal' | 'Thermal Throttled' | 'Warning';
  temperatureC: number;
  batteryVoltage: number;
  modelVersion: string;
  storageUsedGb: number;
  storageTotalGb: number;
  dataUsedMbToday: number;
  currentRoadName?: string;
  driverName?: string;
}

export interface DefectStatusHistoryEntry {
  state: DefectLifecycleState;
  date: string;
  changedBy: string;
  notes?: string;
}

export interface Defect {
  id: string;
  code: DefectClassCode;
  name: string;
  defectType?: DefectType;
  roadId: string;
  roadName: string;
  locationArea: string;
  chainageKm: number;
  coordinates: [number, number];
  severity: Severity;
  overallSeverity?: Severity;
  lifecycleState: DefectLifecycleState;
  status?: DefectStatus;
  source: 'AI-generated' | 'Field-verified';
  confidence: number; // 0.0 - 1.0
  areaSqM: number;
  depthMm: number;
  depthCm?: number;
  crackWidthMm?: number;
  crackExtentPercent?: number;
  firstSeenDate: string;
  lastSeenDate: string;
  dateDetected?: string;
  seenAgainCount: number;
  isWorsening: boolean;
  reappeared?: boolean;
  reappearedWithin12m?: boolean;
  gpsAccuracyM: number;
  detectingVehicleId: string;
  modelVersion: string;
  statusHistory: DefectStatusHistoryEntry[];
  assignedTeam?: string;
  estimatedCost?: number;
  estimatedRepairCost?: number;
  suggestedTreatment?: string;
  verifiedBy?: string;
  verificationDate?: string;
  verifiedDate?: string;
  notes?: string;
  imageUrl?: string;
  repairedImageUrl?: string;
  boundingBox?: { x: number; y: number; width: number; height: number };
}

export type RoadCategory =
  | 'State Highway'
  | 'Major District Road'
  | 'Urban Arterial'
  | 'Feeder Road'
  | 'Rural Link';

export interface RoadSegment {
  id: string;
  name: string;
  category: RoadCategory;
  division: 'Guwahati Central' | 'Dispur Capital' | 'Guwahati West' | 'Guwahati East' | 'North Guwahati';
  ownership: string;
  lengthKm: number;
  conditionScore: number; // 0 (ruined) to 100 (flawless)
  overallSeverity?: Severity;
  coordinates: [number, number][];
  locationArea: string;
  contractor: string;
  contractorDocumented: boolean;
  completionYear: number;
  lastResurfaced: string;
  recurringRepairsCount: number;
  villagesDependent: number;
  populationServed: number;
  hospitalSchoolAccess: boolean;
  hospitalNames?: string[];
  alternativeRouteAvailable: boolean;
  detourDistanceKm: number;
  floodRiskLevel: 'High' | 'Medium' | 'Low';
  cutOffRiskNotes?: string;
  trafficLevel: 'Very High' | 'High' | 'Moderate' | 'Low';
  drainageCondition: 'Good' | 'Inadequate' | 'Blocked';
  detectionsTodayCount: number;
  potholesLast24hCount: number;
}

export interface DrainCulvert {
  id: string;
  name: string;
  locationArea: string;
  coordinates: [number, number];
  condition: 'clear' | 'partially_blocked' | 'blocked';
  lastCleanedDate: string;
  recurringWaterlogging: boolean;
  catchmentRoadId: string;
  catchmentRoadName: string;
  structuralType: 'Open Drain' | 'Box Culvert' | 'Pipe Culvert' | 'Natural Channel';
  siltingPercentage: number;
  connectedWaterBody: string;
  waterLevelMeters?: number;
  waterLevelNormalMeters?: number;
}

export interface RainfallRecord {
  month: string;
  recordedMm: number;
  averageMm: number;
  alertThresholdMm: number;
  floodIncidents: number;
}

export interface MaintenanceKanbanCard {
  id: string;
  defectId: string;
  roadId: string;
  roadName: string;
  defectType: DefectType;
  severity: Severity;
  status: 'Detected' | 'Verified' | 'Assigned' | 'Repaired' | 'Verified after repair';
  estimatedCost: number;
  assignedTeam: string;
  reappeared: boolean;
  detectedDate: string;
  repairDate?: string;
  beforePhoto: string;
  afterPhoto?: string;
  contractorNotes?: string;
}

export interface LiveEvent {
  id: string;
  timestamp: string; // e.g. "09:42:15"
  fullIso: string;
  type: 'defect_detected' | 'vehicle_status' | 'threshold_alert' | 'review_action';
  vehicleId?: string;
  roadName: string;
  locationArea: string;
  severity?: Severity;
  defectType?: string;
  defectCode?: DefectClassCode;
  message: string;
  isNew: boolean; // new defect vs seen again
  worsening?: boolean;
}

export interface WeatherForecastArea {
  areaName: string;
  district: string;
  coordinates: [number, number];
  rainfall24hMm: number;
  rainfall48hMm: number;
  rainfall72hMm: number;
  rainfallCategory: 'Light' | 'Moderate' | 'Heavy' | 'Very Heavy' | 'Extremely Heavy';
  forecastSource: 'IMD Regional Met Centre Guwahati + INSAT-3DR Satellite Precipitation';
  alertActive: boolean;
  alertHeadline?: string;
}

export interface DefectGrowthRiskSettings {
  potholeWeight: number;
  alligatorCrackWeight: number;
  edgeBreakWeight: number;
  rainfallWeight: number;
  drainageWeight: number;
  trafficWeight: number;
  defectAgeWeight: number;
}

export interface LifelineWeights {
  conditionWeight: number; // 0.30
  populationWeight: number; // 0.20
  criticalFacilityWeight: number; // 0.20
  lackOfAlternativesWeight: number; // 0.15
  floodExposureWeight: number; // 0.10
  safetyWeight: number; // 0.05
  hospitalSchoolWeight?: number;
  detourPenaltyWeight?: number;
}

export type AppRole =
  | 'Field Engineer'
  | 'Supervisor'
  | 'Administrator'
  | 'Read-only Officer';

export type Language = 'en' | 'as';
