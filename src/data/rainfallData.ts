import { RainfallRecord } from '../types';

export const rainfallData: RainfallRecord[] = [
  { month: "Jan", recordedMm: 12.4, averageMm: 15.0, alertThresholdMm: 120, floodIncidents: 0 },
  { month: "Feb", recordedMm: 24.1, averageMm: 25.0, alertThresholdMm: 120, floodIncidents: 0 },
  { month: "Mar", recordedMm: 68.5, averageMm: 55.0, alertThresholdMm: 120, floodIncidents: 1 },
  { month: "Apr", recordedMm: 145.2, averageMm: 130.0, alertThresholdMm: 120, floodIncidents: 3 },
  { month: "May", recordedMm: 240.8, averageMm: 210.0, alertThresholdMm: 120, floodIncidents: 7 },
  { month: "Jun", recordedMm: 385.6, averageMm: 310.0, alertThresholdMm: 120, floodIncidents: 14 },
  { month: "Jul", recordedMm: 420.2, averageMm: 340.0, alertThresholdMm: 120, floodIncidents: 18 },
  { month: "Aug", recordedMm: 365.0, averageMm: 290.0, alertThresholdMm: 120, floodIncidents: 12 },
  { month: "Sep", recordedMm: 210.5, averageMm: 195.0, alertThresholdMm: 120, floodIncidents: 6 },
  { month: "Oct", recordedMm: 95.0, averageMm: 90.0, alertThresholdMm: 120, floodIncidents: 2 },
  { month: "Nov", recordedMm: 18.2, averageMm: 20.0, alertThresholdMm: 120, floodIncidents: 0 },
  { month: "Dec", recordedMm: 8.6, averageMm: 10.0, alertThresholdMm: 120, floodIncidents: 0 }
];

export const monthlyDefectsTrend = [
  { month: "Nov 2023", detected: 28, repaired: 24 },
  { month: "Dec 2023", detected: 22, repaired: 26 },
  { month: "Jan 2024", detected: 19, repaired: 22 },
  { month: "Feb 2024", detected: 31, repaired: 25 },
  { month: "Mar 2024", detected: 48, repaired: 34 },
  { month: "Apr 2024", detected: 64, repaired: 42 },
  { month: "May 2024", detected: 78, repaired: 51 }
];
