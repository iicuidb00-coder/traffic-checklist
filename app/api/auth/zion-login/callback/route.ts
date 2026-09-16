import { NextRequest, NextResponse } from 'next/server'
import { exchangeToken, fetchZionMe } from '@/lib/zion'
import { prisma } from '@/lib/prisma'
import { encodeSession, SessionUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code) return NextResponse.redirect(new URL('/login?error=no_code', req.url))

  try {
    const { access_token } = await exchangeToken(code)
    const me = await fetchZionMe(access_token)

    if (!me.newNo) return NextResponse.redirect(new URL('/login?error=no_user', req.url))

    // newNo 정규화 (하이픈 제거)
    const zionNewNo = me.newNo.replace(/-/g, '')

    // 사용자 조회 또는 생성
    let user = await prisma.user.findUnique({ where: { zionNewNo }, include: { church: true } })
    if (!user) {
      user = await prisma.user.create({
        data: { zionNewNo, name: me.name ?? '사용자' },
        include: { church: true },
      })
    } else if (me.name && user.name !== me.name) {
      user = await prisma.user.update({
        where: { zionNewNo },
        data: { name: me.name },
        include: { church: true },
      })
    }

    const session: SessionUser = {
      zionNewNo,
      name: user.name,
      role: user.role as 'member' | 'manager' | 'admin',
      churchId: user.churchId,
      churchName: user.church?.name ?? null,
    }

    const res = NextResponse.redirect(new URL('/', req.url))
    res.cookies.set('session', encodeSession(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12, // 12시간
    })
    return res
  } catch (e) {
    console.error('[zion-callback]', (e as Error).message)
    return NextResponse.redirect(new URL('/login?error=auth_failed', req.url))
  }
}
