import { Defect } from '../types';

export interface PotholeDemoRecord {
  id: string;
  defectId: string;
  chainage: string; // e.g. "Km 0+420"
  chainageMeters: number; // 420
  lane: 'Left Lane (Inbound)' | 'Right Lane (Outbound)' | 'Centre Wheelpath';
  lengthCm: number;
  widthCm: number;
  depthMm: number;
  surfaceAreaM2: number;
  severity: 'low' | 'moderate' | 'high' | 'severe';
  severityLevel: string; // e.g. "Critical Level 4 (P01)"
  confidenceScore: number; // 98.4
  photoUrl: string;
  depthGrid: number[][]; // 16x16 elevation matrix for 3D generation
  soilSubgradeExposed: boolean;
  waterFilled: boolean;
  recommendedMethod: string;
  requiredMaterials: { name: string; quantity: string; unit: string }[];
  labourRequired: string[];
  estimatedCostInr: number;
  boqItems: {
    itemCode: string;
    description: string;
    quantity: number;
    unit: string;
    rateInr: number;
    amountInr: number;
  }[];
}

// Generate realistic 16x16 depth displacement grid for 3D model
function generateDepthGrid(maxDepthMm: number, roughness = 0.15): number[][] {
  const size = 16;
  const grid: number[][] = [];
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.42;

  for (let i = 0; i < size; i++) {
    const row: number[] = [];
    for (let j = 0; j < size; j++) {
      const dist = Math.sqrt((i - cx) ** 2 + (j - cy) ** 2);
      if (dist < radius) {
        // Parabolic crater profile with natural asymmetric jaggedness
        const normDist = dist / radius;
        const depthFactor = Math.cos(normDist * (Math.PI / 2));
        const noise = (Math.sin(i * 1.5) * Math.cos(j * 1.8) + 1) * roughness;
        const depth = maxDepthMm * (depthFactor + noise * 0.3);
        row.push(Math.min(maxDepthMm * 1.05, Math.max(0, depth)));
      } else {
        // Outside rim roughness
        const rimNoise = Math.random() * (maxDepthMm * 0.04);
        row.push(Math.max(0, rimNoise));
      }
    }
    grid.push(row);
  }
  return grid;
}

export const HIRAKJYOTI_ROAD_META = {
  id: "RAISE-AS-GHY-2026-008741",
  name: "Hirakjyoti Kakati Road",
  location: "By Lane 12, Zoo Road to Japorigog",
  subDivision: "Guwahati City Sub-Division I",
  division: "Guwahati Road Division, PWrD Assam",
  inspectionType: "AI-Powered Road Inspection",
  inspectionStatus: "Demonstration Mode",
  inspectionDate: "2026-11-18",
  monitoredByVehicle: "V-017 (PWD Mobile Vision Unit)",
  totalLengthKm: 3.4,
  totalPotholesDetected: 14,
  totalCracksDetected: 23,
  totalDamagedAreaM2: 48.6,
  averageConditionScore: 64, // 64/100
  criticalDamageLocations: 3,
  estimatedMaintenanceCostInr: 1840000, // ₹18.4 Lakh
  chainageMarkers: [
    { chainage: "0+000", label: "Zoo Road Junction", condition: "good" },
    { chainage: "0+500", label: "By Lane 12 Entry", condition: "moderate" },
    { chainage: "1+200", label: "Apollo Clinic Culvert", condition: "severe" },
    { chainage: "1+800", label: "Pragjyotish Corner", condition: "moderate" },
    { chainage: "2+400", label: "Sarania Stream Bridge", condition: "severe" },
    { chainage: "3+000", label: "Japorigog Junction", condition: "good" },
    { chainage: "3+400", label: "Terminus / NH Connector", condition: "good" },
  ]
};

