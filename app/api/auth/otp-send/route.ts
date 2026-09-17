export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { memberId } = await req.json()
  if (!memberId) return NextResponse.json({ error: 'member_id_required' }, { status: 400 })
  const cleanId = memberId.replace(/-/g, '')
  try {
    const body = new URLSearchParams({
      service_name: process.env.OTP_SITE_NAME!,
      member_id: cleanId,
    })
    const res = await fetch(process.env.OTP_API_BASE_URL!, {
      method: 'POST',
      headers: {
        'X-OTP-Request-Token': process.env.OTP_API_REQUEST_TOKEN!,
        'X-API-Key': process.env.OTP_API_KEY!,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    })
    const data = await res.json()
    if (data.result === 'success') {
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: data.data ?? 'send_failed' }, { status: 400 })
  } catch (e) {
    console.error('[otp-send]', (e as Error).message)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
