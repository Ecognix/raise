import {
  Vehicle,
  Defect,
  RoadSegment,
  DrainCulvert,
  WeatherForecastArea,
  DefectLifecycleState
} from '../types';
import { initialVehiclesData } from '../data/vehiclesData';
import { initialDefectsData } from '../data/defectsData';
import { initialRoadsData } from '../data/roadsData';
import { initialDrainsData } from '../data/drainsData';
import { initialWeatherForecastData } from '../data/weatherData';

// Local cache mimicking in-memory backend database
let cachedVehicles: Vehicle[] = [...initialVehiclesData];
let cachedDefects: Defect[] = [...initialDefectsData];
let cachedRoads: RoadSegment[] = [...initialRoadsData];
let cachedDrains: DrainCulvert[] = [...initialDrainsData];
let cachedWeather: WeatherForecastArea[] = [...initialWeatherForecastData];

/**
 * Service methods simulating asynchronous REST API calls.
 * Can be swapped for real fetch('/api/v1/...') or GraphQL queries without changing components.
 */

export const getVehicles = async (): Promise<Vehicle[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...cachedVehicles]), 40);
  });
};

export const getVehicleById = async (id: string): Promise<Vehicle | undefined> => {
  return new Promise((resolve) => {
    const v = cachedVehicles.find((item) => item.id === id);
    resolve(v ? { ...v } : undefined);
  });
};

export const getDefects = async (): Promise<Defect[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...cachedDefects]), 40);
  });
};

export const getDefectById = async (id: string): Promise<Defect | undefined> => {
  return new Promise((resolve) => {
    const d = cachedDefects.find((item) => item.id === id);
    resolve(d ? { ...d } : undefined);
  });
};

export const getRoads = async (): Promise<RoadSegment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...cachedRoads]), 40);
  });
};

export const getRoadById = async (id: string): Promise<RoadSegment | undefined> => {
  return new Promise((resolve) => {
    const r = cachedRoads.find((item) => item.id === id);
    resolve(r ? { ...r } : undefined);
  });
};

export const getDrains = async (): Promise<DrainCulvert[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...cachedDrains]), 40);
  });
};

export const getWeatherForecast = async (): Promise<WeatherForecastArea[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...cachedWeather]), 40);
  });
};

export const verifyDefect = async (
  defectId: string,
  engineerName: string,
  notes?: string
): Promise<Defect> => {
  const index = cachedDefects.findIndex((d) => d.id === defectId);
  if (index === -1) {
    throw new Error(`Defect ${defectId} not found`);
  }
  const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const updated: Defect = {
    ...cachedDefects[index],
    source: 'Field-verified',
    lifecycleState: 'Confirmed',
    status: 'Field-verified',
    verifiedBy: engineerName,
    verifiedDate: dateStr,
    verificationDate: dateStr,
    notes: notes || cachedDefects[index].notes,
    statusHistory: [
      ...cachedDefects[index].statusHistory,
      {
        state: 'Confirmed',
        date: dateStr,
        changedBy: engineerName,
        notes: notes || 'Field verified on-site by PWrD engineer'
      }
    ]
  };
  cachedDefects[index] = updated;
  return updated;
};

export const updateDefectState = async (
  defectId: string,
  newState: DefectLifecycleState,
  changedBy: string,
  notes?: string
): Promise<Defect> => {
  const index = cachedDefects.findIndex((d) => d.id === defectId);
  if (index === -1) {
    throw new Error(`Defect ${defectId} not found`);
  }
  const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const updated: Defect = {
    ...cachedDefects[index],
    lifecycleState: newState,
    status: newState,
    statusHistory: [
      ...cachedDefects[index].statusHistory,
      {
        state: newState,
        date: dateStr,
        changedBy: changedBy,
        notes: notes
      }
    ]
  };
  cachedDefects[index] = updated;
  return updated;
};
