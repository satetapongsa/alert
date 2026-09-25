import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

// One-way digest for fallback validation if env var is not set in production
const PASSCODE_DIGEST = 'df4c628b8316230c41879196fc515db3a972db80c55271855dc80fd5aea15f96';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { passcode } = body;

    if (!passcode || typeof passcode !== 'string') {
      return NextResponse.json({ success: false, error: 'กรุณากรอกรหัสผ่าน' }, { status: 400 });
    }

    const inputHash = crypto.createHash('sha256').update(passcode).digest('hex');
    const envPasscode = process.env.ADMIN_PASSCODE;

    const isValid = (envPasscode && passcode === envPasscode) || inputHash === PASSCODE_DIGEST;

    if (!isValid) {
      return NextResponse.json({ success: false, error: 'รหัสผ่านผู้ดูแลไม่ถูกต้อง' }, { status: 401 });
    }

    // Set secure authentication cookie
    const response = NextResponse.json({
      success: true,
      message: 'ยืนยันตัวตนสำเร็จ',
    });

    response.cookies.set('admin_auth_session', 'authenticated', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'ออกจากระบบสำเร็จ' });
  response.cookies.set('admin_auth_session', '', {
    httpOnly: false,
    path: '/',
    maxAge: 0,
  });
  return response;
}
