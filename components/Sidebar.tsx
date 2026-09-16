'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ClipboardList, Settings, LogOut, ChevronDown, ChevronRight } from 'lucide-react'
import { CHURCHES } from '@/lib/constants'
import { useState } from 'react'

type Props = { role: string; churchId: string | null }

export default function Sidebar({ role, churchId }: Props) {
  const path = usePathname()
  const [churchOpen, setChurchOpen] = useState(false)
  const isAdmin = role === 'admin' || role === 'manager'

  const linkCls = (href: string) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
      path === href ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
    }`

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-slate-800 flex flex-col z-40">
      {/* 로고 */}
      <div className="px-5 py-5 border-b border-slate-700">
        <p className="text-white font-bold text-base leading-tight">베드로 지파</p>
        <p className="text-slate-400 text-xs mt-0.5">교통과 월간 체크리스트</p>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {/* 전체 대시보드 */}
        <Link href="/" className={linkCls('/')}>
          <LayoutDashboard size={16} /> 전체 대시보드
        </Link>

        {/* 교회별 대시보드 */}
        {isAdmin && (
          <div>
            <button
              onClick={() => setChurchOpen(v => !v)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <LayoutDashboard size={16} />
              <span className="flex-1 text-left">교회별 대시보드</span>
              {churchOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {churchOpen && (
              <div className="ml-4 mt-1 space-y-0.5">
                {CHURCHES.map(c => (
                  <Link
                    key={c.code}
                    href={`/dashboard/${c.code}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors ${
                      path === `/dashboard/${c.code}`
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 내 교회 대시보드 (일반 사용자) */}
        {!isAdmin && churchId && (
          <Link href={`/dashboard/${CHURCHES.find(() => true)?.code ?? ''}`} className={linkCls('/dashboard')}>
            <LayoutDashboard size={16} /> 우리 교회 현황
          </Link>
        )}

        <div className="border-t border-slate-700 my-2" />

        {/* 체크리스트 */}
        <Link href="/checklist" className={linkCls('/checklist')}>
          <ClipboardList size={16} /> 이번 달 체크리스트
        </Link>

        {isAdmin && (
          <>
            <div className="px-4 pt-3 pb-1">
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">교회별 관리</p>
            </div>
            {CHURCHES.map(c => (
              <Link
                key={c.code}
                href={`/checklist/${c.code}`}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-xs transition-colors ${
                  path === `/checklist/${c.code}`
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {c.name} 체크리스트
              </Link>
            ))}
          </>
        )}

        {isAdmin && (
          <>
            <div className="border-t border-slate-700 my-2" />
            <Link href="/admin" className={linkCls('/admin')}>
              <Settings size={16} /> 사용자 관리
            </Link>
          </>
        )}
      </nav>

      {/* 로그아웃 */}
      <div className="p-3 border-t border-slate-700">
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <LogOut size={16} /> 로그아웃
          </button>
        </form>
      </div>
    </aside>
  )
}
