import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ChecklistEditor from '@/components/ChecklistEditor'
import { CHURCHES } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default async function ChurchChecklistPage({
  params, searchParams,
}: {
  params: { church: string }
  searchParams: { year?: string; month?: string }
}) {
  const session = { role: 'admin', churchId: null, name: '관리자' }
  const churchInfo = CHURCHES.find(c => c.code === params.church)
  if (!churchInfo) notFound()

  const now = new Date()
  const year = Number(searchParams.year ?? now.getFullYear())
  const month = Number(searchParams.month ?? (now.getMonth() + 1))

  let church: { id: string; name: string; code: string } | null = null
  let serialized: {
    id: string; title: string; targetDate: string | null; focusAreaId: number
    result: { isDone: boolean; achieveTypes: string[]; failType: string | null; failDetails: string[]; note: string } | null
  }[] = []

  try {
    church = await prisma.church.findUnique({ where: { code: params.church } })
    if (church) {
      const items = await prisma.checklistItem.findMany({
        where: { churchId: church.id, year, month },
        include: { result: true, focusArea: true },
        orderBy: [{ focusAreaId: 'asc' }, { order: 'asc' }],
      })
      serialized = items.map(i => ({
        id: i.id, title: i.title, targetDate: i.targetDate, focusAreaId: i.focusAreaId,
        result: i.result ? {
          isDone: i.result.isDone,
          achieveTypes: [
            i.result.achieveTypeSchedule ? 'achieveTypeSchedule' : null,
            i.result.achieveTypeIntensive ? 'achieveTypeIntensive' : null,
            i.result.achieveTypeHabit ? 'achieveTypeHabit' : null,
            i.result.achieveTypeRole ? 'achieveTypeRole' : null,
          ].filter(Boolean) as string[],
          failType: i.result.failType,
          failDetails: Object.entries(i.result).filter(([k, v]) => k.startsWith('failDetail') && v === true).map(([k]) => k),
          note: i.result.note ?? '',
        } : null,
      }))
    }
  } catch {}

  const yearOptions = [year - 1, year, year + 1]

  return (
    <div className="flex min-h-screen">
      <Sidebar role={session.role} churchId={session.churchId} />
      <main className="ml-60 flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">월간 체크리스트</h1>
            <p className="text-slate-500 text-sm mt-1">{churchInfo.name} 교회</p>
          </div>
          <div className="flex items-center gap-2">
            <a href={`/dashboard/${params.church}`}
              className="px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors">
              대시보드 보기
            </a>
            <form method="GET">
              <input type="hidden" name="month" value={month} />
              <select name="year" defaultValue={year}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
                {yearOptions.map(y => <option key={y} value={y}>{y}년</option>)}
              </select>
            </form>
            <form method="GET">
              <input type="hidden" name="year" value={year} />
              <select name="month" defaultValue={month}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>{m}월</option>
                ))}
              </select>
            </form>
          </div>
        </div>
        {church ? (
          <ChecklistEditor
            churchId={church.id}
            churchName={church.name}
            year={year}
            month={month}
            initialItems={serialized}
          />
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
            <p className="text-slate-400">DB가 초기화되지 않았습니다</p>
            <p className="text-slate-300 text-sm mt-2">
              <a href="/api/init?secret=peter-init-2024" className="text-blue-400 underline">여기를 클릭해서 DB를 초기화</a>하세요
            </p>
          </div>
        )}
      </main>
    </div>
  )
}