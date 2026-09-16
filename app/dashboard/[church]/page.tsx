import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/Sidebar'
import { MonthlyRateChart, FailTypeChart } from '@/components/charts/AchieveRateChart'
import { CHURCHES } from '@/lib/constants'

export default async function ChurchDashboardPage({ params }: { params: { church: string } }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const churchInfo = CHURCHES.find(c => c.code === params.church)
  if (!churchInfo) notFound()

  const church = await prisma.church.findUnique({ where: { code: params.church } })
  if (!church) notFound()

  // 일반 사용자는 자기 교회만
  if (session.role === 'member' && session.churchId !== church.id) redirect('/')

  const year = new Date().getFullYear()

  const items = await prisma.checklistItem.findMany({
    where: { churchId: church.id, year },
    select: { month: true, focusAreaId: true },
  })
  const results = await prisma.checklistResult.findMany({
    where: { churchId: church.id, year },
    select: { month: true, isDone: true, failType: true,
      achieveTypeSchedule: true, achieveTypeIntensive: true, achieveTypeHabit: true, achieveTypeRole: true },
  })

  const months = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1
    const mI = items.filter(x => x.month === m).length
    const mR = results.filter(x => x.month === m)
    const mD = mR.filter(x => x.isDone).length
    return { month: m, label: `${m}월`, total: mI, done: mD, rate: mI > 0 ? Math.round((mD / mI) * 100) : 0 }
  })

  // 분기별
  const quarters = [
    { label: '1분기', months: [1,2,3] }, { label: '2분기', months: [4,5,6] },
    { label: '3분기', months: [7,8,9] }, { label: '4분기', months: [10,11,12] },
  ].map(q => {
    const qI = items.filter(i => q.months.includes(i.month)).length
    const qD = results.filter(r => q.months.includes(r.month) && r.isDone).length
    return { ...q, total: qI, done: qD, rate: qI > 0 ? Math.round((qD / qI) * 100) : 0 }
  })

  // 미달성 유형
  const failCounts: Record<string, number> = {}
  results.filter(r => !r.isDone && r.failType).forEach(r => {
    failCounts[r.failType!] = (failCounts[r.failType!] ?? 0) + 1
  })

  // 달성 유형
  const achieveCounts = {
    '계획준수': results.filter(r => r.isDone && r.achieveTypeSchedule).length,
    '단기집중': results.filter(r => r.isDone && r.achieveTypeIntensive).length,
    '습관기반': results.filter(r => r.isDone && r.achieveTypeHabit).length,
    '역할분담': results.filter(r => r.isDone && r.achieveTypeRole).length,
  }

  const total = items.length
  const done = results.filter(r => r.isDone).length
  const rate = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="flex min-h-screen">
      <Sidebar role={session.role} churchId={session.churchId} />
      <main className="ml-60 flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{church.name} 교회</h1>
            <p className="text-slate-500 text-sm mt-1">{year}년 월간 체크리스트 분석</p>
          </div>
          <a href={`/checklist/${params.church}`}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
            체크리스트 입력 →
          </a>
        </div>

        {/* 연간 요약 */}
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

        {/* 분기별 현황 */}
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

        {/* 월별 차트 */}
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

        {/* 달성 유형 */}
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
