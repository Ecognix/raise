import { RoadSegment, LifelineWeights } from '../types';
export * from './roadsData';
export * from './defectsData';
export * from './drainsData';
export * from './rainfallData';
export * from './repairsData';

export interface LifelineScoreBreakdown {
  road: RoadSegment;
  distressComponent: number;
  hospitalComponent: number;
  populationComponent: number;
  detourComponent: number;
  totalScore: number;
}

export const defaultLifelineWeights: LifelineWeights = {
  conditionWeight: 30,
  populationWeight: 20,
  criticalFacilityWeight: 20,
  lackOfAlternativesWeight: 15,
  floodExposureWeight: 10,
  safetyWeight: 5,
  hospitalSchoolWeight: 25,
  detourPenaltyWeight: 20,
};

export function calculateLifelineScore(
  road: RoadSegment,
  weights: LifelineWeights = defaultLifelineWeights
): LifelineScoreBreakdown {
  // 1. Physical Distress (0 - 100): Lower condition score means higher distress/urgency
  const distressRaw = Math.max(0, Math.min(100, 100 - road.conditionScore));

  // 2. Hospital / Emergency Access (0 - 100)
  const hospitalRaw = road.hospitalSchoolAccess ? 100 : 15;

  // 3. Population & Village Dependency (0 - 100)
  // Villages dependent up to 8 max (70% weight), population up to 200,000 max (30% weight)
  const villagePart = Math.min(1, road.villagesDependent / 6) * 60;
  const popPart = Math.min(1, road.populationServed / 150000) * 40;
  const populationRaw = Math.min(100, villagePart + popPart);

  // 4. Detour & Alternative Route Penalty (0 - 100)
  let detourRaw = 0;
  if (!road.alternativeRouteAvailable) {
    // Critical bottleneck: no alternative route
    detourRaw = 55 + Math.min(45, (road.detourDistanceKm / 15) * 45);
  } else {
    // Has alternative route, detour impact is lower
    detourRaw = Math.min(40, (road.detourDistanceKm / 10) * 40);
  }

  const hWeight = weights.hospitalSchoolWeight ?? 25;
  const dWeight = weights.detourPenaltyWeight ?? 20;

  const totalWeight =
    weights.conditionWeight +
    hWeight +
    weights.populationWeight +
    dWeight || 1;

  // Components weighted
  const distressComponent = Math.round((distressRaw * weights.conditionWeight) / totalWeight);
  const hospitalComponent = Math.round((hospitalRaw * hWeight) / totalWeight);
  const populationComponent = Math.round((populationRaw * weights.populationWeight) / totalWeight);
  const detourComponent = Math.round((detourRaw * dWeight) / totalWeight);

  const totalScore = Math.min(100, distressComponent + hospitalComponent + populationComponent + detourComponent);

  return {
    road,
    distressComponent,
    hospitalComponent,
    populationComponent,
    detourComponent,
    totalScore,
  };
}
