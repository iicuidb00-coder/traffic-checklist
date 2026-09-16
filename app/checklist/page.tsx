import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/Sidebar'
import ChecklistEditor from '@/components/ChecklistEditor'
import { CHURCHES } from '@/lib/constants'

export default async function MyChecklistPage({
  searchParams,
}: { searchParams: { year?: string; month?: string } }) {
  const session = await getSession()
  if (!session) redirect('/login')

  if (!session.churchId) {
    return (
      <div className="flex min-h-screen">
        <Sidebar role={session.role} churchId={null} />
        <main className="ml-60 flex-1 p-8 flex items-center justify-center">
          <div className="text-center bg-white rounded-xl border border-slate-200 p-10">
            <p className="text-slate-600 font-semibold text-lg mb-2">소속 교회가 지정되지 않았습니다</p>
            <p className="text-slate-400 text-sm">관리자에게 문의해주세요</p>
          </div>
        </main>
      </div>
    )
  }

  const now = new Date()
  const year = Number(searchParams.year ?? now.getFullYear())
  const month = Number(searchParams.month ?? (now.getMonth() + 1))

  const church = await prisma.church.findUnique({ where: { id: session.churchId } })
  if (!church) redirect('/login')

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

  // 월 선택 옵션
  const yearOptions = [year - 1, year, year + 1]
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)

  return (
    <div className="flex min-h-screen">
      <Sidebar role={session.role} churchId={session.churchId} />
      <main className="ml-60 flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">월간 체크리스트</h1>
            <p className="text-slate-500 text-sm mt-1">{church.name} 교회</p>
          </div>
          {/* 연월 선택 */}
          <div className="flex items-center gap-2">
            <select
              defaultValue={year}
              onChange={e => window.location.href = `/checklist?year=${e.target.value}&month=${month}`}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {yearOptions.map(y => <option key={y} value={y}>{y}년</option>)}
            </select>
            <select
              defaultValue={month}
              onChange={e => window.location.href = `/checklist?year=${year}&month=${e.target.value}`}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {monthOptions.map(m => <option key={m} value={m}>{m}월</option>)}
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
