export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = await req.json()
  const { itemId, isDone, achieveTypes, failType, failDetails, note } = body
  const item = await prisma.checklistItem.findUnique({ where: { id: itemId } })
  if (!item) return NextResponse.json({ error: 'not found' }, { status: 404 })
  if (session.role === 'member' && session.churchId !== item.churchId) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const fd = (k: string) => failDetails?.includes(k) ?? false
  const data = {
    isDone, churchId: item.churchId, year: item.year, month: item.month,
    achieveTypeSchedule: achieveTypes?.includes('achieveTypeSchedule') ?? false,
    achieveTypeIntensive: achieveTypes?.includes('achieveTypeIntensive') ?? false,
    achieveTypeHabit: achieveTypes?.includes('achieveTypeHabit') ?? false,
    achieveTypeRole: achieveTypes?.includes('achieveTypeRole') ?? false,
    failType: isDone ? null : (failType ?? null),
    failDetailGoalVague: fd('failDetailGoalVague'), failDetailGoalUnrealistic: fd('failDetailGoalUnrealistic'),
    failDetailGoalPriority: fd('failDetailGoalPriority'), failDetailNoSchedule: fd('failDetailNoSchedule'),
    failDetailNoStepPlan: fd('failDetailNoStepPlan'), failDetailNoAssignee: fd('failDetailNoAssignee'),
    failDetailWorkCondition: fd('failDetailWorkCondition'), failDetailTimeShort: fd('failDetailTimeShort'),
    failDetailNoRepeat: fd('failDetailNoRepeat'), failDetailLostMotivation: fd('failDetailLostMotivation'),
    failDetailPostpone: fd('failDetailPostpone'), failDetailNoMidCheck: fd('failDetailNoMidCheck'),
    failDetailLateResponse: fd('failDetailLateResponse'), failDetailNoData: fd('failDetailNoData'),
    failDetailNoExternal: fd('failDetailNoExternal'), failDetailNoRiskPlan: fd('failDetailNoRiskPlan'),
    failDetailNoResource: fd('failDetailNoResource'), failDetailRoleDup: fd('failDetailRoleDup'),
    failDetailGap: fd('failDetailGap'), failDetailCollapse: fd('failDetailCollapse'),
    failDetailDelay: fd('failDetailDelay'), note: note ?? null,
  }
  const result = await prisma.checklistResult.upsert({ where: { itemId }, update: data, create: { itemId, ...data } })
  return NextResponse.json(result)
}
