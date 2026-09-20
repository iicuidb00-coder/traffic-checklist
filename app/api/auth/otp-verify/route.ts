export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { encodeSession, SessionUser } from '@/lib/auth'
import { randomUUID } from 'crypto'

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

    const client = await pool.connect()
    try {
      const { rows } = await client.query(`SELECT * FROM users WHERE zion_new_no = $1`, [cleanId])
      let user = rows[0]
      if (!user) {
        const id = randomUUID()
        const { rows: newRows } = await client.query(
          `INSERT INTO users (id, zion_new_no, name, role) VALUES ($1, $2, $3, 'member') RETURNING *`,
          [id, cleanId, cleanId]
        )
        user = newRows[0]
      }
      const church = user.church_id ? (await client.query(`SELECT * FROM churches WHERE id = $1`, [user.church_id])).rows[0] : null
      const session: SessionUser = {
        zionNewNo: cleanId,
        name: user.name,
        role: user.role as 'member' | 'manager' | 'admin',
        churchId: user.church_id,
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
    } finally {
      client.release()
    }
  } catch (e) {
    console.error('[otp-verify]', (e as Error).message)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}