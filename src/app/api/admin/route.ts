import { NextRequest, NextResponse } from 'next/server';
import { getAllIncidents, getAuditLogs, resolveIncident, deleteIncident } from '@/lib/db';

export async function GET() {
  try {
    const incidents = await getAllIncidents();
    const logs = await getAuditLogs();

    return NextResponse.json({
      success: true,
      incidents,
      auditLogs: logs,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, incidentId, adminName } = body;

    if (action === 'RESOLVE') {
      const updated = await resolveIncident(incidentId, adminName || 'Admin');
      return NextResponse.json({ success: true, data: updated });
    }

    if (action === 'DELETE') {
      const ok = await deleteIncident(incidentId, adminName || 'Admin');
      return NextResponse.json({ success: ok });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
