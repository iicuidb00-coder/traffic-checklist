export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { getSession } from '@/lib/auth'
import { randomUUID } from 'crypto'

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = await req.json()
  const { itemId, isDone, achieveTypes, failType, failDetails, note } = body
  const client = await pool.connect()
  try {
    const { rows: items } = await client.query(`SELECT * FROM checklist_items WHERE id = $1`, [itemId])
    if (!items[0]) return NextResponse.json({ error: 'not found' }, { status: 404 })
    if (session.role === 'member' && session.churchId !== items[0].church_id) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }
    const fd = (k: string) => failDetails?.includes(k) ?? false
    const { rows: existing } = await client.query(`SELECT id FROM checklist_results WHERE item_id = $1`, [itemId])
    if (existing[0]) {
      await client.query(
        `UPDATE checklist_results SET
          is_done=$1, achieve_type_schedule=$2, achieve_type_intensive=$3, achieve_type_habit=$4, achieve_type_role=$5,
          fail_type=$6, fail_detail_goal_vague=$7, fail_detail_goal_unrealistic=$8, fail_detail_goal_priority=$9,
          fail_detail_no_schedule=$10, fail_detail_no_step_plan=$11, fail_detail_no_assignee=$12,
          fail_detail_work_condition=$13, fail_detail_time_short=$14, fail_detail_no_repeat=$15,
          fail_detail_lost_motivation=$16, fail_detail_postpone=$17, fail_detail_no_mid_check=$18,
          fail_detail_late_response=$19, fail_detail_no_data=$20, fail_detail_no_external=$21,
          fail_detail_no_risk_plan=$22, fail_detail_no_resource=$23, fail_detail_role_dup=$24,
          fail_detail_gap=$25, fail_detail_collapse=$26, fail_detail_delay=$27, note=$28, updated_at=NOW()
        WHERE item_id=$29`,
        [isDone, achieveTypes?.includes('achieveTypeSchedule')??false, achieveTypes?.includes('achieveTypeIntensive')??false,
         achieveTypes?.includes('achieveTypeHabit')??false, achieveTypes?.includes('achieveTypeRole')??false,
         isDone ? null : (failType??null),
         fd('failDetailGoalVague'), fd('failDetailGoalUnrealistic'), fd('failDetailGoalPriority'),
         fd('failDetailNoSchedule'), fd('failDetailNoStepPlan'), fd('failDetailNoAssignee'),
         fd('failDetailWorkCondition'), fd('failDetailTimeShort'), fd('failDetailNoRepeat'),
         fd('failDetailLostMotivation'), fd('failDetailPostpone'), fd('failDetailNoMidCheck'),
         fd('failDetailLateResponse'), fd('failDetailNoData'), fd('failDetailNoExternal'),
         fd('failDetailNoRiskPlan'), fd('failDetailNoResource'), fd('failDetailRoleDup'),
         fd('failDetailGap'), fd('failDetailCollapse'), fd('failDetailDelay'),
         note??null, itemId]
      )
    } else {
      await client.query(
        `INSERT INTO checklist_results (id, item_id, church_id, year, month,
          is_done, achieve_type_schedule, achieve_type_intensive, achieve_type_habit, achieve_type_role,
          fail_type, fail_detail_goal_vague, fail_detail_goal_unrealistic, fail_detail_goal_priority,
          fail_detail_no_schedule, fail_detail_no_step_plan, fail_detail_no_assignee,
          fail_detail_work_condition, fail_detail_time_short, fail_detail_no_repeat,
          fail_detail_lost_motivation, fail_detail_postpone, fail_detail_no_mid_check,
          fail_detail_late_response, fail_detail_no_data, fail_detail_no_external,
          fail_detail_no_risk_plan, fail_detail_no_resource, fail_detail_role_dup,
          fail_detail_gap, fail_detail_collapse, fail_detail_delay, note)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33)`,
        [randomUUID(), itemId, items[0].church_id, items[0].year, items[0].month,
         isDone, achieveTypes?.includes('achieveTypeSchedule')??false, achieveTypes?.includes('achieveTypeIntensive')??false,
         achieveTypes?.includes('achieveTypeHabit')??false, achieveTypes?.includes('achieveTypeRole')??false,
         isDone ? null : (failType??null),
         fd('failDetailGoalVague'), fd('failDetailGoalUnrealistic'), fd('failDetailGoalPriority'),
         fd('failDetailNoSchedule'), fd('failDetailNoStepPlan'), fd('failDetailNoAssignee'),
         fd('failDetailWorkCondition'), fd('failDetailTimeShort'), fd('failDetailNoRepeat'),
         fd('failDetailLostMotivation'), fd('failDetailPostpone'), fd('failDetailNoMidCheck'),
         fd('failDetailLateResponse'), fd('failDetailNoData'), fd('failDetailNoExternal'),
         fd('failDetailNoRiskPlan'), fd('failDetailNoResource'), fd('failDetailRoleDup'),
         fd('failDetailGap'), fd('failDetailCollapse'), fd('failDetailDelay'), note??null]
      )
    }
    return NextResponse.json({ ok: true })
  } finally {
    client.release()
  }
}