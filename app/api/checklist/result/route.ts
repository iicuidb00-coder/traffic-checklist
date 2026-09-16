import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// PUT: 달성 결과 저장/갱신
export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json()
  const { itemId, isDone, achieveTypes, failType, failDetails, note } = body

  const item = await prisma.checklistItem.findUnique({ where: { id: itemId } })
  if (!item) return NextResponse.json({ error: 'not found' }, { status: 404 })

  if (session.role === 'member' && session.churchId !== item.churchId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const data = {
    isDone,
    churchId: item.churchId,
    year: item.year,
    month: item.month,
    achieveTypeSchedule: achieveTypes?.includes('achieveTypeSchedule') ?? false,
    achieveTypeIntensive: achieveTypes?.includes('achieveTypeIntensive') ?? false,
    achieveTypeHabit: achieveTypes?.includes('achieveTypeHabit') ?? false,
    achieveTypeRole: achieveTypes?.includes('achieveTypeRole') ?? false,
    failType: isDone ? null : (failType ?? null),
    failDetailGoalVague: failDetails?.includes('failDetailGoalVague') ?? false,
    failDetailGoalUnrealistic: failDetails?.includes('failDetailGoalUnrealistic') ?? false,
    failDetailGoalPriority: failDetails?.includes('failDetailGoalPriority') ?? false,
    failDetailNoSchedule: failDetails?.includes('failDetailNoSchedule') ?? false,
    failDetailNoStepPlan: failDetails?.includes('failDetailNoStepPlan') ?? false,
    failDetailNoAssignee: failDetails?.includes('failDetailNoAssignee') ?? false,
    failDetailWorkCondition: failDetails?.includes('failDetailWorkCondition') ?? false,
    failDetailTimeShort: failDetails?.includes('failDetailTimeShort') ?? false,
    failDetailNoRepeat: failDetails?.includes('failDetailNoRepeat') ?? false,
    failDetailLostMotivation: failDetails?.includes('failDetailLostMotivation') ?? false,
    failDetailPostpone: failDetails?.includes('failDetailPostpone') ?? false,
    failDetailNoMidCheck: failDetails?.includes('failDetailNoMidCheck') ?? false,
    failDetailLateResponse: failDetails?.includes('failDetailLateResponse') ?? false,
    failDetailNoData: failDetails?.includes('failDetailNoData') ?? false,
    failDetailNoExternal: failDetails?.includes('failDetailNoExternal') ?? false,
    failDetailNoRiskPlan: failDetails?.includes('failDetailNoRiskPlan') ?? false,
    failDetailNoResource: failDetails?.includes('failDetailNoResource') ?? false,
    failDetailRoleDup: failDetails?.includes('failDetailRoleDup') ?? false,
    failDetailGap: failDetails?.includes('failDetailGap') ?? false,
    failDetailCollapse: failDetails?.includes('failDetailCollapse') ?? false,
    failDetailDelay: failDetails?.includes('failDetailDelay') ?? false,
    note: note ?? null,
  }

  const result = await prisma.checklistResult.upsert({
    where: { itemId },
    update: data,
    create: { itemId, ...data },
  })

  return NextResponse.json(result)
}
