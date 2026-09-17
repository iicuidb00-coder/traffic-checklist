export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { encodeSession, SessionUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { memberId, authCode } = await req.json()
  if (!memberId || !authCode) return NextResponse.json({ error: 'missing_params' }, { status: 400 })
  const cleanId = memberId.replace(/-/g, '')
  try {
    const body = new URLSearchParams({
      service_name: process.env.OTP_SITE_NAME!,
      member_id: cleanId,
      auth_code: authCode,
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
    if (data.result !== 'success') {
      return NextResponse.json({ error: data.data ?? 'invalid_code' }, { status: 401 })
    }
    let user = await prisma.user.findUnique({ where: { zionNewNo: cleanId }, include: { church: true } })
    if (!user) {
      user = await prisma.user.create({ data: { zionNewNo: cleanId, name: cleanId }, include: { church: true } })
    }
    const church = user.church as { name: string } | null
    const session: SessionUser = {
      zionNewNo: cleanId,
      name: user.name,
      role: user.role as 'member' | 'manager' | 'admin',
      churchId: user.churchId,
      churchName: church?.name ?? null,
    }
    const response = NextResponse.json({ ok: true })
    response.cookies.set('session', encodeSession(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12,
    })
    return response
  } catch (e) {
    console.error('[otp-verify]', (e as Error).message)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
