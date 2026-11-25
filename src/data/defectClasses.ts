import { DefectClassCode, DefectClassMeta } from '../types';

export const DEFECT_CLASSES: Record<DefectClassCode, DefectClassMeta> = {
  P01: {
    code: 'P01',
    name: 'Pothole',
    category: 'Pothole',
    description: 'Bowl-shaped structural hole in pavement resulting from localized fatigue, water infiltration, and traffic displacement.'
  },
  C01: {
    code: 'C01',
    name: 'Longitudinal crack',
    category: 'Cracking',
    description: 'Cracks parallel to pavement centreline caused by poor joint construction, pavement fatigue, or temperature cycles.'
  },
  C02: {
    code: 'C02',
    name: 'Transverse crack',
    category: 'Cracking',
    description: 'Cracks running perpendicular to traffic flow, primarily driven by thermal contraction or underlying joint reflection.'
  },
  C03: {
    code: 'C03',
    name: 'Alligator (fatigue) cracking',
    category: 'Cracking',
    description: 'Interconnected hexagonal polygon cracks resembling reptile skin, indicating critical structural base or subgrade failure.'
  },
  C04: {
    code: 'C04',
    name: 'Block (map) cracking',
    category: 'Cracking',
    description: 'Rectangular crack networks caused by shrinkage of bituminous binder and daily temperature oscillations.'
  },
  C05: {
    code: 'C05',
    name: 'Edge crack',
    category: 'Cracking',
    description: 'Longitudinal cracks within 0.5m of outer shoulder edge caused by lack of lateral shoulder support and heavy axle loading.'
  },
  S01: {
    code: 'S01',
    name: 'Ravelling (loss of surface stones)',
    category: 'Surface Wear',
    description: 'Progressive disintegration of bituminous surface layer through aggregate dislodgement, exposing coarse matrix.'
  },
  S02: {
    code: 'S02',
    name: 'Bleeding (excess bitumen)',
    category: 'Surface Wear',
    description: 'Free bituminous binder upward migration forming a shiny, glass-like film that reduces skid resistance drastically in wet weather.'
  },
  D01: {
    code: 'D01',
    name: 'Rutting',
    category: 'Deformation',
    description: 'Permanent longitudinal surface depression along wheel paths under canalized commercial truck tire loads.'
  },
  D02: {
    code: 'D02',
    name: 'Depression or settlement',
    category: 'Deformation',
    description: 'Localized dip in roadway surface due to sub-base consolidation, trench backfill settlement, or moisture softening.'
  },
  D03: {
    code: 'D03',
    name: 'Shoving or corrugation',
    category: 'Deformation',
    description: 'Plastic wave-like ripple ridges forming at braking zones, bus stops, and steep climbs due to shear instability in asphalt mix.'
  },
  E01: {
    code: 'E01',
    name: 'Edge break',
    category: 'Edge',
    description: 'Shearing and progressive erosion of pavement outer edge due to unpaved shoulder scour and heavy wheel run-offs.'
  },
  T01: {
    code: 'T01',
    name: 'Patch (sound)',
    category: 'Patch',
    description: 'Remedial asphalt or concrete fill that remains structurally level, sealed, and free of distress.'
  },
  T02: {
    code: 'T02',
    name: 'Failed patch',
    category: 'Patch',
    description: 'Previously repaired section exhibiting renewed depression, cracking, edge crumbling, or water seepage.'
  }
};

// Proposed severity criteria rules (as requested: "proposed values, to be confirmed with department standards")
export const SEVERITY_RULES = {
  pothole: {
    area: { low: '< 0.1 m²', medium: '0.1 to 0.5 m²', high: '> 0.5 m²' },
    depth: { low: '< 25 mm', medium: '25 to 50 mm', high: '> 50 mm' },
    ruleNote: 'Higher severity class between area and depth wins.'
  },
  cracks: {
    width: { low: '2 to 6 mm', medium: '> 6 to 19 mm', high: '> 19 mm' },
    extentPer100m: { low: 'Isolated (< 10%)', medium: 'Intermittent (10 to 50%)', high: 'Extensive (> 50%)' }
  },
  confidenceThresholds: {
    queuedAsAiDetected: '>= 0.80',
    flaggedLowConfidence: '0.50 to 0.79',
    discardedBelow: '< 0.50'
  },
  departmentStandardNotice: 'Proposed values, to be confirmed with PWrD Assam department standards.'
};
