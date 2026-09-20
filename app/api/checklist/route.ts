export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { getSession } from '@/lib/auth'
import { randomUUID } from 'crypto'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { searchParams } = req.nextUrl
  const churchId = searchParams.get('churchId')
  const year = Number(searchParams.get('year'))
  const month = Number(searchParams.get('month'))
  if (session.role === 'member' && session.churchId !== churchId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const client = await pool.connect()
  try {
    const { rows } = await client.query(
      `SELECT ci.*, fa.code as focus_area_code, fa.name as focus_area_name, fa.order as focus_area_order,
        cr.id as result_id, cr.is_done, cr.achieve_type_schedule, cr.achieve_type_intensive,
        cr.achieve_type_habit, cr.achieve_type_role, cr.fail_type, cr.note,
        cr.fail_detail_goal_vague, cr.fail_detail_goal_unrealistic, cr.fail_detail_goal_priority,
        cr.fail_detail_no_schedule, cr.fail_detail_no_step_plan, cr.fail_detail_no_assignee,
        cr.fail_detail_work_condition, cr.fail_detail_time_short, cr.fail_detail_no_repeat,
        cr.fail_detail_lost_motivation, cr.fail_detail_postpone, cr.fail_detail_no_mid_check,
        cr.fail_detail_late_response, cr.fail_detail_no_data, cr.fail_detail_no_external,
        cr.fail_detail_no_risk_plan, cr.fail_detail_no_resource, cr.fail_detail_role_dup,
        cr.fail_detail_gap, cr.fail_detail_collapse, cr.fail_detail_delay
      FROM checklist_items ci
      LEFT JOIN focus_areas fa ON ci.focus_area_id = fa.id
      LEFT JOIN checklist_results cr ON ci.id = cr.item_id
      WHERE ci.church_id = $1 AND ci.year = $2 AND ci.month = $3
      ORDER BY ci.focus_area_id, ci."order"`,
      [churchId, year, month]
    )
    return NextResponse.json(rows)
  } finally {
    client.release()
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = await req.json()
  const { churchId, focusAreaId, year, month, title, targetDate, order } = body
  if (session.role === 'member' && session.churchId !== churchId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const client = await pool.connect()
  try {
    const id = randomUUID()
    const { rows } = await client.query(
      `INSERT INTO checklist_items (id, church_id, focus_area_id, year, month, title, target_date, "order")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [id, churchId, focusAreaId, year, month, title, targetDate ?? null, order ?? 0]
    )
    return NextResponse.json(rows[0], { status: 201 })
  } finally {
    client.release()
  }
}