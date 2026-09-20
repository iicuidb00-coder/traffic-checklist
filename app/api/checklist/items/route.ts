export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { id, title, targetDate } = await req.json()
  const client = await pool.connect()
  try {
    const { rows: items } = await client.query(`SELECT * FROM checklist_items WHERE id = $1`, [id])
    if (!items[0]) return NextResponse.json({ error: 'not found' }, { status: 404 })
    if (session.role === 'member' && session.churchId !== items[0].church_id) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }
    const { rows } = await client.query(
      `UPDATE checklist_items SET title = $1, target_date = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [title, targetDate ?? null, id]
    )
    return NextResponse.json(rows[0])
  } finally {
    client.release()
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await req.json()
  const client = await pool.connect()
  try {
    const { rows: items } = await client.query(`SELECT * FROM checklist_items WHERE id = $1`, [id])
    if (!items[0]) return NextResponse.json({ error: 'not found' }, { status: 404 })
    if (session.role === 'member' && session.churchId !== items[0].church_id) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }
    await client.query(`DELETE FROM checklist_items WHERE id = $1`, [id])
    return NextResponse.json({ ok: true })
  } finally {
    client.release()
  }
}