import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/Sidebar'
import ChecklistEditor from '@/components/ChecklistEditor'
import { CHURCHES } from '@/lib/constants'

export default async function ChurchChecklistPage({
  params, searchParams,
}: { params: { church: string }; searchParams: { year?: string; month?: string } }) {
const session = { role: 'admin', churchId: null }

  // 일반 사용자는 자기 교회만 접근
  const isAdmin = session.role === 'admin' || session.role === 'manager'

  const churchInfo = CHURCHES.find(c => c.code === params.church)
  if (!churchInfo) notFound()

  const church = await prisma.church.findUnique({ where: { code: params.church } })
  if (!church) notFound()

  if (!isAdmin && session.churchId !== church.id) redirect('/checklist')

  const now = new Date()
  const year = Number(searchParams.year ?? now.getFullYear())
  const month = Number(searchParams.month ?? (now.getMonth() + 1))

  const items = await prisma.checklistItem.findMany({
    where: { churchId: church.id, year, month },
    include: { result: true, focusArea: true },
    orderBy: [{ focusAreaId: 'asc' }, { order: 'asc' }],
  })

  const serialized = items.map(i => ({
    id: i.id,
    title: i.title,
    targetDate: i.targetDate,
    focusAreaId: i.focusAreaId,
    result: i.result ? {
      isDone: i.result.isDone,
      achieveTypes: [
        i.result.achieveTypeSchedule ? 'achieveTypeSchedule' : null,
        i.result.achieveTypeIntensive ? 'achieveTypeIntensive' : null,
        i.result.achieveTypeHabit ? 'achieveTypeHabit' : null,
        i.result.achieveTypeRole ? 'achieveTypeRole' : null,
      ].filter(Boolean) as string[],
      failType: i.result.failType,
      failDetails: Object.entries(i.result)
        .filter(([k, v]) => k.startsWith('failDetail') && v === true)
        .map(([k]) => k),
      note: i.result.note ?? '',
    } : null,
  }))

  const yearOptions = [year - 1, year, year + 1]

  return (
    <div className="flex min-h-screen">
      <Sidebar role={session.role} churchId={session.churchId} />
      <main className="ml-60 flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">월간 체크리스트</h1>
            <p className="text-slate-500 text-sm mt-1">{church.name} 교회</p>
          </div>
          <div className="flex items-center gap-2">
            <a href={`/dashboard/${params.church}`} className="px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors">
              대시보드 보기
            </a>
            <select
              defaultValue={year}
              onChange={e => { window.location.href = `/checklist/${params.church}?year=${e.target.value}&month=${month}` }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {yearOptions.map(y => <option key={y} value={y}>{y}년</option>)}
            </select>
            <select
              defaultValue={month}
              onChange={e => { window.location.href = `/checklist/${params.church}?year=${year}&month=${e.target.value}` }}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}월</option>)}
            </select>
          </div>
        </div>

        <ChecklistEditor
          churchId={church.id}
          churchName={church.name}
          year={year}
          month={month}
          initialItems={serialized}
        />
      </main>
    </div>
  )
}
