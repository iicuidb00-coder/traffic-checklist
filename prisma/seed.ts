import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 교회 시드
  const churches = [
    { code: 'gwangju', name: '광주', order: 1 },
    { code: 'mokpo', name: '목포', order: 2 },
    { code: 'yeosu', name: '여수', order: 3 },
    { code: 'suncheon', name: '순천', order: 4 },
    { code: 'songha', name: '송하', order: 5 },
    { code: 'gwangyang', name: '광양', order: 6 },
    { code: 'haenam', name: '해남', order: 7 },
    { code: 'naju', name: '나주', order: 8 },
  ]
  for (const c of churches) {
    await prisma.church.upsert({ where: { code: c.code }, update: {}, create: c })
  }

  // 중점사항 시드
  const focusAreas = [
    { code: 'event_support', name: '행사시 교통업무 지원', order: 1 },
    { code: 'org_operation', name: '상시조직 구성 및 운영', order: 2 },
    { code: 'vehicle_mgmt', name: '차량 및 주차장 관리', order: 3 },
    { code: 'church_support', name: '지교회 업무지원 / 부서원 충원 및 신앙관리', order: 4 },
  ]
  for (const f of focusAreas) {
    await prisma.focusArea.upsert({ where: { code: f.code }, update: {}, create: f })
  }

  console.log('시드 완료')
}

main().catch(console.error).finally(() => prisma.$disconnect())
