import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: process.env.NODE_ENV === 'development' ? ['error'] : [] })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// DB 자동 초기화
async function initDb() {
  try {
    await prisma.church.count()
  } catch {
    // 테이블 없으면 무시
    return
  }
  const count = await prisma.church.count()
  if (count === 0) {
    const churches = [
      { code: 'gwangju', name: '\uAD11\uC8FC', order: 1 },
      { code: 'mokpo', name: '\uBAA9\uD3EC', order: 2 },
      { code: 'yeosu', name: '\uC5EC\uC218', order: 3 },
      { code: 'suncheon', name: '\uC21C\uCC9C', order: 4 },
      { code: 'songha', name: '\uC1A1\uD558', order: 5 },
      { code: 'gwangyang', name: '\uAD11\uC591', order: 6 },
      { code: 'haenam', name: '\uD574\uB0A8', order: 7 },
      { code: 'naju', name: '\uB098\uC8FC', order: 8 },
    ]
    for (const c of churches) {
      await prisma.church.upsert({ where: { code: c.code }, update: {}, create: c })
    }
    const focusAreas = [
      { code: 'event_support', name: '\uD589\uC0AC\uC2DC \uAD50\uD1B5\uC5C5\uBB34 \uC9C0\uC6D0', order: 1 },
      { code: 'org_operation', name: '\uC0C1\uC2DC\uC870\uC9C1 \uAD6C\uC131 \uBC0F \uC6B4\uC601', order: 2 },
      { code: 'vehicle_mgmt', name: '\uCC28\uB7C9 \uBC0F \uC8FC\uCC28\uC7A5 \uAD00\uB9AC', order: 3 },
      { code: 'church_support', name: '\uC9C0\uAD50\uD68C \uC5C5\uBB34\uC9C0\uC6D0 / \uBD80\uC11C\uC6D0 \uCDA9\uC6D0 \uBC0F \uC2E0\uC559\uAD00\uB9AC', order: 4 },
    ]
    for (const f of focusAreas) {
      await prisma.focusArea.upsert({ where: { code: f.code }, update: {}, create: f })
    }
  }
}

if (process.env.NODE_ENV === 'production') {
  initDb().catch(console.error)
}