// 14 Detailed Potholes for Hirakjyoti Kakati Road
export const HIRAKJYOTI_POTHOLES: PotholeDemoRecord[] = [
  {
    id: "HJK-POT-001",
    defectId: "DEF-AS-GHY-008741-01",
    chainage: "Km 0+420",
    chainageMeters: 420,
    lane: "Centre Wheelpath",
    lengthCm: 84,
    widthCm: 62,
    depthMm: 85,
    surfaceAreaM2: 0.52,
    severity: "severe",
    severityLevel: "Critical Level 4 (P01)",
    confidenceScore: 98.4,
    photoUrl: "/images/pothole_big.jpg",
    depthGrid: generateDepthGrid(85),
    soilSubgradeExposed: true,
    waterFilled: false,
    recommendedMethod: "Full-Depth Excavation & Hot Mix Asphalt (HMA) Pavement Infill with Geotextile Underlay",
    requiredMaterials: [
      { name: "Cold/Hot Bituminous Macadam", quantity: "0.22", unit: "m³" },
      { name: "Graded Stone Aggregate (10-20mm)", quantity: "0.15", unit: "m³" },
      { name: "Bitumen Emulsion RS-1 (Tack Coat)", quantity: "1.8", unit: "L" },
      { name: "Woven Geotextile Membrane", quantity: "0.85", unit: "m²" }
    ],
    labourRequired: [
      "1x Gang Lead Foreman",
      "2x Skilled Road Labourers",
      "1x Plate Compactor Operator"
    ],
    estimatedCostInr: 14200,
    boqItems: [
      { itemCode: "SOR-2024-5.1.2", description: "Saw cutting and excavation of damaged bituminous layer to rectangular edges", quantity: 0.52, unit: "m²", rateInr: 450, amountInr: 234 },
      { itemCode: "SOR-2024-5.2.1", description: "Application of rapid setting bituminous emulsion tack coat @ 0.25 kg/m²", quantity: 0.52, unit: "m²", rateInr: 120, amountInr: 62 },
      { itemCode: "SOR-2024-5.4.4", description: "Bituminous Concrete (BC) grade-II infill, compacted to 98% density", quantity: 0.05, unit: "m³", rateInr: 9800, amountInr: 490 },
      { itemCode: "SOR-2024-6.1.1", description: "Compaction with 1.5-tonne vibratory roller including joint sealing", quantity: 1, unit: "LS", rateInr: 12000, amountInr: 12000 },
      { itemCode: "SOR-2024-8.2.1", description: "Traffic signage, diversion cones & night safety reflective barricades", quantity: 1, unit: "LS", rateInr: 1414, amountInr: 1414 }
    ]
  },
  {
    id: "HJK-POT-002",
    defectId: "DEF-AS-GHY-008741-02",
    chainage: "Km 0+810",
    chainageMeters: 810,
    lane: "Left Lane (Inbound)",
    lengthCm: 56,
    widthCm: 48,
    depthMm: 62,
    surfaceAreaM2: 0.27,
    severity: "high",
    severityLevel: "High Severity (P01)",
    confidenceScore: 96.1,
    photoUrl: "/images/potholes_on_asphalt_road_20171023.jpg",
    depthGrid: generateDepthGrid(62),
    soilSubgradeExposed: false,
    waterFilled: false,
    recommendedMethod: "Mechanical Milling, Tack Coat & Semi-Dense Bituminous Concrete (SDBC)",
    requiredMaterials: [
      { name: "Bituminous Concrete Grade-I", quantity: "0.12", unit: "m³" },
      { name: "Emulsion Tack Coat", quantity: "1.0", unit: "L" }
    ],
    labourRequired: ["2x Road Workers", "1x Compactor Operator"],
    estimatedCostInr: 7800,
    boqItems: [
      { itemCode: "SOR-2024-5.1.2", description: "Cutting vertical boundary and cleaning debris", quantity: 0.27, unit: "m²", rateInr: 450, amountInr: 121 },
      { itemCode: "SOR-2024-5.2.1", description: "Tack coat spraying", quantity: 0.27, unit: "m²", rateInr: 120, amountInr: 32 },
      { itemCode: "SOR-2024-5.4.4", description: "Compacted Bituminous Mix filling", quantity: 0.02, unit: "m³", rateInr: 9800, amountInr: 196 },
      { itemCode: "SOR-2024-6.1.1", description: "Compaction and edge seal", quantity: 1, unit: "LS", rateInr: 7451, amountInr: 7451 }
    ]
  },
  {
    id: "HJK-POT-003",
    defectId: "DEF-AS-GHY-008741-03",
    chainage: "Km 1+240",
    chainageMeters: 1240,
    lane: "Right Lane (Outbound)",
    lengthCm: 110,
    widthCm: 92,
    depthMm: 98,
    surfaceAreaM2: 1.01,
    severity: "severe",
    severityLevel: "Critical Level 4 (P01 - Flood Zone)",
    confidenceScore: 99.1,
    photoUrl: "/images/pothole_in_an_asphalt_pavement.jpg",
    depthGrid: generateDepthGrid(98),
    soilSubgradeExposed: true,
    waterFilled: true,
    recommendedMethod: "Drainage Subgrade Reconstruction, Stone Matrix Asphalt (SMA) & Stone Pitching",
    requiredMaterials: [
      { name: "Granular Sub-Base (GSB)", quantity: "0.45", unit: "m³" },
      { name: "Dense Bituminous Macadam (DBM)", quantity: "0.35", unit: "m³" },
      { name: "Polymer Modified Bitumen (PMB-40)", quantity: "3.5", unit: "L" }
    ],
    labourRequired: ["1x Civil Engineer / Supervisor", "4x Labourers", "1x Roller Operator"],
    estimatedCostInr: 28500,
    boqItems: [
      { itemCode: "SOR-2024-4.2.1", description: "Dewatering and excavation of saturated subgrade", quantity: 1.01, unit: "m²", rateInr: 750, amountInr: 757 },
      { itemCode: "SOR-2024-4.5.3", description: "GSB laying and mechanical compaction", quantity: 0.25, unit: "m³", rateInr: 2200, amountInr: 550 },
      { itemCode: "SOR-2024-5.4.1", description: "DBM layer 75mm compacted", quantity: 0.1, unit: "m³", rateInr: 8500, amountInr: 850 },
      { itemCode: "SOR-2024-6.1.1", description: "Surface course and seal coat", quantity: 1, unit: "LS", rateInr: 26343, amountInr: 26343 }
    ]
  },
  {
    id: "HJK-POT-004",
    defectId: "DEF-AS-GHY-008741-04",
    chainage: "Km 1+680",
    chainageMeters: 1680,
    lane: "Left Lane (Inbound)",
    lengthCm: 45,
    widthCm: 38,
    depthMm: 42,
    surfaceAreaM2: 0.17,
    severity: "moderate",
    severityLevel: "Moderate (P01)",
    confidenceScore: 94.7,
    photoUrl: "/images/asphalt_deterioration.jpg",
    depthGrid: generateDepthGrid(42),
    soilSubgradeExposed: false,
    waterFilled: false,
    recommendedMethod: "Spray Injection Pothole Patching with Emulsion & Aggregates",
    requiredMaterials: [
      { name: "Cationic Emulsion", quantity: "4.0", unit: "L" },
      { name: "6mm Crushed Basalt Stone", quantity: "0.08", unit: "m³" }
    ],
    labourRequired: ["2x Patcher Crew Operators"],
    estimatedCostInr: 4200,
    boqItems: [
      { itemCode: "SOR-2024-5.3.3", description: "High-pressure air blowout cleaning and tack coating", quantity: 0.17, unit: "m²", rateInr: 350, amountInr: 60 },
      { itemCode: "SOR-2024-5.5.1", description: "Spray injection polymer patch fill", quantity: 1, unit: "LS", rateInr: 4140, amountInr: 4140 }
    ]
  },
  {
    id: "HJK-POT-005",
    defectId: "DEF-AS-GHY-008741-05",
    chainage: "Km 2+110",
    chainageMeters: 2110,
    lane: "Centre Wheelpath",
    lengthCm: 72,
    widthCm: 55,
    depthMm: 74,
    surfaceAreaM2: 0.40,
    severity: "high",
    severityLevel: "High Severity (P01)",
    confidenceScore: 97.2,
    photoUrl: "/images/pothole_repair.jpg",
    depthGrid: generateDepthGrid(74),
    soilSubgradeExposed: true,
    waterFilled: false,
    recommendedMethod: "Box Cut Patching with Cold Mix Bitumen Formulation",
    requiredMaterials: [
      { name: "Cold Asphalt Mix (IS:16010)", quantity: "0.18", unit: "m³" },
      { name: "Bitumen Primer", quantity: "1.2", unit: "L" }
    ],
    labourRequired: ["2x Skilled Workers", "1x Plate Compactor"],
    estimatedCostInr: 9600,
    boqItems: [
      { itemCode: "SOR-2024-5.1.2", description: "Box cut excavation to 80mm depth", quantity: 0.4, unit: "m²", rateInr: 450, amountInr: 180 },
      { itemCode: "SOR-2024-5.4.2", description: "Cold asphalt mix infill & vibratory plate compaction", quantity: 1, unit: "LS", rateInr: 9420, amountInr: 9420 }
    ]
  },
  {
    id: "HJK-POT-006",
    defectId: "DEF-AS-GHY-008741-06",
    chainage: "Km 2+450",
    chainageMeters: 2450,
    lane: "Right Lane (Outbound)",
    lengthCm: 95,
    widthCm: 80,
    depthMm: 92,
    surfaceAreaM2: 0.76,
    severity: "severe",
    severityLevel: "Critical Level 4 (P01 - Bridge Approach)",
    confidenceScore: 98.8,
    photoUrl: "/images/potholes_on_asphalt_road_20171023.jpg",
    depthGrid: generateDepthGrid(92),
    soilSubgradeExposed: true,
    waterFilled: false,
    recommendedMethod: "Culvert Transition Reconstruction with Reinforced Bituminous Concrete",
    requiredMaterials: [
      { name: "M20 Grade Concrete Transition Pad", quantity: "0.3", unit: "m³" },
      { name: "Dense Bituminous Macadam", quantity: "0.25", unit: "m³" }
    ],
    labourRequired: ["1x Mason Lead", "3x Road Workers", "1x Compactor Operator"],
    estimatedCostInr: 22400,
    boqItems: [
      { itemCode: "SOR-2024-3.1.4", description: "Transition slab re-bedding and joint sealing", quantity: 0.76, unit: "m²", rateInr: 1200, amountInr: 912 },
      { itemCode: "SOR-2024-5.4.1", description: "Asphalt concrete overlay compacted", quantity: 1, unit: "LS", rateInr: 21488, amountInr: 21488 }
    ]
  }
];

