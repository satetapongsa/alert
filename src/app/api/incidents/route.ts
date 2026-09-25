import { NextRequest, NextResponse } from 'next/server';
import { getAllIncidents, createIncident } from '@/lib/db';
import { calculateDistanceKm, isNearby } from '@/lib/utils';
import { IncidentType, Severity, IncidentStatus } from '@/types';
import { z } from 'zod';

const createIncidentSchema = z.object({
  type: z.enum(['FLOOD', 'TRAFFIC', 'ACCIDENT', 'ROAD_CLOSED', 'TRANSIT', 'EMERGENCY', 'GENERAL']),
  title: z.string().min(3).max(150),
  description: z.string().min(5).max(1000),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  locationName: z.string().min(2).max(200),
  district: z.string().optional(),
  province: z.string().default('กรุงเทพมหานคร'),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  source: z.enum(['COMMUNITY', 'EXTERNAL_API', 'VERIFIED_AGENCY']).default('COMMUNITY'),
  confidence: z.enum(['LOW', 'MEDIUM', 'COMMUNITY_VERIFIED', 'OFFICIAL_VERIFIED']).default('MEDIUM'),
  createdByName: z.string().optional(),
  images: z.array(z.any()).optional(),
  floodDetails: z.any().optional(),
  trafficDetails: z.any().optional(),
  transitDetails: z.any().optional(),
});

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const typeParam = searchParams.get('type');
    const severityParam = searchParams.get('severity');
    const statusParam = searchParams.get('status');
    const query = searchParams.get('q')?.toLowerCase();
    const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null;
    const lng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : null;
    const radius = searchParams.get('radius') ? parseFloat(searchParams.get('radius')!) : null;

    let incidents = await getAllIncidents();

    // Filter by type
    if (typeParam && typeParam !== 'ALL') {
      const types = typeParam.split(',') as IncidentType[];
      incidents = incidents.filter((i) => types.includes(i.type));
    }

    // Filter by severity
    if (severityParam && severityParam !== 'ALL') {
      const severities = severityParam.split(',') as Severity[];
      incidents = incidents.filter((i) => severities.includes(i.severity));
    }

    // Filter by status
    if (statusParam && statusParam !== 'ALL') {
      const statuses = statusParam.split(',') as IncidentStatus[];
      incidents = incidents.filter((i) => statuses.includes(i.status));
    }

    // Filter by search text
    if (query) {
      incidents = incidents.filter(
        (i) =>
          i.title.toLowerCase().includes(query) ||
          i.description.toLowerCase().includes(query) ||
          i.locationName.toLowerCase().includes(query) ||
          (i.district && i.district.toLowerCase().includes(query))
      );
    }

    // Filter by radius from lat/lng if provided
    if (lat !== null && lng !== null && radius !== null) {
      incidents = incidents.filter((i) => {
        const dist = calculateDistanceKm(lat, lng, i.latitude, i.longitude);
        return dist <= radius;
      });
    }

    return NextResponse.json({
      success: true,
      count: incidents.length,
      data: incidents,
    });
  } catch (error: any) {
    console.error('Error fetching incidents:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createIncidentSchema.parse(body);

    // Check for duplicate incidents within 300m of the same category
    const all = await getAllIncidents();
    const duplicate = all.find(
      (item) =>
        item.status === 'ACTIVE' &&
        item.type === validatedData.type &&
        isNearby(item.latitude, item.longitude, validatedData.latitude, validatedData.longitude, 350)
    );

    const newIncident = await createIncident({
      ...validatedData,
      status: 'ACTIVE',
      province: validatedData.province || 'กรุงเทพมหานคร',
    });

    return NextResponse.json(
      {
        success: true,
        data: newIncident,
        duplicateWarning: duplicate
          ? {
              possibleDuplicateId: duplicate.id,
              message: `ตรวจพบเหตุการณ์ใกล้เคียงกัน: "${duplicate.title}" (${duplicate.locationName})`,
            }
          : null,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating incident:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
