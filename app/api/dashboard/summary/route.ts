export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { searchParams } = req.nextUrl
  const churchId = searchParams.get('churchId')
  const year = Number(searchParams.get('year') ?? new Date().getFullYear())
  if (session.role === 'member' && churchId && session.churchId !== churchId) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const where = { year, ...(churchId ? { churchId } : {}) }
  const results = await prisma.checklistResult.findMany({ where, select: { year: true, month: true, churchId: true, isDone: true, achieveTypeSchedule: true, achieveTypeIntensive: true, achieveTypeHabit: true, achieveTypeRole: true, failType: true } })
  const items = await prisma.checklistItem.findMany({ where: { year, ...(churchId ? { churchId } : {}) }, select: { year: true, month: true, churchId: true } })
  const churches = await prisma.church.findMany({ orderBy: { order: 'asc' } })
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const churchData = churches.map(c => {
    const cItems = items.filter(i => i.churchId === c.id)
    const cResults = results.filter(r => r.churchId === c.id)
    const done = cResults.filter(r => r.isDone).length
    const total = cItems.length
    const failCounts: Record<string, number> = {}
    cResults.filter(r => !r.isDone && r.failType).forEach(r => { failCounts[r.failType!] = (failCounts[r.failType!] ?? 0) + 1 })
    const monthlyBreakdown = months.map(m => {
      const mI = cItems.filter(x => x.month === m).length
      const mD = cResults.filter(x => x.month === m && x.isDone).length
      return { month: m, total: mI, done: mD, rate: mI > 0 ? Math.round((mD / mI) * 100) : null }
    })
    return { churchId: c.id, churchCode: c.code, churchName: c.name, total, done, rate: total > 0 ? Math.round((done / total) * 100) : 0, monthlyBreakdown, failCounts }
  })
  return NextResponse.json({ mode: 'church', year, data: churchData })
}
