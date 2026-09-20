import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/Sidebar'
import { ChurchRateChart, ChurchTrendChart } from '@/components/charts/AchieveRateChart'

export default async function DashboardPage() {
  const session = { role: 'admin', churchId: null, name: '\uAD00\uB9AC\uC790' }
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  let churches: { id: string; name: string; code: string; order: number }[] = []
  let churchData: { churchId: string; churchCode: string; churchName: string; total: number; done: number; rate: number; monthlyBreakdown: { month: number; total: number; done: number; rate: number | null }[]; failCounts: Record<string, number> }[] = []
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
      cResults.filter(r => !r.isDone && r.failType).forEach(r => { failCounts[r.failType!] = (failCounts[r.failType!] ?? 0) + 1 })
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
          <h1 className="text-2xl font-bold text-slate-800">\uC804\uCCB4 \uB300\uC2DC\uBCF4\uB4DC</h1>
          <p className="text-slate-500 text-sm mt-1">{year}\uB144 \u00B7 \uBCA0\uB4DC\uB85C \uC9C0\uD30C 8\uAC1C \uAD50\uD68C \uC885\uD569 \uD604\uD669</p>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: '\uC5F0\uAC04 \uB2EC\uC131\uB960', value: overallRate + '%', sub: totalDone + '/' + totalItems, color: 'text-blue-600' },
            { label: '\uC774\uBC88 \uB2EC \uB2EC\uC131\uB960', value: thisMonthItems > 0 ? Math.round((thisMonthDone/thisMonthItems)*100) + '%' : '-', sub: thisMonthDone + '/' + thisMonthItems, color: 'text-green-600' },
            { label: '\uCC38\uC5EC \uAD50\uD68C', value: churches.length + '\uAC1C', sub: '\uAD11\uC8FC\u00B7\uBAA9\uD3EC\u00B7\uC5EC\uC218\u00B7\uC21C\uCC9C \uC678', color: 'text-purple-600' },
            { label: '\uCD1D \uCD94\uC9C4 \uD56D\uBAA9', value: totalItems + '\uAC1C', sub: year + '\uB144 \uB204\uACC4', color: 'text-amber-600' },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-slate-500 text-xs font-medium">{card.label}</p>
              <p className={'text-3xl font-bold mt-1 ' + card.color}>{card.value}</p>
              <p className="text-slate-400 text-xs mt-1">{card.sub}</p>
            </div>
          ))}
        </div>
        {churchData.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-700 mb-4">{year}\uB144 \uAD50\uD68C\uBCC4 \uB2EC\uC131\uB960</h3>
                <ChurchRateChart data={churchData} />
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-700 mb-4">\uAD50\uD68C\uBCC4 \uC6D4\uBCC4 \uCD94\uC774</h3>
                <ChurchTrendChart data={churchData} />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100"><h3 className="font-semibold text-slate-700">{year}\uB144 \uAD50\uD68C\uBCC4 \uC885\uD569 \uD604\uD669</h3></div>
              <table className="w-full text-sm">
                <thead><tr className="bg-slate-50 text-slate-500 text-xs">
                  <th className="px-5 py-3 text-left">\uAD50\uD68C</th>
                  <th className="px-4 py-3 text-center">\uCD1D \uD56D\uBAA9</th>
                  <th className="px-4 py-3 text-center">\uB2EC\uC131</th>
                  <th className="px-4 py-3 text-center">\uB2EC\uC131\uB960</th>
                  {Array.from({ length: 12 }, (_, i) => (<th key={i} className="px-2 py-3 text-center w-10">{i+1}\uC6D4</th>))}
                </tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {churchData.map(c => (
                    <tr key={c.churchId} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-semibold text-slate-700"><a href={'/dashboard/' + c.churchCode} className="hover:text-blue-600">{c.churchName}</a></td>
                      <td className="px-4 py-3 text-center">{c.total}</td>
                      <td className="px-4 py-3 text-center">{c.done}</td>
                      <td className="px-4 py-3 text-center"><span className={c.rate >= 80 ? 'text-green-600 font-bold' : c.rate >= 60 ? 'text-blue-600 font-bold' : c.rate >= 40 ? 'text-amber-600 font-bold' : 'text-red-500 font-bold'}>{c.rate}%</span></td>
                      {c.monthlyBreakdown.map(m => (<td key={m.month} className="px-2 py-3 text-center text-xs">{m.rate !== null ? <span className={m.rate >= 80 ? 'text-green-600' : m.rate >= 60 ? 'text-blue-500' : m.rate > 0 ? 'text-amber-500' : 'text-red-400'}>{m.rate}%</span> : <span className="text-slate-200">-</span>}</td>))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
            <p className="text-slate-400 text-lg">\uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4</p>
            <p className="text-slate-300 text-sm mt-2">DB \uCD08\uAE30\uD654 \uD6C4 \uCCB4\uD06C\uB9AC\uC2A4\uD2B8\uB97C \uC785\uB825\uD558\uBA74 \uD45C\uC2DC\uB429\uB2C8\uB2E4</p>
          </div>
        )}
      </main>
    </div>
  )
}
