import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const churchId = searchParams.get('churchId') // null이면 전체
  const year = Number(searchParams.get('year') ?? new Date().getFullYear())
  const mode = searchParams.get('mode') ?? 'monthly' // monthly | quarterly | yearly

  // 권한: member는 자기 교회만
  if (session.role === 'member' && churchId && session.churchId !== churchId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const where = {
    year,
    ...(churchId ? { churchId } : {}),
  }

  // 월별 집계
  const results = await prisma.checklistResult.findMany({
    where,
    select: {
      year: true, month: true, churchId: true, isDone: true,
      achieveTypeSchedule: true, achieveTypeIntensive: true,
      achieveTypeHabit: true, achieveTypeRole: true,
      failType: true,
    },
  })

  const items = await prisma.checklistItem.findMany({
    where: { year, ...(churchId ? { churchId } : {}) },
    select: { year: true, month: true, churchId: true },
  })

  // 월별 통계 계산
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const churches = await prisma.church.findMany({ orderBy: { order: 'asc' } })

  if (mode === 'monthly') {
    const monthlyData = months.map(m => {
      const monthItems = items.filter(i => i.month === m)
      const monthResults = results.filter(r => r.month === m)
      const done = monthResults.filter(r => r.isDone).length
      const total = monthItems.length

      return {
        month: m,
        label: `${m}월`,
        total,
        done,
        rate: total > 0 ? Math.round((done / total) * 100) : 0,
      }
    })
    return NextResponse.json({ mode, year, data: monthlyData })
  }

  if (mode === 'quarterly') {
    const quarters = [
      { q: 1, months: [1, 2, 3], label: '1분기' },
      { q: 2, months: [4, 5, 6], label: '2분기' },
      { q: 3, months: [7, 8, 9], label: '3분기' },
      { q: 4, months: [10, 11, 12], label: '4분기' },
    ]
    const quarterlyData = quarters.map(({ q, months: qm, label }) => {
      const qItems = items.filter(i => qm.includes(i.month))
      const qResults = results.filter(r => qm.includes(r.month))
      const done = qResults.filter(r => r.isDone).length
      const total = qItems.length
      return { q, label, total, done, rate: total > 0 ? Math.round((done / total) * 100) : 0 }
    })
    return NextResponse.json({ mode, year, data: quarterlyData })
  }

  // church별 월별 달성률 (대시보드 전체용)
  const churchData = churches.map(c => {
    const cItems = items.filter(i => i.churchId === c.id)
    const cResults = results.filter(r => r.churchId === c.id)
    const done = cResults.filter(r => r.isDone).length
    const total = cItems.length

    const monthlyBreakdown = months.map(m => {
      const mItems = cItems.filter(i => i.month === m)
      const mResults = cResults.filter(r => r.month === m)
      const mDone = mResults.filter(r => r.isDone).length
      return {
        month: m,
        total: mItems.length,
        done: mDone,
        rate: mItems.length > 0 ? Math.round((mDone / mItems.length) * 100) : null,
      }
    })

    // 미달성 유형 집계
    const failCounts: Record<string, number> = {}
    cResults.filter(r => !r.isDone && r.failType).forEach(r => {
      failCounts[r.failType!] = (failCounts[r.failType!] ?? 0) + 1
    })

    return {
      churchId: c.id,
      churchCode: c.code,
      churchName: c.name,
      total,
      done,
      rate: total > 0 ? Math.round((done / total) * 100) : 0,
      monthlyBreakdown,
      failCounts,
    }
  })

  return NextResponse.json({ mode: 'church', year, data: churchData })
}
