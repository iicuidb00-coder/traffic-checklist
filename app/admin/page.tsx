import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/Sidebar'
import AdminUserTable from '@/components/AdminUserTable'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const session = { role: 'admin', churchId: null, name: '관리자' }

  let users: { id: string; name: string; zionNewNo: string; role: string; churchId: string | null; churchName: string | null }[] = []
  let churches: { id: string; name: string }[] = []

  try {
    const rawUsers = await prisma.user.findMany({
      include: { church: true },
      orderBy: { createdAt: 'asc' },
    })
    churches = await prisma.church.findMany({ orderBy: { order: 'asc' } })
    users = rawUsers.map(u => ({
      id: u.id, name: u.name, zionNewNo: u.zionNewNo,
      role: u.role, churchId: u.churchId,
      churchName: (u.church as { name: string } | null)?.name ?? null,
    }))
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