export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/Sidebar'
import AdminUserTable from '@/components/AdminUserTable'

export default async function AdminPage() {
const session = { role: 'admin', churchId: null }
  if (session.role !== 'admin') redirect('/')

  const users = await prisma.user.findMany({
    include: { church: true },
    orderBy: { createdAt: 'asc' },
  })
  const churches = await prisma.church.findMany({ orderBy: { order: 'asc' } })

  return (
    <div className="flex min-h-screen">
      <Sidebar role={session.role} churchId={session.churchId} />
      <main className="ml-60 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">사용자 관리</h1>
          <p className="text-slate-500 text-sm mt-1">교회 배정 및 권한 설정</p>
        </div>
        <AdminUserTable users={users.map(u => ({
          id: u.id, name: u.name, zionNewNo: u.zionNewNo,
          role: u.role, churchId: u.churchId, churchName: u.church?.name ?? null,
        }))} churches={churches.map(c => ({ id: c.id, name: c.name }))} />
      </main>
    </div>
  )
}
