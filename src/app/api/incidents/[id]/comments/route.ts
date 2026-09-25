import { NextRequest, NextResponse } from 'next/server';
import { addCommentToIncident, getIncidentById } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const incident = await getIncidentById(id);
    if (!incident) {
      return NextResponse.json({ success: false, error: 'Incident not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: incident.comments });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.message || body.message.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Comment message is required' }, { status: 400 });
    }

    const comment = await addCommentToIncident(id, {
      userName: body.userName || 'ประชาชนในพื้นที่',
      message: body.message.trim(),
      isOfficial: body.isOfficial || false,
    });

    if (!comment) {
      return NextResponse.json({ success: false, error: 'Incident not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: comment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
