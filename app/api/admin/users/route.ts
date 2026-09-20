export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const { userId, role, churchId } = await req.json()
  const client = await pool.connect()
  try {
    const { rows } = await client.query(
      `UPDATE users SET
        role = COALESCE($1, role),
        church_id = $2,
        updated_at = NOW()
      WHERE id = $3 RETURNING *`,
      [role ?? null, churchId ?? null, userId]
    )
    const church = rows[0]?.church_id
      ? (await client.query(`SELECT name FROM churches WHERE id = $1`, [rows[0].church_id])).rows[0]
      : null
    return NextResponse.json({
      role: rows[0]?.role,
      churchId: rows[0]?.church_id,
      churchName: church?.name ?? null,
    })
  } finally {
    client.release()
  }
}