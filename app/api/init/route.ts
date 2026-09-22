export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { initDatabase } from '@/lib/db'
import pool from '@/lib/db'
import { randomUUID } from 'crypto'

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.INIT_SECRET) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  try {
    await initDatabase()

    // 세부추진계획 테이블 추가
    const client = await pool.connect()
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS sub_plans (
          id SERIAL PRIMARY KEY,
          focus_area_id INT NOT NULL REFERENCES focus_areas(id),
          content TEXT NOT NULL,
          "order" INT DEFAULT 0
        )
      `)

      // 세부추진계획 시드 (지파 공통)
      const subPlans = [
        // 1) 행사시 교통업무 지원
        { focus_area_id: 1, content: '1) 행사별 업무매뉴얼 1차 점검 <1-4분기 내 / 지파,광주>', order: 1 },
        { focus_area_id: 1, content: '2) TF팀별 조직 구성, 업무기준 1차 점검 <1-4분기 내 / 지파,광주>', order: 2 },
        // 2) 상시조직 구성 및 운영
        { focus_area_id: 2, content: '1) 안내차량팀 조직구성 재편성 <1-4분기 / 지파,광주>', order: 1 },
        { focus_area_id: 2, content: '2) 안내차량 정기모임 운영 < 매월 1회 / 지파,광주>', order: 2 },
        { focus_area_id: 2, content: '3) TF팀 정기모임(교류+소통) < 매월 1회 이상 / 지파,광주>', order: 3 },
        { focus_area_id: 2, content: '4) 교통과 팀장 업무개편 및 교회별 기준마련 <1-4분기, 4개팀/팀장>', order: 4 },
        // 3) 차량 및 주차장 관리
        { focus_area_id: 3, content: '1) 상시 점검 <일일별,주간별 / 지파,광주>', order: 1 },
        { focus_area_id: 3, content: '2) 정기 및 집중점검 <매월,분기별,년2회 / 총회,지파,광주>', order: 2 },
        { focus_area_id: 3, content: '3) 차량정비 교회별 지정정비소 선정 <지파/광주>', order: 3 },
        { focus_area_id: 3, content: '4) 불법단속차량,주차민원차량 벌칙제 시행 <매월/광주>', order: 4 },
        { focus_area_id: 3, content: '5) 성전주차장 비표제, 성도차량등록 시스탬화 시행 <1-4분기 중, 광주>', order: 5 },
        // 4) 지교회 업무지원 / 부서원 충원 및 신앙관리
        { focus_area_id: 4, content: '1) 교통과/TF팀 사명자 직무교육 : 년 1~2회', order: 1 },
        { focus_area_id: 4, content: '2) TF팀 업무매뉴얼, 정기실무교육, 정기모임', order: 2 },
        { focus_area_id: 4, content: '3) 행사+모임+투어+방문차량 보고 및 입차 기준마련 <1-4분기 내, 광주>', order: 3 },
        { focus_area_id: 4, content: '1) 구역예배(과-주1회), 천국고시(년1회-단계별)', order: 4 },
        { focus_area_id: 4, content: '2) 팀별+팀장님별 주요업무 주도 역할 부여', order: 5 },
      ]

      for (const sp of subPlans) {
        await client.query(
          `INSERT INTO sub_plans (focus_area_id, content, "order") VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
          [sp.focus_area_id, sp.content, sp.order]
        )
      }

      // 광주 교회 9월 월간추진리스트 시드
      const gwangju = (await client.query(`SELECT id FROM churches WHERE code = 'gwangju'`)).rows[0]
      if (gwangju) {
        const year = 2026, month = 9
        const existing = await client.query(
          `SELECT COUNT(*) FROM checklist_items WHERE church_id = $1 AND year = $2 AND month = $3`,
          [gwangju.id, year, month]
        )
        if (Number(existing.rows[0].count) === 0) {
          const items = [
            { focus_area_id: 1, title: '행사 업무별 매뉴얼 취합 및 점검 < 지파,광주 >', target_date: '넷째주(28,월)' },
            { focus_area_id: 1, title: 'TF팀별 및 팀장연합 실무교육 및 의견수렴 < 광주 >', target_date: '넷째주(28,월)' },
            { focus_area_id: 2, title: '안내차량 광주 정기모임', target_date: '셋째주(20,일)' },
            { focus_area_id: 2, title: '교통과장(월2회-수)/4대팀장(매월1회-수) 정기모임', target_date: '둘째주(9,수), 다섯째주(30,수)' },
            { focus_area_id: 2, title: '지파 TF팀 정기모임', target_date: '다섯째주(30,수)' },
            { focus_area_id: 2, title: '광주 TF팀 실무교육', target_date: '둘째주(10,목), 셋째주(17,목)' },
            { focus_area_id: 3, title: '성전주차장 비표제 시행', target_date: '매월 수,주일 예배(월 주 2회씩)' },
            { focus_area_id: 3, title: '성도차량등록 시스탬 시행', target_date: '둘째주(13,일), 넷째주(27,일)' },
            { focus_area_id: 4, title: '행사,모임,투어,방문차량 보고 (상시)', target_date: '(상시)' },
            { focus_area_id: 4, title: '구역예배 진행', target_date: '(매주 7,14,21,28 1회-월)' },
            { focus_area_id: 4, title: '천국고시 과제제출', target_date: '(매주 5,12,19 1회-토)' },
          ]
          for (let i = 0; i < items.length; i++) {
            await client.query(
              `INSERT INTO checklist_items (id, church_id, focus_area_id, year, month, title, target_date, "order")
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
              [randomUUID(), gwangju.id, items[i].focus_area_id, year, month, items[i].title, items[i].target_date, i]
            )
          }
        }
      }

      return NextResponse.json({ ok: true, message: 'DB 초기화 및 시드 완료' })
    } finally {
      client.release()
    }
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}