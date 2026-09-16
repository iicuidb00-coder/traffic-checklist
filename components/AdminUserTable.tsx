'use client'
import { useState } from 'react'

type User = { id: string; name: string; zionNewNo: string; role: string; churchId: string | null; churchName: string | null }
type Church = { id: string; name: string }

export default function AdminUserTable({ users: init, churches }: { users: User[]; churches: Church[] }) {
  const [users, setUsers] = useState(init)
  const [saving, setSaving] = useState<string | null>(null)

  const update = async (userId: string, data: { role?: string; churchId?: string | null }) => {
    setSaving(userId)
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...data }),
    })
    if (res.ok) {
      const updated = await res.json()
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updated } : u))
    }
    setSaving(null)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 text-slate-500 text-xs border-b border-slate-100">
            <th className="px-5 py-3 text-left font-medium">이름</th>
            <th className="px-4 py-3 text-left font-medium">시온 번호</th>
            <th className="px-4 py-3 text-center font-medium">교회</th>
            <th className="px-4 py-3 text-center font-medium">권한</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {users.map(u => (
            <tr key={u.id} className="hover:bg-slate-50">
              <td className="px-5 py-3 font-medium text-slate-700">{u.name}</td>
              <td className="px-4 py-3 text-slate-400 text-xs font-mono">{u.zionNewNo}</td>
              <td className="px-4 py-3 text-center">
                <select
                  value={u.churchId ?? ''}
                  disabled={saving === u.id}
                  onChange={e => update(u.id, { churchId: e.target.value || null })}
                  className="px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">미지정</option>
                  {churches.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </td>
              <td className="px-4 py-3 text-center">
                <select
                  value={u.role}
                  disabled={saving === u.id}
                  onChange={e => update(u.id, { role: e.target.value })}
                  className="px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="member">담당자</option>
                  <option value="manager">과장</option>
                  <option value="admin">지파 관리자</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
