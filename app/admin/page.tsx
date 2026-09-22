import pool from '@/lib/db'
import Sidebar from '@/components/Sidebar'
import AdminUserTable from '@/components/AdminUserTable'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const session = { role: 'admin', churchId: null, name: '관리자' }

  let users: { id: string; name: string; zionNewNo: string; role: string; churchId: string | null; churchName: string | null }[] = []
  let churches: { id: string; name: string }[] = []

  try {
    const client = await pool.connect()
    try {
      const { rows: rawUsers } = await client.query(
        `SELECT u.*, c.name as church_name FROM users u LEFT JOIN churches c ON u.church_id = c.id ORDER BY u.created_at`
      )
      const { rows: churchRows } = await client.query(`SELECT id, name FROM churches ORDER BY "order"`)
      churches = churchRows
      users = rawUsers.map((u: Record<string, string>) => ({
        id: u.id, name: u.name, zionNewNo: u.zion_new_no,
        role: u.role, churchId: u.church_id, churchName: u.church_name ?? null,
      }))
    } finally {
      client.release()
    }
  } catch {}

  return (
    <div className="flex min-h-screen">
      <Sidebar role={session.role} churchId={session.churchId} />
      <main className="ml-60 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">사용자 관리</h1>
          <p className="text-slate-500 text-sm mt-1">교회 배정 및 권한 설정</p>
        </div>
        <AdminUserTable users={users} churches={churches} />
      </main>
    </div>
  )
}