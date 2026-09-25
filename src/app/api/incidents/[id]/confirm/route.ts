import { NextRequest, NextResponse } from 'next/server';
import { confirmIncident } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const userName = body.userName || 'ผู้ใช้งานทั่วไป';

    const updated = await confirmIncident(id, userName);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Incident not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'ยืนยันสถานะเหตุการณ์เรียบร้อยแล้ว',
      data: updated,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
