import { NextResponse } from 'next/server';
import { BANGKOK_TRANSIT_LINES } from '@/lib/transit-data';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      lastUpdated: new Date().toISOString(),
      data: BANGKOK_TRANSIT_LINES,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
