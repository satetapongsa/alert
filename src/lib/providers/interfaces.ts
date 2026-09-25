import { FloodDetails, TrafficDetails, TransportLine, Incident } from '@/types';

export interface TrafficProvider {
  getTrafficData(): Promise<Array<{
    roadName: string;
    details: TrafficDetails;
    coordinates: [number, number];
  }>>;
}

export interface FloodProvider {
  getWaterLevelReports(): Promise<Array<{
    locationName: string;
    waterLevelCm: number;
    coordinates: [number, number];
    updatedAt: string;
  }>>;
}

export interface TransitProvider {
  getTransitStatus(): Promise<TransportLine[]>;
  getTransitAlerts(): Promise<Array<{
    lineId: string;
    message: string;
    severity: string;
  }>>;
}

export interface WeatherProvider {
  getRainRadarAlerts(): Promise<Array<{
    area: string;
    intensity: 'LIGHT' | 'MODERATE' | 'HEAVY' | 'STORM';
    coordinates: [number, number];
  }>>;
}
