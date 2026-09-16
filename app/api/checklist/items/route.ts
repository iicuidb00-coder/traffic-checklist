export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = await req.json()
  const { id, title, targetDate } = body
  const item = await prisma.checklistItem.findUnique({ where: { id } })
  if (!item) return NextResponse.json({ error: 'not found' }, { status: 404 })
  if (session.role === 'member' && session.churchId !== item.churchId) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const updated = await prisma.checklistItem.update({ where: { id }, data: { title, targetDate }, include: { result: true, focusArea: true } })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await req.json()
  const item = await prisma.checklistItem.findUnique({ where: { id } })
  if (!item) return NextResponse.json({ error: 'not found' }, { status: 404 })
  if (session.role === 'member' && session.churchId !== item.churchId) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  await prisma.checklistItem.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
