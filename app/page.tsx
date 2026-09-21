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

  const thisMonthRate = thisMonthItems > 0 ? Math.round((thisMonthDone / thisMonthItems) * 100) : 0

  return (
    <div className="app">
      <Sidebar role={session.role} churchId={session.churchId} />
      <div className="main">
        <header className="topbar">
          <div>
            <div className="crumb"><b>베드로 지파</b> / 교통과</div>
            <div className="page-title">전체 대시보드</div>
          </div>
          <div className="topbar-spacer" />
          <span className="badge neutral">{year}년 {month}월</span>
        </header>

        <div className="content">
          {/* 통계 카드 */}
          <div className="stat-strip" style={{ marginBottom: 16 }}>
            <div className="stat">
              <div className="stat-top">
                <div className="stat-dot" style={{ background: 'var(--accent)' }} />
                <div className="stat-label">연간 달성률</div>
              </div>
              <div className="stat-value" style={{ color: 'var(--accent)' }}>{overallRate}%</div>
              <div className="stat-delta">{totalDone}/{totalItems} 항목</div>
            </div>
            <div className="stat">
              <div className="stat-top">
                <div className="stat-dot" style={{ background: 'var(--ok)' }} />
                <div className="stat-label">이번 달 달성률</div>
              </div>
              <div className="stat-value" style={{ color: 'var(--ok)' }}>{thisMonthRate}%</div>
              <div className="stat-delta">{thisMonthDone}/{thisMonthItems} 항목</div>
            </div>
            <div className="stat">
              <div className="stat-top">
                <div className="stat-dot" style={{ background: 'var(--warn)' }} />
                <div className="stat-label">참여 교회</div>
              </div>
              <div className="stat-value">{churches.length}개</div>
              <div className="stat-delta">광주·목포·여수·순천 외</div>
            </div>
            <div className="stat">
              <div className="stat-top">
                <div className="stat-dot" style={{ background: 'var(--neu)' }} />
                <div className="stat-label">총 추진 항목</div>
              </div>
              <div className="stat-value">{totalItems}개</div>
              <div className="stat-delta">{year}년 누계</div>
            </div>
          </div>

          {churchData.length > 0 ? (
            <>
              {/* 차트 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div className="panel">
                  <div className="panel-head">
                    <span className="panel-title">{year}년 교회별 달성률</span>
                  </div>
                  <div className="panel-body">
                    <ChurchRateChart data={churchData} />
                  </div>
                </div>
                <div className="panel">
                  <div className="panel-head">
                    <span className="panel-title">교회별 월별 추이</span>
                  </div>
                  <div className="panel-body">
                    <ChurchTrendChart data={churchData} />
                  </div>
                </div>
              </div>

              {/* 교회별 달성률 바 */}
              <div className="panel" style={{ marginBottom: 16 }}>
                <div className="panel-head">
                  <span className="panel-title">{year}년 교회별 종합 현황</span>
                  <span className="panel-sub">달성률 기준</span>
                </div>
                <div className="panel-body bars">
                  {churchData.map(c => (
                    <a key={c.churchId} href={`/dashboard/${c.churchCode}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="bar-row" style={{ cursor: 'pointer' }}>
                        <div className="bar-name">
                          <div className="gem m" style={{
                            background: c.rate >= 80 ? 'var(--ok-bg)' : c.rate >= 60 ? 'var(--accent-weak)' : c.rate >= 40 ? 'var(--warn-bg)' : 'var(--bad-bg)',
                            color: c.rate >= 80 ? 'var(--ok)' : c.rate >= 60 ? 'var(--accent)' : c.rate >= 40 ? 'var(--warn)' : 'var(--bad)',
                          }}>
                            {c.churchName.charAt(0)}
                          </div>
                          <span className="nm">{c.churchName}</span>
                        </div>
                        <div className="bar-track">
                          <div className="bar-fill" style={{
                            width: `${c.rate}%`,
                            background: c.rate >= 80 ? 'var(--ok)' : c.rate >= 60 ? 'var(--accent)' : c.rate >= 40 ? 'var(--warn)' : 'var(--bad)',
                          }} />
                        </div>
                        <div className="bar-val">
                          <b>{c.done}</b>
                          <span className="pct">/ {c.total} ({c.rate}%)</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* 월별 테이블 */}
              <div className="panel">
                <div className="panel-head">
                  <span className="panel-title">월별 상세 현황</span>
                </div>
                <div className="tbl-wrap">
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th>교회</th>
                        <th>연간</th>
                        {Array.from({ length: 12 }, (_, i) => <th key={i}>{i+1}월</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {churchData.map(c => (
                        <tr key={c.churchId} tabIndex={0} onClick={() => window.location.href = `/dashboard/${c.churchCode}`} style={{ cursor: 'pointer' }}>
                          <td><strong>{c.churchName}</strong></td>
                          <td>
                            <span className={`badge ${c.rate >= 80 ? 'success' : c.rate >= 60 ? 'brand' : c.rate >= 40 ? 'warning' : c.rate > 0 ? 'danger' : 'neutral'}`}>
                              {c.rate}%
                            </span>
                          </td>
                          {c.monthlyBreakdown.map(m => (
                            <td key={m.month} className="tnum" style={{ textAlign: 'center' }}>
                              {m.rate !== null
                                ? <span style={{ color: m.rate >= 80 ? 'var(--ok)' : m.rate >= 60 ? 'var(--accent)' : m.rate > 0 ? 'var(--warn)' : 'var(--bad)', fontWeight: 600 }}>{m.rate}%</span>
                                : <span style={{ color: 'var(--line-2)' }}>-</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="panel">
              <div className="panel-body" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
                <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>데이터가 없습니다</div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>DB 초기화 후 체크리스트를 입력하면 표시됩니다</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}