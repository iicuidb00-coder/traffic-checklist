import type { Metadata } from 'next'


import './globals.css'


export const metadata: Metadata = {
  
  title: '교통과 체크리스트',
  description: '베드로 지파 교통과 월간 업무계획 달성 관리 시스템',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-[var(--bg)]">{children}</body>
    </html>
  )
}

