import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/Sidebar'
import { ChurchRateChart, ChurchTrendChart } from '@/components/charts/AchieveRateChart'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = { role: 'admin', churchId: null, name: '관리자' }
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  let churches: { id: string; name: string; code: string; order: number }[] = []
  let churchData: {
    churchId: string; churchCode: string; churchName: string
    total: number; done: number; rate: number
    monthlyBreakdown: { month: number; total: number; done: number; rate: number | null }[]
    failCounts: Record<string, number>
  }[] = []
  let totalItems = 0, totalDone = 0, overallRate = 0, thisMonthItems = 0, thisMonthDone = 0

  try {
    churches = await prisma.church.findMany({ orderBy: { order: 'asc' } })
    const allItems = await prisma.checklistItem.findMany({ where: { year }, select: { churchId: true, month: true } })
    const allResults = await prisma.checklistResult.findMany({ where: { year }, select: { churchId: true, month: true, isDone: true, failType: true } })
    totalItems = allItems.length
    totalDone = allResults.filter(r => r.isDone).length
    overallRate = totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0
    thisMonthItems = allItems.filter(i => i.month === month).length
    thisMonthDone = allResults.filter(r => r.month === month && r.isDone).length
    churchData = churches.map(c => {
      const cItems = allItems.filter(i => i.churchId === c.id)
      const cResults = allResults.filter(r => r.churchId === c.id)
      const done = cResults.filter(r => r.isDone).length
      const total = cItems.length
      const failCounts: Record<string, number> = {}
      cResults.filter(r => !r.isDone && r.failType).forEach(r => {
        failCounts[r.failType!] = (failCounts[r.failType!] ?? 0) + 1
      })
      const monthlyBreakdown = Array.from({ length: 12 }, (_, i) => {
        const m = i + 1
        const mI = cItems.filter(x => x.month === m).length
        const mD = cResults.filter(x => x.month === m && x.isDone).length
        return { month: m, total: mI, done: mD, rate: mI > 0 ? Math.round((mD / mI) * 100) : null }
      })
      return { churchId: c.id, churchCode: c.code, churchName: c.name, total, done, rate: total > 0 ? Math.round((done / total) * 100) : 0, monthlyBreakdown, failCounts }
    })
  } catch {}

  return (
    <div className="flex min-h-screen">
      <Sidebar role={session.role} churchId={session.churchId} />
      <main className="ml-60 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">전체 대시보드</h1>
          <p className="text-slate-500 text-sm mt-1">{year}년 · 베드로 지파 8개 교회 종합 현황</p>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: '연간 달성률', value: `${overallRate}%`, sub: `${totalDone}/${totalItems}`, color: 'text-blue-600' },
            { label: '이번 달 달성률', value: thisMonthItems > 0 ? `${Math.round((thisMonthDone/thisMonthItems)*100)}%` : '-', sub: `${thisMonthDone}/${thisMonthItems}`, color: 'text-green-600' },
            { label: '참여 교회', value: `${churches.length}개`, sub: '광주·목포·여수·순천 외', color: 'text-purple-600' },
            { label: '총 추진 항목', value: `${totalItems}개`, sub: `${year}년 누계`, color: 'text-amber-600' },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-slate-500 text-xs font-medium">{card.label}</p>
              <p className={`text-3xl font-bold mt-1 ${card.color}`}>{card.value}</p>
              <p className="text-slate-400 text-xs mt-1">{card.sub}</p>
            </div>
          ))}
        </div>
        {churchData.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-700 mb-4">{year}년 교회별 달성률</h3>
                <ChurchRateChart data={churchData} />
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-700 mb-4">교회별 월별 추이</h3>
                <ChurchTrendChart data={churchData} />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-700">{year}년 교회별 종합 현황</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs">
                    <th className="px-5 py-3 text-left">교회</th>
                    <th className="px-4 py-3 text-center">총 항목</th>
                    <th className="px-4 py-3 text-center">달성</th>
                    <th className="px-4 py-3 text-center">달성률</th>
                    {Array.from({ length: 12 }, (_, i) => (
                      <th key={i} className="px-2 py-3 text-center w-10">{i+1}월</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {churchData.map(c => (
                    <tr key={c.churchId} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-semibold text-slate-700">
                        <a href={`/dashboard/${c.churchCode}`} className="hover:text-blue-600">{c.churchName}</a>
                      </td>
                      <td className="px-4 py-3 text-center">{c.total}</td>
                      <td className="px-4 py-3 text-center">{c.done}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-bold ${c.rate >= 80 ? 'text-green-600' : c.rate >= 60 ? 'text-blue-600' : c.rate >= 40 ? 'text-amber-600' : 'text-red-500'}`}>
                          {c.rate}%
                        </span>
                      </td>
                      {c.monthlyBreakdown.map(m => (
                        <td key={m.month} className="px-2 py-3 text-center text-xs">
                          {m.rate !== null
                            ? <span className={m.rate >= 80 ? 'text-green-600' : m.rate >= 60 ? 'text-blue-500' : m.rate > 0 ? 'text-amber-500' : 'text-red-400'}>{m.rate}%</span>
                            : <span className="text-slate-200">-</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
            <p className="text-slate-400 text-lg">데이터가 없습니다</p>
            <p className="text-slate-300 text-sm mt-2">DB 초기화 후 체크리스트를 입력하면 표시됩니다</p>
          </div>
        )}
      </main>
    </div>
  )
}