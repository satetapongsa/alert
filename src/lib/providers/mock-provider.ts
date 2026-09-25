import { TrafficProvider, FloodProvider, TransitProvider, WeatherProvider } from './interfaces';
import { BANGKOK_TRANSIT_LINES } from '../transit-data';
import { TransportLine } from '@/types';

export class MockTrafficProvider implements TrafficProvider {
  async getTrafficData() {
    return [
      {
        roadName: 'ถนนวิภาวดีรังสิต (ขาออก)',
        coordinates: [13.8249, 100.5630] as [number, number],
        details: {
          speedKmh: 12,
          queueLengthKm: 3.4,
          cause: 'อุบัติเหตุรถบรรทุกเสียหลักช่องทางด่วน',
          direction: 'มุ่งหน้ารังสิต-ดอนเมือง',
          trafficLevel: 'STANDSTILL' as const,
        }
      },
      {
        roadName: 'ถนนรัชดาภิเษก หน้าฟอร์จูนทาวน์',
        coordinates: [13.7578, 100.5649] as [number, number],
        details: {
          speedKmh: 18,
          queueLengthKm: 2.1,
          cause: 'ปริมาณรถสะสมช่วงเวลาเร่งด่วน',
          direction: 'มุ่งหน้าแยกอโศก-เพชรบุรี',
          trafficLevel: 'HEAVY' as const,
        }
      },
      {
        roadName: 'ถนนสาทรใต้',
        coordinates: [13.7214, 100.5283] as [number, number],
        details: {
          speedKmh: 15,
          queueLengthKm: 2.8,
          cause: 'ชะลอตัวขึ้นสะพานตากสิน',
          direction: 'มุ่งหน้าฝั่งธนบุรี',
          trafficLevel: 'HEAVY' as const,
        }
      }
    ];
  }
}

export class MockFloodProvider implements FloodProvider {
  async getWaterLevelReports() {
    return [
      {
        locationName: 'ถนนรัชดาภิเษก หน้าศาลอาญา',
        waterLevelCm: 35,
        coordinates: [13.8185, 100.5750] as [number, number],
        updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        locationName: 'ซอยสุขุมวิท 71 (ปรีดี พนมยงค์)',
        waterLevelCm: 25,
        coordinates: [13.7250, 100.5950] as [number, number],
        updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        locationName: 'ถนนแจ้งวัฒนะ บริเวณเมืองทองธานี',
        waterLevelCm: 45,
        coordinates: [13.8990, 100.5480] as [number, number],
        updatedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      }
    ];
  }
}

export class MockTransitProvider implements TransitProvider {
  async getTransitStatus(): Promise<TransportLine[]> {
    return BANGKOK_TRANSIT_LINES;
  }

  async getTransitAlerts() {
    return [
      {
        lineId: 'bts-sukhumvit',
        message: 'BTS สุขุมวิท ขบวนรถล่าช้าช่วง อโศก - พร้อมพงษ์ 5-10 นาที',
        severity: 'MEDIUM',
      }
    ];
  }
}

export class MockWeatherProvider implements WeatherProvider {
  async getRainRadarAlerts() {
    return [
      {
        area: 'เขตจตุจักร - ลาดพร้าว - ดินแดง',
        intensity: 'HEAVY' as const,
        coordinates: [13.8055, 100.5739] as [number, number],
      },
      {
        area: 'เขตบางนา - พระโขนง',
        intensity: 'MODERATE' as const,
        coordinates: [13.6685, 100.6044] as [number, number],
      }
    ];
  }
}
