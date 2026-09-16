export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { searchParams } = req.nextUrl
  const churchId = searchParams.get('churchId')
  const year = Number(searchParams.get('year'))
  const month = Number(searchParams.get('month'))
  if (session.role === 'member' && session.churchId !== churchId) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const items = await prisma.checklistItem.findMany({ where: { churchId: churchId!, year, month }, include: { result: true, focusArea: true }, orderBy: [{ focusAreaId: 'asc' }, { order: 'asc' }] })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = await req.json()
  const { churchId, focusAreaId, year, month, title, targetDate, order } = body
  if (session.role === 'member' && session.churchId !== churchId) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const item = await prisma.checklistItem.create({ data: { churchId, focusAreaId, year, month, title, targetDate, order: order ?? 0 }, include: { result: true, focusArea: true } })
  return NextResponse.json(item, { status: 201 })
}
