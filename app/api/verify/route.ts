import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { license_key } = await req.json();

    if (!license_key || typeof license_key !== 'string' || license_key.trim().length < 5) {
      return NextResponse.json({ success: false, error: 'Invalid license key' }, { status: 400 });
    }

    const res = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        product_id: 'nichehunt',
        license_key: license_key.trim(),
      }),
    });

    const data = await res.json();

    if (data.success) {
      return NextResponse.json({
        success: true,
        email: data.purchase?.email,
      });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid or already-refunded license key' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 });
  }
}
