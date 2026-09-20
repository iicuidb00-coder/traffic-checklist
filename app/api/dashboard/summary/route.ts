export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { searchParams } = req.nextUrl
  const churchId = searchParams.get('churchId')
  const year = Number(searchParams.get('year') ?? new Date().getFullYear())
  if (session.role === 'member' && churchId && session.churchId !== churchId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const client = await pool.connect()
  try {
    const churches = (await client.query(`SELECT * FROM churches ORDER BY "order"`)).rows
    const itemsQuery = churchId
      ? `SELECT church_id, month FROM checklist_items WHERE year = $1 AND church_id = $2`
      : `SELECT church_id, month FROM checklist_items WHERE year = $1`
    const itemsParams = churchId ? [year, churchId] : [year]
    const items = (await client.query(itemsQuery, itemsParams)).rows
    const resultsQuery = churchId
      ? `SELECT church_id, month, is_done, fail_type FROM checklist_results WHERE year = $1 AND church_id = $2`
      : `SELECT church_id, month, is_done, fail_type FROM checklist_results WHERE year = $1`
    const results = (await client.query(resultsQuery, itemsParams)).rows
    const months = Array.from({ length: 12 }, (_, i) => i + 1)
    const churchData = churches.map((c: { id: string; code: string; name: string }) => {
      const cItems = items.filter((i: { church_id: string }) => i.church_id === c.id)
      const cResults = results.filter((r: { church_id: string }) => r.church_id === c.id)
      const done = cResults.filter((r: { is_done: boolean }) => r.is_done).length
      const total = cItems.length
      const failCounts: Record<string, number> = {}
      cResults.filter((r: { is_done: boolean; fail_type: string }) => !r.is_done && r.fail_type).forEach((r: { fail_type: string }) => {
        failCounts[r.fail_type] = (failCounts[r.fail_type] ?? 0) + 1
      })
      const monthlyBreakdown = months.map(m => {
        const mI = cItems.filter((i: { month: number }) => i.month === m).length
        const mD = cResults.filter((r: { month: number; is_done: boolean }) => r.month === m && r.is_done).length
        return { month: m, total: mI, done: mD, rate: mI > 0 ? Math.round((mD / mI) * 100) : null }
      })
      return { churchId: c.id, churchCode: c.code, churchName: c.name, total, done, rate: total > 0 ? Math.round((done / total) * 100) : 0, monthlyBreakdown, failCounts }
    })
    return NextResponse.json({ mode: 'church', year, data: churchData })
  } finally {
    client.release()
  }
}