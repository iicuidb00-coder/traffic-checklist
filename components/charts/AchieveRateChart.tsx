'use client'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend,
} from 'recharts'
import { CHURCHES } from '@/lib/constants'

type MonthlyData = { month: number; label: string; total: number; done: number; rate: number }
type ChurchData = {
  churchId: string; churchCode: string; churchName: string
  total: number; done: number; rate: number
  monthlyBreakdown: { month: number; total: number; done: number; rate: number | null }[]
  failCounts: Record<string, number>
}

// 월별 달성률 바차트
export function MonthlyRateChart({ data }: { data: MonthlyData[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(v: number) => [`${v}%`, '달성률']} />
        <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.rate >= 80 ? '#16a34a' : d.rate >= 60 ? '#2563eb' : d.rate >= 40 ? '#d97706' : '#dc2626'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// 교회별 달성률 바차트
export function ChurchRateChart({ data }: { data: ChurchData[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data.map(d => ({ name: d.churchName, rate: d.rate, done: d.done, total: d.total }))}
        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(v: number, _: string, p: { payload: { done: number; total: number } }) =>
          [`${v}% (${p.payload.done}/${p.payload.total})`, '달성률']
        } />
        <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.rate >= 80 ? '#16a34a' : d.rate >= 60 ? '#2563eb' : d.rate >= 40 ? '#d97706' : '#dc2626'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// 교회별 월별 추이 라인차트
export function ChurchTrendChart({ data }: { data: ChurchData[] }) {
  const months = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, label: `${i + 1}월` }))
  const chartData = months.map(m => {
    const row: Record<string, string | number> = { label: m.label }
    data.forEach(c => {
      const mb = c.monthlyBreakdown.find(b => b.month === m.month)
      row[c.churchName] = mb?.rate ?? 0
    })
    return row
  })

  const colors = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed', '#0891b2', '#be185d', '#65a30d']

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(v: number) => [`${v}%`, '']} />
        <Legend />
        {data.map((c, i) => (
          <Line key={c.churchId} type="monotone" dataKey={c.churchName}
            stroke={colors[i % colors.length]} strokeWidth={2} dot={{ r: 3 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

// 미달성 유형 바차트
export function FailTypeChart({ failCounts }: { failCounts: Record<string, number> }) {
  const FAIL_LABELS: Record<string, string> = {
    goal_error: '목표설정오류', no_plan: '계획부재', lack_execution: '실행력부족',
    poor_mgmt: '점검관리미흡', env_fail: '환경변수', communication: '소통단절',
  }
  const data = Object.entries(failCounts).map(([k, v]) => ({ name: FAIL_LABELS[k] ?? k, count: v }))
  if (data.length === 0) return <div className="text-center text-slate-400 text-sm py-10">미달성 항목 없음</div>

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical" margin={{ left: 60, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" tick={{ fontSize: 12 }} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
        <Tooltip />
        <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
