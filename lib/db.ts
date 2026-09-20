import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.VPG_DATABASE_URL,
  ssl: process.env.VPG_SSLMODE === 'disable' ? false : undefined,
})

export default pool

// DB 초기화 (테이블 생성 + 시드)
export async function initDatabase() {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS churches (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        "order" INT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)
    await client.query(`
      CREATE TABLE IF NOT EXISTS focus_areas (
        id SERIAL PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        "order" INT NOT NULL
      )
    `)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        zion_new_no TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'member',
        church_id TEXT REFERENCES churches(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    await client.query(`
      CREATE TABLE IF NOT EXISTS checklist_items (
        id TEXT PRIMARY KEY,
        church_id TEXT NOT NULL REFERENCES churches(id),
        focus_area_id INT NOT NULL REFERENCES focus_areas(id),
        year INT NOT NULL,
        month INT NOT NULL,
        title TEXT NOT NULL,
        target_date TEXT,
        "order" INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    await client.query(`
      CREATE TABLE IF NOT EXISTS checklist_results (
        id TEXT PRIMARY KEY,
        item_id TEXT UNIQUE NOT NULL REFERENCES checklist_items(id) ON DELETE CASCADE,
        church_id TEXT NOT NULL,
        year INT NOT NULL,
        month INT NOT NULL,
        is_done BOOLEAN DEFAULT false,
        achieve_type_schedule BOOLEAN DEFAULT false,
        achieve_type_intensive BOOLEAN DEFAULT false,
        achieve_type_habit BOOLEAN DEFAULT false,
        achieve_type_role BOOLEAN DEFAULT false,
        fail_type TEXT,
        fail_detail_goal_vague BOOLEAN DEFAULT false,
        fail_detail_goal_unrealistic BOOLEAN DEFAULT false,
        fail_detail_goal_priority BOOLEAN DEFAULT false,
        fail_detail_no_schedule BOOLEAN DEFAULT false,
        fail_detail_no_step_plan BOOLEAN DEFAULT false,
        fail_detail_no_assignee BOOLEAN DEFAULT false,
        fail_detail_work_condition BOOLEAN DEFAULT false,
        fail_detail_time_short BOOLEAN DEFAULT false,
        fail_detail_no_repeat BOOLEAN DEFAULT false,
        fail_detail_lost_motivation BOOLEAN DEFAULT false,
        fail_detail_postpone BOOLEAN DEFAULT false,
        fail_detail_no_mid_check BOOLEAN DEFAULT false,
        fail_detail_late_response BOOLEAN DEFAULT false,
        fail_detail_no_data BOOLEAN DEFAULT false,
        fail_detail_no_external BOOLEAN DEFAULT false,
        fail_detail_no_risk_plan BOOLEAN DEFAULT false,
        fail_detail_no_resource BOOLEAN DEFAULT false,
        fail_detail_role_dup BOOLEAN DEFAULT false,
        fail_detail_gap BOOLEAN DEFAULT false,
        fail_detail_collapse BOOLEAN DEFAULT false,
        fail_detail_delay BOOLEAN DEFAULT false,
        note TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // 교회 시드
    const churches = [
      { id: 'gwangju', code: 'gwangju', name: '광주', order: 1 },
      { id: 'mokpo', code: 'mokpo', name: '목포', order: 2 },
      { id: 'yeosu', code: 'yeosu', name: '여수', order: 3 },
      { id: 'suncheon', code: 'suncheon', name: '순천', order: 4 },
      { id: 'songha', code: 'songha', name: '송하', order: 5 },
      { id: 'gwangyang', code: 'gwangyang', name: '광양', order: 6 },
      { id: 'haenam', code: 'haenam', name: '해남', order: 7 },
      { id: 'naju', code: 'naju', name: '나주', order: 8 },
    ]
    for (const c of churches) {
      await client.query(
        `INSERT INTO churches (id, code, name, "order") VALUES ($1, $2, $3, $4) ON CONFLICT (code) DO NOTHING`,
        [c.id, c.code, c.name, c.order]
      )
    }

    // 중점사항 시드
    const focusAreas = [
      { code: 'event_support', name: '행사시 교통업무 지원', order: 1 },
      { code: 'org_operation', name: '상시조직 구성 및 운영', order: 2 },
      { code: 'vehicle_mgmt', name: '차량 및 주차장 관리', order: 3 },
      { code: 'church_support', name: '지교회 업무지원 / 부서원 충원 및 신앙관리', order: 4 },
    ]
    for (const f of focusAreas) {
      await client.query(
        `INSERT INTO focus_areas (code, name, "order") VALUES ($1, $2, $3) ON CONFLICT (code) DO NOTHING`,
        [f.code, f.name, f.order]
      )
    }

    return { ok: true }
  } finally {
    client.release()
  }
}