// Remaining 8 Potholes summary for the 14 total
for (let i = 7; i <= 14; i++) {
  const depth = 35 + ((i * 7) % 45);
  const chainageM = 2450 + (i - 6) * 110;
  const sev = depth > 70 ? 'severe' : depth > 50 ? 'high' : 'moderate';
  HIRAKJYOTI_POTHOLES.push({
    id: `HJK-POT-00${i}`,
    defectId: `DEF-AS-GHY-008741-${i < 10 ? '0' + i : i}`,
    chainage: `Km ${(chainageM / 1000).toFixed(3)}`,
    chainageMeters: chainageM,
    lane: i % 2 === 0 ? "Left Lane (Inbound)" : "Right Lane (Outbound)",
    lengthCm: 35 + ((i * 9) % 40),
    widthCm: 30 + ((i * 7) % 35),
    depthMm: depth,
    surfaceAreaM2: parseFloat(((35 + ((i * 9) % 40)) * (30 + ((i * 7) % 35)) / 10000).toFixed(2)),
    severity: sev,
    severityLevel: `${sev.toUpperCase()} Severity (P01)`,
    confidenceScore: parseFloat((93.5 + (i * 0.4)).toFixed(1)),
    photoUrl: "/images/pothole_big.jpg",
    depthGrid: generateDepthGrid(depth),
    soilSubgradeExposed: depth > 60,
    waterFilled: false,
    recommendedMethod: "Pothole Box Cutting, Tack Coat and BC Infill",
    requiredMaterials: [
      { name: "Bituminous Concrete", quantity: "0.08", unit: "m³" },
      { name: "Tack Coat Emulsion", quantity: "0.8", unit: "L" }
    ],
    labourRequired: ["2x Road Workers"],
    estimatedCostInr: 5400 + i * 400,
    boqItems: [
      { itemCode: "SOR-2024-5.1.2", description: "Saw cutting and debris cleanout", quantity: 0.25, unit: "m²", rateInr: 450, amountInr: 112 },
      { itemCode: "SOR-2024-5.4.4", description: "Infill and compaction", quantity: 1, unit: "LS", rateInr: 5000 + i * 400, amountInr: 5000 + i * 400 }
    ]
  });
}

