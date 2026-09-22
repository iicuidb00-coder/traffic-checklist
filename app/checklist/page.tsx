import Sidebar from '@/components/Sidebar'
import ChecklistEditor from '@/components/ChecklistEditor'
import { CHURCHES } from '@/lib/constants'
import pool from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function MyChecklistPage({
  searchParams,
}: {
  searchParams: { year?: string; month?: string; church?: string }
}) {
  const session = { role: 'admin', churchId: null, name: '관리자' }
  const now = new Date()
  const year = Number(searchParams.year ?? now.getFullYear())
  const month = Number(searchParams.month ?? (now.getMonth() + 1))
  const churchCode = searchParams.church ?? 'gwangju'

  let church: { id: string; name: string; code: string } | null = null
  let serialized: {
    id: string; title: string; targetDate: string | null; focusAreaId: number
    result: { isDone: boolean; achieveTypes: string[]; failType: string | null; failDetails: string[]; note: string } | null
  }[] = []

  try {
    const client = await pool.connect()
    try {
      const { rows } = await client.query(`SELECT * FROM churches WHERE code = $1`, [churchCode])
      church = rows[0] ?? null
      if (church) {
        const { rows: itemRows } = await client.query(
          `SELECT ci.id, ci.title, ci.target_date, ci.focus_area_id, ci.order,
            cr.is_done, cr.achieve_type_schedule, cr.achieve_type_intensive,
            cr.achieve_type_habit, cr.achieve_type_role, cr.fail_type, cr.note,
            cr.fail_detail_goal_vague, cr.fail_detail_goal_unrealistic, cr.fail_detail_goal_priority,
            cr.fail_detail_no_schedule, cr.fail_detail_no_step_plan, cr.fail_detail_no_assignee,
            cr.fail_detail_work_condition, cr.fail_detail_time_short, cr.fail_detail_no_repeat,
            cr.fail_detail_lost_motivation, cr.fail_detail_postpone, cr.fail_detail_no_mid_check,
            cr.fail_detail_late_response, cr.fail_detail_no_data, cr.fail_detail_no_external,
            cr.fail_detail_no_risk_plan, cr.fail_detail_no_resource, cr.fail_detail_role_dup,
            cr.fail_detail_gap, cr.fail_detail_collapse, cr.fail_detail_delay
          FROM checklist_items ci
          LEFT JOIN checklist_results cr ON ci.id = cr.item_id
          WHERE ci.church_id = $1 AND ci.year = $2 AND ci.month = $3
          ORDER BY ci.focus_area_id, ci.order`,
          [church.id, year, month]
        )
        serialized = itemRows.map(i => ({
          id: i.id,
          title: i.title,
          targetDate: i.target_date ?? null,
          focusAreaId: i.focus_area_id,
          result: i.is_done !== null && i.is_done !== undefined ? {
            isDone: i.is_done,
            achieveTypes: [
              i.achieve_type_schedule ? 'achieveTypeSchedule' : null,
              i.achieve_type_intensive ? 'achieveTypeIntensive' : null,
              i.achieve_type_habit ? 'achieveTypeHabit' : null,
              i.achieve_type_role ? 'achieveTypeRole' : null,
            ].filter(Boolean) as string[],
            failType: i.fail_type ?? null,
            failDetails: [
              i.fail_detail_goal_vague ? 'failDetailGoalVague' : null,
              i.fail_detail_goal_unrealistic ? 'failDetailGoalUnrealistic' : null,
              i.fail_detail_goal_priority ? 'failDetailGoalPriority' : null,
              i.fail_detail_no_schedule ? 'failDetailNoSchedule' : null,
              i.fail_detail_no_step_plan ? 'failDetailNoStepPlan' : null,
              i.fail_detail_no_assignee ? 'failDetailNoAssignee' : null,
              i.fail_detail_work_condition ? 'failDetailWorkCondition' : null,
              i.fail_detail_time_short ? 'failDetailTimeShort' : null,
              i.fail_detail_no_repeat ? 'failDetailNoRepeat' : null,
              i.fail_detail_lost_motivation ? 'failDetailLostMotivation' : null,
              i.fail_detail_postpone ? 'failDetailPostpone' : null,
              i.fail_detail_no_mid_check ? 'failDetailNoMidCheck' : null,
              i.fail_detail_late_response ? 'failDetailLateResponse' : null,
              i.fail_detail_no_data ? 'failDetailNoData' : null,
              i.fail_detail_no_external ? 'failDetailNoExternal' : null,
              i.fail_detail_no_risk_plan ? 'failDetailNoRiskPlan' : null,
              i.fail_detail_no_resource ? 'failDetailNoResource' : null,
              i.fail_detail_role_dup ? 'failDetailRoleDup' : null,
              i.fail_detail_gap ? 'failDetailGap' : null,
              i.fail_detail_collapse ? 'failDetailCollapse' : null,
              i.fail_detail_delay ? 'failDetailDelay' : null,
            ].filter(Boolean) as string[],
            note: i.note ?? '',
          } : null,
        }))
      }
    } finally {
      client.release()
    }
  } catch {}

  const yearOptions = [year - 1, year, year + 1]

  return (
    <div className="app">
      <Sidebar role={session.role} churchId={session.churchId} />
      <div className="main">
        <header className="topbar">
          <div>
            <div className="crumb"><b>{church?.name ?? '교회 선택'}</b> / 월간 체크리스트</div>
            <div className="page-title">{year}년 {month}월 체크리스트</div>
          </div>
          <div className="topbar-spacer" />
          <form method="GET" style={{ display: 'inline', marginRight: 6 }}>
            <input type="hidden" name="year" value={year} />
            <input type="hidden" name="month" value={month} />
            <select name="church" defaultValue={churchCode} className="btn">
              {CHURCHES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          </form>
          <form method="GET" style={{ display: 'inline', marginRight: 6 }}>
            <input type="hidden" name="church" value={churchCode} />
            <input type="hidden" name="month" value={month} />
            <select name="year" defaultValue={year} className="btn">
              {yearOptions.map(y => <option key={y} value={y}>{y}년</option>)}
            </select>
          </form>
          <form method="GET" style={{ display: 'inline' }}>
            <input type="hidden" name="church" value={churchCode} />
            <input type="hidden" name="year" value={year} />
            <select name="month" defaultValue={month} className="btn">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{m}월</option>
              ))}
            </select>
          </form>
        </header>
        <div className="content">
          {church ? (
            <ChecklistEditor
              churchId={church.id}
              churchName={church.name}
              year={year}
              month={month}
              initialItems={serialized}
            />
          ) : (
            <div className="panel">
              <div className="panel-body" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
                <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>DB가 초기화되지 않았습니다</div>
                <a href="/api/init?secret=peter-init-2024" style={{ color: 'var(--accent)', fontSize: 13 }}>여기를 클릭해서 DB를 초기화</a>하세요
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}