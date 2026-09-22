import pool from '@/lib/db'
import { notFound } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { MonthlyRateChart, FailTypeChart } from '@/components/charts/AchieveRateChart'
import { CHURCHES } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default async function ChurchDashboardPage({ params }: { params: { church: string } }) {
  const session = { role: 'admin', churchId: null, name: '관리자' }
  const churchInfo = CHURCHES.find(c => c.code === params.church)
  if (!churchInfo) notFound()

  const year = new Date().getFullYear()

  let church: { id: string; name: string; code: string } | null = null
  let months: { month: number; label: string; total: number; done: number; rate: number }[] = []
  let quarters: { label: string; total: number; done: number; rate: number }[] = []
  let failCounts: Record<string, number> = {}
  let achieveCounts = { '계획준수': 0, '단기집중': 0, '습관기반': 0, '역할분담': 0 }
  let total = 0, done = 0, rate = 0

  try {
    const client = await pool.connect()
    try {
      const { rows } = await client.query(`SELECT * FROM churches WHERE code = $1`, [params.church])
      church = rows[0] ?? null
      if (church) {
        const { rows: itemRows } = await client.query(
          `SELECT month, focus_area_id FROM checklist_items WHERE church_id = $1 AND year = $2`,
          [church.id, year]
        )
        const { rows: resultRows } = await client.query(
          `SELECT month, is_done, fail_type, achieve_type_schedule, achieve_type_intensive, achieve_type_habit, achieve_type_role
           FROM checklist_results WHERE church_id = $1 AND year = $2`,
          [church.id, year]
        )
        months = Array.from({ length: 12 }, (_, i) => {
          const m = i + 1
          const mI = itemRows.filter((x: { month: number }) => x.month === m).length
          const mR = resultRows.filter((x: { month: number }) => x.month === m)
          const mD = mR.filter((x: { is_done: boolean }) => x.is_done).length
          return { month: m, label: `${m}월`, total: mI, done: mD, rate: mI > 0 ? Math.round((mD / mI) * 100) : 0 }
        })
        quarters = [
          { label: '1분기', months: [1,2,3] },
          { label: '2분기', months: [4,5,6] },
          { label: '3분기', months: [7,8,9] },
          { label: '4분기', months: [10,11,12] },
        ].map(q => {
          const qI = itemRows.filter((i: { month: number }) => q.months.includes(i.month)).length
          const qD = resultRows.filter((r: { month: number; is_done: boolean }) => q.months.includes(r.month) && r.is_done).length
          return { label: q.label, total: qI, done: qD, rate: qI > 0 ? Math.round((qD / qI) * 100) : 0 }
        })
        resultRows.filter((r: { is_done: boolean; fail_type: string }) => !r.is_done && r.fail_type).forEach((r: { fail_type: string }) => {
          failCounts[r.fail_type] = (failCounts[r.fail_type] ?? 0) + 1
        })
        achieveCounts = {
          '계획준수': resultRows.filter((r: { is_done: boolean; achieve_type_schedule: boolean }) => r.is_done && r.achieve_type_schedule).length,
          '단기집중': resultRows.filter((r: { is_done: boolean; achieve_type_intensive: boolean }) => r.is_done && r.achieve_type_intensive).length,
          '습관기반': resultRows.filter((r: { is_done: boolean; achieve_type_habit: boolean }) => r.is_done && r.achieve_type_habit).length,
          '역할분담': resultRows.filter((r: { is_done: boolean; achieve_type_role: boolean }) => r.is_done && r.achieve_type_role).length,
        }
        total = itemRows.length
        done = resultRows.filter((r: { is_done: boolean }) => r.is_done).length
        rate = total > 0 ? Math.round((done / total) * 100) : 0
      }
    } finally {
      client.release()
    }
  } catch {}

  return (
    <div className="flex min-h-screen">
      <Sidebar role={session.role} churchId={session.churchId} />
      <main className="ml-60 flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{churchInfo.name} 교회</h1>
            <p className="text-slate-500 text-sm mt-1">{year}년 월간 체크리스트 분석</p>
          </div>
          <a href={`/checklist/${params.church}`}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
            체크리스트 입력 →
          </a>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: '연간 달성률', value: `${rate}%`, color: 'text-blue-600' },
            { label: '달성 항목', value: `${done}개`, color: 'text-green-600' },
            { label: '미달성 항목', value: `${total - done}개`, color: 'text-red-500' },
            { label: '총 항목', value: `${total}개`, color: 'text-slate-700' },
          ].map(c => (
            <div key={c.label} className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-slate-500 text-xs">{c.label}</p>
              <p className={`text-3xl font-bold mt-1 ${c.color}`}>{c.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {quarters.map(q => (
            <div key={q.label} className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-slate-500 text-xs font-medium">{q.label}</p>
              <p className={`text-2xl font-bold mt-1 ${q.rate >= 80 ? 'text-green-600' : q.rate >= 60 ? 'text-blue-600' : q.rate > 0 ? 'text-amber-600' : 'text-slate-300'}`}>
                {q.rate}%
              </p>
              <p className="text-slate-400 text-xs mt-0.5">{q.done}/{q.total}</p>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full rounded-full bg-blue-500" style={{ width: `${q.rate}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-700 mb-4">월별 달성률</h3>
            <MonthlyRateChart data={months} />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-700 mb-4">미달성 원인 분석</h3>
            <FailTypeChart failCounts={failCounts} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-700 mb-4">달성 유형 분포</h3>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(achieveCounts).map(([k, v]) => (
              <div key={k} className="text-center p-4 bg-slate-50 rounded-xl">
                <p className="text-2xl font-bold text-blue-600">{v}</p>
                <p className="text-sm text-slate-600 mt-1">{k}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}