// 23 Cracks along Hirakjyoti Kakati Road
export interface CrackDemoRecord {
  id: string;
  chainage: string;
  type: 'Longitudinal Crack (C01)' | 'Transverse Crack (C02)' | 'Alligator / Fatigue Crack (C03)' | 'Edge Crack (C04)';
  severity: 'low' | 'moderate' | 'high';
  lengthM: number;
  widthMm: number;
  confidenceScore: number;
  recommendedTreatment: string;
  costInr: number;
}

export const HIRAKJYOTI_CRACKS: CrackDemoRecord[] = [
  { id: "HJK-CRK-01", chainage: "Km 0+180", type: "Alligator / Fatigue Crack (C03)", severity: "high", lengthM: 14.2, widthMm: 8.5, confidenceScore: 97.4, recommendedTreatment: "Crack milling, geotextile interlay & slurry seal", costInr: 18200 },
  { id: "HJK-CRK-02", chainage: "Km 0+320", type: "Longitudinal Crack (C01)", severity: "moderate", lengthM: 8.4, widthMm: 4.2, confidenceScore: 94.1, recommendedTreatment: "High-pressure blow cleaning & hot-pour polymer sealant", costInr: 4800 },
  { id: "HJK-CRK-03", chainage: "Km 0+650", type: "Transverse Crack (C02)", severity: "moderate", lengthM: 6.8, widthMm: 5.1, confidenceScore: 95.8, recommendedTreatment: "Rout and crack band seal application", costInr: 3900 },
  { id: "HJK-CRK-04", chainage: "Km 0+920", type: "Edge Crack (C04)", severity: "high", lengthM: 22.0, widthMm: 11.0, confidenceScore: 98.2, recommendedTreatment: "Shoulder reinstatement, subbase recompact & edge asphalt patch", costInr: 32000 },
  { id: "HJK-CRK-05", chainage: "Km 1+110", type: "Alligator / Fatigue Crack (C03)", severity: "high", lengthM: 18.5, widthMm: 9.8, confidenceScore: 98.9, recommendedTreatment: "Full-depth mill 50mm and dense bituminous replacement", costInr: 28500 },
  { id: "HJK-CRK-06", chainage: "Km 1+340", type: "Longitudinal Crack (C01)", severity: "low", lengthM: 5.2, widthMm: 2.8, confidenceScore: 91.2, recommendedTreatment: "Cold emulsion injection sealing", costInr: 2100 },
  { id: "HJK-CRK-07", chainage: "Km 1+520", type: "Transverse Crack (C02)", severity: "moderate", lengthM: 7.1, widthMm: 4.8, confidenceScore: 93.6, recommendedTreatment: "Bandage seal with modified bitumen tape", costInr: 4100 },
  { id: "HJK-CRK-08", chainage: "Km 1+780", type: "Alligator / Fatigue Crack (C03)", severity: "high", lengthM: 12.0, widthMm: 8.0, confidenceScore: 96.5, recommendedTreatment: "Surface patching with micro-surfacing emulsion", costInr: 15400 },
  { id: "HJK-CRK-09", chainage: "Km 1+940", type: "Edge Crack (C04)", severity: "moderate", lengthM: 9.6, widthMm: 6.2, confidenceScore: 92.8, recommendedTreatment: "Gravel shoulder dressing & edge tack seal", costInr: 7200 },
  { id: "HJK-CRK-10", chainage: "Km 2+050", type: "Longitudinal Crack (C01)", severity: "low", lengthM: 4.3, widthMm: 2.2, confidenceScore: 90.5, recommendedTreatment: "Preventive fog spray seal", costInr: 1800 },
  { id: "HJK-CRK-11", chainage: "Km 2+210", type: "Alligator / Fatigue Crack (C03)", severity: "high", lengthM: 15.3, widthMm: 9.2, confidenceScore: 97.9, recommendedTreatment: "Milling and 40mm asphalt overlay", costInr: 21000 },
  { id: "HJK-CRK-12", chainage: "Km 2+380", type: "Transverse Crack (C02)", severity: "moderate", lengthM: 6.5, widthMm: 4.5, confidenceScore: 94.0, recommendedTreatment: "Hot-poured rubberized sealant", costInr: 3800 },
  { id: "HJK-CRK-13", chainage: "Km 2+510", type: "Edge Crack (C04)", severity: "high", lengthM: 17.8, widthMm: 10.4, confidenceScore: 98.0, recommendedTreatment: "Re-profiling shoulder with stone aggregate & edge binder", costInr: 24500 },
  { id: "HJK-CRK-14", chainage: "Km 2+680", type: "Longitudinal Crack (C01)", severity: "moderate", lengthM: 7.9, widthMm: 4.0, confidenceScore: 93.1, recommendedTreatment: "Crack filling with CRS-2 bitumen", costInr: 4400 },
  { id: "HJK-CRK-15", chainage: "Km 2+820", type: "Alligator / Fatigue Crack (C03)", severity: "moderate", lengthM: 8.8, widthMm: 5.5, confidenceScore: 94.4, recommendedTreatment: "Polymer-modified slurry seal", costInr: 9600 },
  { id: "HJK-CRK-16", chainage: "Km 2+950", type: "Transverse Crack (C02)", severity: "low", lengthM: 4.0, widthMm: 2.5, confidenceScore: 89.9, recommendedTreatment: "Direct emulsion seal", costInr: 1600 },
  { id: "HJK-CRK-17", chainage: "Km 3+040", type: "Longitudinal Crack (C01)", severity: "low", lengthM: 6.1, widthMm: 2.9, confidenceScore: 91.0, recommendedTreatment: "Routine crack sealing", costInr: 2200 },
  { id: "HJK-CRK-18", chainage: "Km 3+120", type: "Edge Crack (C04)", severity: "moderate", lengthM: 8.2, widthMm: 5.0, confidenceScore: 92.5, recommendedTreatment: "Edge shoulder compaction", costInr: 5800 },
  { id: "HJK-CRK-19", chainage: "Km 3+190", type: "Alligator / Fatigue Crack (C03)", severity: "high", lengthM: 11.4, widthMm: 7.8, confidenceScore: 96.2, recommendedTreatment: "Targeted patch mill & pave", costInr: 14800 },
  { id: "HJK-CRK-20", chainage: "Km 3+250", type: "Transverse Crack (C02)", severity: "low", lengthM: 5.0, widthMm: 3.0, confidenceScore: 90.1, recommendedTreatment: "Hot seal band", costInr: 2000 },
  { id: "HJK-CRK-21", chainage: "Km 3+310", type: "Longitudinal Crack (C01)", severity: "low", lengthM: 4.8, widthMm: 2.6, confidenceScore: 89.5, recommendedTreatment: "Routine inspection & sealing", costInr: 1700 },
  { id: "HJK-CRK-22", chainage: "Km 3+360", type: "Edge Crack (C04)", severity: "low", lengthM: 5.5, widthMm: 3.2, confidenceScore: 90.8, recommendedTreatment: "Shoulder dressing", costInr: 2500 },
  { id: "HJK-CRK-23", chainage: "Km 3+390", type: "Transverse Crack (C02)", severity: "low", lengthM: 4.2, widthMm: 2.8, confidenceScore: 88.9, recommendedTreatment: "Sealant infill", costInr: 1600 },
];

