import { NextResponse } from 'next/server';
import { syncExternalOnlineData } from '@/lib/services/external-sync';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await syncExternalOnlineData();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error syncing external data:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
