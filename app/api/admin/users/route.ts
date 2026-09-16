import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const { userId, role, churchId } = await req.json()
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { ...(role !== undefined ? { role } : {}), ...(churchId !== undefined ? { churchId } : {}) },
    include: { church: true },
  })
  return NextResponse.json({ role: updated.role, churchId: updated.churchId, churchName: updated.church?.name ?? null })
}
