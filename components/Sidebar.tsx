'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { CHURCHES } from '@/lib/constants'

type Props = { role: string; churchId: string | null }

export default function Sidebar({ role, churchId }: Props) {
  const path = usePathname()
  const [churchOpen, setChurchOpen] = useState(false)
  const isAdmin = role === 'admin' || role === 'manager'

  return (
    <aside className="sidebar">
      {/* 브랜드 */}
      <div className="brand">
        <div className="brand-mark" style={{ width: 28, height: 28 }}>
          <div style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: 7, display: 'grid', placeItems: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>교</span>
          </div>
        </div>
        <div>
          <div className="brand-name">베드로 지파</div>
          <div className="brand-sub">교통과 체크리스트</div>
        </div>
      </div>

      {/* 네비게이션 */}
      <nav className="nav">
        <Link href="/" className={`nav-item${path === '/' ? ' active' : ''}`}>
          <svg className="ic" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/>
            <rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/>
          </svg>
          전체 대시보드
        </Link>

        {isAdmin && (
          <>
            <button
              onClick={() => setChurchOpen(v => !v)}
              className="nav-item"
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <svg className="ic" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 12V6l6-4 6 4v6"/><path d="M6 12V9h4v3"/>
              </svg>
              교회별 대시보드
              <span style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.5 }}>{churchOpen ? '▲' : '▼'}</span>
            </button>
            {churchOpen && (
              <div style={{ paddingLeft: 12 }}>
                {CHURCHES.map(c => (
                  <Link key={c.code} href={`/dashboard/${c.code}`}
                    className={`nav-item${path === `/dashboard/${c.code}` ? ' active' : ''}`}
                    style={{ fontSize: 12 }}>
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        <div className="nav-label">체크리스트</div>

        <Link href="/checklist" className={`nav-item${path === '/checklist' ? ' active' : ''}`}>
          <svg className="ic" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="12" height="12" rx="2"/>
            <path d="M5 8l2 2 4-4"/>
          </svg>
          이번 달 체크리스트
        </Link>

        {isAdmin && (
          <>
            <div className="nav-label">교회별 관리</div>
            {CHURCHES.map(c => (
              <Link key={c.code} href={`/checklist/${c.code}`}
                className={`nav-item${path === `/checklist/${c.code}` ? ' active' : ''}`}
                style={{ fontSize: 12 }}>
                {c.name}
              </Link>
            ))}
          </>
        )}

        {isAdmin && (
          <>
            <div className="nav-label">설정</div>
            <Link href="/admin" className={`nav-item${path === '/admin' ? ' active' : ''}`}>
              <svg className="ic" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="6" r="3"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
              </svg>
              사용자 관리
            </Link>
          </>
        )}
      </nav>

      {/* 하단 로그아웃 */}
      <div className="sidebar-foot">
        <div className="avatar">관</div>
        <div>
          <div className="who-name">관리자</div>
          <div className="who-role">베드로 지파</div>
        </div>
      
      </div>
    </aside>
  )
}