// Helper to retrieve or synthesize full 3D Road Inspection dataset for ANY road
export function getRoadInspectionData(roadId?: string | null, allRoads: any[] = []) {
  if (!roadId || roadId === "RAISE-AS-GHY-2026-008741") {
    return {
      meta: HIRAKJYOTI_ROAD_META,
      potholes: HIRAKJYOTI_POTHOLES,
      cracks: HIRAKJYOTI_CRACKS
    };
  }

  const found = allRoads.find(r => r.id === roadId);
  if (!found) {
    return {
      meta: HIRAKJYOTI_ROAD_META,
      potholes: HIRAKJYOTI_POTHOLES,
      cracks: HIRAKJYOTI_CRACKS
    };
  }

  const lengthKm = found.lengthKm || 3.0;
  const totalMeters = lengthKm * 1000;
  const potholesCount = Math.max(5, found.potholesLast24hCount || Math.round(lengthKm * 3.5));
  const cracksCount = Math.max(8, Math.round(lengthKm * 5.2));
  const criticalCount = found.conditionScore < 60 ? 4 : found.conditionScore < 75 ? 2 : 1;

  // Chainage markers
  const stepKm = lengthKm / 5;
  const markers = [
    { chainage: "0+000", label: "Entry Junction", condition: "good" },
    { chainage: `${stepKm.toFixed(3).replace('.', '+')}`, label: "Sector Junction 1", condition: "moderate" },
    { chainage: `${(stepKm * 2).toFixed(3).replace('.', '+')}`, label: "Commercial Hub / Culvert", condition: "severe" },
    { chainage: `${(stepKm * 3).toFixed(3).replace('.', '+')}`, label: "Middle Segment", condition: "moderate" },
    { chainage: `${(stepKm * 4).toFixed(3).replace('.', '+')}`, label: "Sector Junction 2", condition: "moderate" },
    { chainage: `${lengthKm.toFixed(3).replace('.', '+')}`, label: "Terminus Bypass", condition: "good" }
  ];

  // Dynamic Potholes for this road
  const potholes: PotholeDemoRecord[] = [];
  for (let i = 1; i <= potholesCount; i++) {
    const fraction = (i - 0.4) / potholesCount;
    const chainageM = Math.round(fraction * totalMeters);
    const depth = 40 + ((i * 11) % 55);
    const sev = depth >= 80 ? 'severe' : depth >= 60 ? 'high' : 'moderate';
    const isCrit = i <= criticalCount;

    potholes.push({
      id: `${found.id}-POT-${i < 10 ? '0' + i : i}`,
      defectId: `DEF-${found.id}-${i < 10 ? '0' + i : i}`,
      chainage: `Km ${(chainageM / 1000).toFixed(3)}`,
      chainageMeters: chainageM,
      lane: i % 2 === 0 ? "Left Lane (Inbound)" : i % 3 === 0 ? "Right Lane (Outbound)" : "Centre Wheelpath",
      lengthCm: 45 + ((i * 8) % 45),
      widthCm: 35 + ((i * 6) % 35),
      depthMm: isCrit ? Math.max(85, depth) : depth,
      surfaceAreaM2: parseFloat(((45 + ((i * 8) % 45)) * (35 + ((i * 6) % 35)) / 10000).toFixed(2)),
      severity: isCrit ? 'severe' : (sev as any),
      severityLevel: isCrit ? "Critical Level 4 (P01)" : `${sev.toUpperCase()} Severity (P01)`,
      confidenceScore: parseFloat((94.0 + (i * 0.35) % 5.5).toFixed(1)),
      photoUrl: i % 2 === 0
        ? "/images/pothole_big.jpg"
        : "/images/pothole_in_an_asphalt_pavement.jpg",
      depthGrid: generateDepthGrid(isCrit ? Math.max(85, depth) : depth),
      soilSubgradeExposed: depth > 65,
      waterFilled: found.floodRiskLevel === 'High' && i % 2 === 1,
      recommendedMethod: depth > 75
        ? "Full-Depth Excavation & Hot Mix Asphalt (HMA) Pavement Infill"
        : "Mechanical Milling, Tack Coat & Semi-Dense Bituminous Concrete (SDBC)",
      requiredMaterials: [
        { name: "Bituminous Concrete Grade-I", quantity: "0.15", unit: "m³" },
        { name: "Emulsion Tack Coat RS-1", quantity: "1.2", unit: "L" },
        { name: "Graded Stone Aggregate (10-20mm)", quantity: "0.10", unit: "m³" }
      ],
      labourRequired: ["1x Foreman", "2x Skilled Labourers", "1x Compactor Operator"],
      estimatedCostInr: 6500 + depth * 120,
      boqItems: [
        { itemCode: "SOR-2024-5.1.2", description: "Saw cutting and box excavation of damaged surface", quantity: 0.45, unit: "m²", rateInr: 450, amountInr: 202 },
        { itemCode: "SOR-2024-5.2.1", description: "Tack coat spraying with rapid setting emulsion", quantity: 0.45, unit: "m²", rateInr: 120, amountInr: 54 },
        { itemCode: "SOR-2024-5.4.4", description: "Bituminous Concrete infill compacted to 98% density", quantity: 0.04, unit: "m³", rateInr: 9800, amountInr: 392 },
        { itemCode: "SOR-2024-6.1.1", description: "Mechanical compaction and perimeter seal", quantity: 1, unit: "LS", rateInr: 5500 + depth * 100, amountInr: 5500 + depth * 100 }
      ]
    });
  }

  // Dynamic Cracks
  const cracks: CrackDemoRecord[] = [];
  for (let j = 1; j <= cracksCount; j++) {
    const fraction = (j - 0.5) / cracksCount;
    const chainageM = Math.round(fraction * totalMeters);
    const crackTypes = [
      "Alligator / Fatigue Crack (C03)",
      "Longitudinal Crack (C01)",
      "Transverse Crack (C02)",
      "Edge Crack (C04)"
    ] as const;
    const type = crackTypes[j % crackTypes.length];
    const sev = j % 3 === 0 ? 'high' : j % 2 === 0 ? 'moderate' : 'low';

    cracks.push({
      id: `${found.id}-CRK-${j < 10 ? '0' + j : j}`,
      chainage: `Km ${(chainageM / 1000).toFixed(3)}`,
      type: type as any,
      severity: sev,
      lengthM: parseFloat((4.5 + (j * 1.8) % 15).toFixed(1)),
      widthMm: parseFloat((2.5 + (j * 0.9) % 8).toFixed(1)),
      confidenceScore: parseFloat((91.0 + (j * 0.4) % 8).toFixed(1)),
      recommendedTreatment: sev === 'high' ? "Crack milling, geotextile interlay & slurry seal" : "High-pressure blow cleaning & hot-pour polymer sealant",
      costInr: 2500 + j * 750
    });
  }

  const meta = {
    id: found.id,
    name: found.name,
    location: found.locationArea,
    subDivision: found.division,
    division: "Guwahati Road Division, PWrD Assam",
    inspectionType: "AI-Powered Road Inspection",
    inspectionStatus: "Active Monitored Corridor",
    inspectionDate: "2026-11-19",
    monitoredByVehicle: "V-024 (PWD Mobile Vision Unit)",
    totalLengthKm: lengthKm,
    totalPotholesDetected: potholes.length,
    totalCracksDetected: cracks.length,
    totalDamagedAreaM2: parseFloat((lengthKm * 14.2).toFixed(1)),
    averageConditionScore: found.conditionScore,
    criticalDamageLocations: criticalCount,
    estimatedMaintenanceCostInr: potholes.reduce((sum, p) => sum + p.estimatedCostInr, 0) + 450000,
    chainageMarkers: markers
  };

  return { meta, potholes, cracks };
}

