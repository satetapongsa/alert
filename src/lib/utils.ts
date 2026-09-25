import { IncidentType, Severity, IncidentStatus, ConfidenceLevel } from '@/types';

/**
 * Format timestamp into Thai relative time (e.g. 5 นาทีที่แล้ว)
 */
export function formatThaiRelativeTime(dateInput: string | Date | number): string {
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 30) return 'เมื่อสักครู่';
  if (diffInSeconds < 60) return `${diffInSeconds} วินาทีที่แล้ว`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} นาทีที่แล้ว`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} วันที่แล้ว`;

  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
  });
}

/**
 * Format full exact Thai timestamp
 */
export function formatThaiExactTime(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return date.toLocaleString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Bangkok',
  }) + ' (GMT+7)';
}

/**
 * Haversine formula to compute distance in kilometers between two GPS coordinates
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} ม.`;
  }
  return `${distanceKm.toFixed(1)} กม.`;
}

/**
 * Category metadata: icon, label, theme color
 */
export const INCIDENT_CONFIG: Record<
  IncidentType,
  {
    label: string;
    icon: string;
    color: string;
    bgBadge: string;
    textBadge?: string;
    markerHex: string;
  }
> = {
  FLOOD: {
    label: 'น้ำท่วม',
    icon: '💧',
    color: 'text-cyan-400',
    bgBadge: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
    markerHex: '#06b6d4',
  },
  TRAFFIC: {
    label: 'รถติด',
    icon: '🚗',
    color: 'text-amber-400',
    bgBadge: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
    markerHex: '#f59e0b',
  },
  ACCIDENT: {
    label: 'อุบัติเหตุ',
    icon: '🚨',
    color: 'text-red-400',
    bgBadge: 'bg-red-500/15 border-red-500/30 text-red-300',
    markerHex: '#ef4444',
  },
  ROAD_CLOSED: {
    label: 'ถนนปิด',
    icon: '🚧',
    color: 'text-orange-400',
    bgBadge: 'bg-orange-500/15 border-orange-500/30 text-orange-300',
    markerHex: '#f97316',
  },
  TRANSIT: {
    label: 'รถไฟฟ้าขัดข้อง',
    icon: '🚇',
    color: 'text-purple-400',
    bgBadge: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
    markerHex: '#a855f7',
  },
  EMERGENCY: {
    label: 'เหตุการณ์ฉุกเฉิน',
    icon: '⚠️',
    color: 'text-rose-400',
    bgBadge: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
    markerHex: '#f43f5e',
  },
  GENERAL: {
    label: 'รายงานทั่วไป',
    icon: '📍',
    color: 'text-blue-400',
    bgBadge: 'bg-blue-500/15 border-blue-500/30 text-blue-300',
    markerHex: '#3b82f6',
  },
};

export const SEVERITY_CONFIG: Record<
  Severity,
  {
    label: string;
    color: string;
    border: string;
    bg: string;
  }
> = {
  LOW: {
    label: 'ต่ำ',
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
  },
  MEDIUM: {
    label: 'ปานกลาง',
    color: 'text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
  },
  HIGH: {
    label: 'สูง',
    color: 'text-orange-400',
    border: 'border-orange-500/30',
    bg: 'bg-orange-500/10',
  },
  CRITICAL: {
    label: 'วิกฤต',
    color: 'text-red-400 animate-pulse',
    border: 'border-red-500/40',
    bg: 'bg-red-500/20',
  },
};

export const STATUS_CONFIG: Record<
  IncidentStatus,
  {
    label: string;
    badge: string;
  }
> = {
  ACTIVE: {
    label: 'ยังเกิดอยู่',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  MONITORING: {
    label: 'เฝ้าระวัง',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  RESOLVED: {
    label: 'คลี่คลายแล้ว',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  EXPIRED: {
    label: 'หมดอายุ',
    badge: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
  },
};

/**
 * Check if a location is near another (within radiusMeters)
 */
export function isNearby(lat1: number, lon1: number, lat2: number, lon2: number, radiusMeters = 300): boolean {
  const km = calculateDistanceKm(lat1, lon1, lat2, lon2);
  return km * 1000 <= radiusMeters;
}
