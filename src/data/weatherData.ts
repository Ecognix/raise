import { WeatherForecastArea, DefectGrowthRiskSettings } from '../types';

export const initialWeatherForecastData: WeatherForecastArea[] = [
  {
    areaName: "Beltola - Basistha",
    district: "Kamrup Metro",
    coordinates: [26.1150, 91.7925],
    rainfall24hMm: 88.5,
    rainfall48hMm: 115.0,
    rainfall72hMm: 62.0,
    rainfallCategory: "Heavy",
    forecastSource: "IMD Regional Met Centre Guwahati + INSAT-3DR Satellite Precipitation",
    alertActive: true,
    alertHeadline: "Heavy rain forecast in Beltola in the next 24 hours (88.5mm). 14 open potholes (6 high severity) may grow larger. Recommended: prioritise patching and check drains."
  },
  {
    areaName: "Zoo Road - Chandmari",
    district: "Kamrup Metro",
    coordinates: [26.1750, 91.7800],
    rainfall24hMm: 74.2,
    rainfall48hMm: 92.0,
    rainfall72hMm: 48.0,
    rainfallCategory: "Heavy",
    forecastSource: "IMD Regional Met Centre Guwahati + INSAT-3DR Satellite Precipitation",
    alertActive: true,
    alertHeadline: "Heavy rain forecast in Zoo Road corridor in next 24 hours (74.2mm). 9 open potholes may deteriorate. Recommended: clear Zoo Tiniali culvert outlet."
  },
  {
    areaName: "Paltan Bazaar - Panbazar",
    district: "Kamrup Metro",
    coordinates: [26.1780, 91.7510],
    rainfall24hMm: 42.0,
    rainfall48hMm: 58.0,
    rainfall72hMm: 31.0,
    rainfallCategory: "Moderate",
    forecastSource: "IMD Regional Met Centre Guwahati + INSAT-3DR Satellite Precipitation",
    alertActive: false
  },
  {
    areaName: "Jalukbari - Maligaon",
    district: "Kamrup Metro",
    coordinates: [26.1580, 91.6850],
    rainfall24hMm: 64.0,
    rainfall48hMm: 85.0,
    rainfall72hMm: 44.0,
    rainfallCategory: "Moderate",
    forecastSource: "IMD Regional Met Centre Guwahati + INSAT-3DR Satellite Precipitation",
    alertActive: true,
    alertHeadline: "Moderate to heavy rain forecast for Maligaon corridor (64mm). Bharalu river backflow risk high."
  },
  {
    areaName: "Dispur - Ganeshguri",
    district: "Kamrup Metro",
    coordinates: [26.1450, 91.7850],
    rainfall24hMm: 52.0,
    rainfall48hMm: 68.0,
    rainfall72hMm: 38.0,
    rainfallCategory: "Moderate",
    forecastSource: "IMD Regional Met Centre Guwahati + INSAT-3DR Satellite Precipitation",
    alertActive: false
  },
  {
    areaName: "Pamohi - Deepor Beel Basin",
    district: "Kamrup Metro",
    coordinates: [26.1200, 91.6600],
    rainfall24hMm: 95.0,
    rainfall48hMm: 130.0,
    rainfall72hMm: 75.0,
    rainfallCategory: "Heavy",
    forecastSource: "IMD Regional Met Centre Guwahati + INSAT-3DR Satellite Precipitation",
    alertActive: true,
    alertHeadline: "Heavy catchment rain forecast for Deepor Beel basin (95mm). Embankment overtopping risk. Recommended: deploy sandbag reinforcement."
  },
  {
    areaName: "Six Mile - Panjabari",
    district: "Kamrup Metro",
    coordinates: [26.1320, 91.8100],
    rainfall24hMm: 46.0,
    rainfall48hMm: 61.0,
    rainfall72hMm: 35.0,
    rainfallCategory: "Moderate",
    forecastSource: "IMD Regional Met Centre Guwahati + INSAT-3DR Satellite Precipitation",
    alertActive: false
  },
  {
    areaName: "North Guwahati Riverfront",
    district: "Kamrup Metro",
    coordinates: [26.2050, 91.7500],
    rainfall24hMm: 58.0,
    rainfall48hMm: 76.0,
    rainfall72hMm: 42.0,
    rainfallCategory: "Moderate",
    forecastSource: "IMD Regional Met Centre Guwahati + INSAT-3DR Satellite Precipitation",
    alertActive: false
  }
];

export const defaultDefectGrowthRiskSettings: DefectGrowthRiskSettings = {
  potholeWeight: 0.25,
  alligatorCrackWeight: 0.20,
  edgeBreakWeight: 0.15,
  rainfallWeight: 0.20,
  drainageWeight: 0.10,
  trafficWeight: 0.05,
  defectAgeWeight: 0.05
};

// IMD standard 24h rainfall classifications (proposed defaults, to be confirmed with official IMD standards)
export const IMD_RAINFALL_CLASSES = [
  { category: "Very Light Rain", rangeMm: "0.1 to 2.4 mm/24h", color: "#E2E8F0" },
  { category: "Light Rain", rangeMm: "2.5 to 15.5 mm/24h", color: "#93C5FD" },
  { category: "Moderate Rain", rangeMm: "15.6 to 64.4 mm/24h", color: "#3B82F6" },
  { category: "Heavy Rain", rangeMm: "64.5 to 115.5 mm/24h", color: "#F59E0B" },
  { category: "Very Heavy Rain", rangeMm: "115.6 to 204.4 mm/24h", color: "#EF4444" },
  { category: "Extremely Heavy Rain", rangeMm: "> 204.4 mm/24h", color: "#7F1D1D" }
];
