import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/Sidebar'
import ChecklistEditor from '@/components/ChecklistEditor'
import { CHURCHES } from '@/lib/constants'

export default async function MyChecklistPage({ searchParams }: { searchParams: { year?: string; month?: string; church?: string } }) {
  const session = { role: 'admin', churchId: null, name: '\uAD00\uB9AC\uC790' }
  const now = new Date()
  const year = Number(searchParams.year ?? now.getFullYear())
  const month = Number(searchParams.month ?? (now.getMonth() + 1))
  const churchCode = searchParams.church ?? 'gwangju'
  let church: { id: string; name: string; code: string } | null = null
  let serialized: { id: string; title: string; targetDate: string | null; focusAreaId: number; result: { isDone: boolean; achieveTypes: string[]; failType: string | null; failDetails: string[]; note: string } | null }[] = []
  try {
    church = await prisma.church.findUnique({ where: { code: churchCode } })
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
          achieveTypes: [i.result.achieveTypeSchedule ? 'achieveTypeSchedule' : null, i.result.achieveTypeIntensive ? 'achieveTypeIntensive' : null, i.result.achieveTypeHabit ? 'achieveTypeHabit' : null, i.result.achieveTypeRole ? 'achieveTypeRole' : null].filter(Boolean) as string[],
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
            <h1 className="text-2xl font-bold text-slate-800">\uC6D4\uAC04 \uCCB4\uD06C\uB9AC\uC2A4\uD2B8</h1>
            <p className="text-slate-500 text-sm mt-1">{church?.name ?? '\uAD50\uD68C \uC120\uD0DD'} \uAD50\uD68C</p>
          </div>
          <div className="flex items-center gap-2">
            <select defaultValue={churchCode} onChange={undefined} className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
              {CHURCHES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
            <select defaultValue={year} className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
              {yearOptions.map(y => <option key={y} value={y}>{y}\uB144</option>)}
            </select>
            <select defaultValue={month} className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}\uC6D4</option>)}
            </select>
          </div>
        </div>
        {church ? (
          <ChecklistEditor churchId={church.id} churchName={church.name} year={year} month={month} initialItems={serialized} />
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
            <p className="text-slate-400">DB\uAC00 \uCD08\uAE30\uD654\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4</p>
            <p className="text-slate-300 text-sm mt-2">/api/init?secret=peter-init-2024 \uC811\uC18D\uD574\uC11C DB\uB97C \uCD08\uAE30\uD654\uD574\uC8FC\uC138\uC694</p>
          </div>
        )}
      </main>
    </div>
  )
}
