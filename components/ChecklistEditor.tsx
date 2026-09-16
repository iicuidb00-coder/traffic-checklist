'use client'
import { useState, useCallback } from 'react'
import { Plus, Trash2, CheckCircle2, XCircle, ChevronDown, ChevronUp, Save } from 'lucide-react'
import { FOCUS_AREAS, ACHIEVE_TYPES, FAIL_TYPES, FAIL_DETAILS } from '@/lib/constants'

type ResultData = {
  isDone: boolean
  achieveTypes: string[]
  failType: string | null
  failDetails: string[]
  note: string
}

type Item = {
  id: string
  title: string
  targetDate: string | null
  focusAreaId: number
  result: ResultData | null
}

type Props = {
  churchId: string
  churchName: string
  year: number
  month: number
  initialItems: Item[]
  readonly?: boolean
}

export default function ChecklistEditor({ churchId, churchName, year, month, initialItems, readonly = false }: Props) {
  const [items, setItems] = useState<Item[]>(initialItems)
  const [newTitle, setNewTitle] = useState<Record<number, string>>({})
  const [newTarget, setNewTarget] = useState<Record<number, string>>({})
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [msg, setMsg] = useState('')

  const showMsg = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 2500) }

  const addItem = async (focusAreaId: number) => {
    const title = newTitle[focusAreaId]?.trim()
    if (!title) return
    const res = await fetch('/api/checklist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ churchId, focusAreaId, year, month, title, targetDate: newTarget[focusAreaId] ?? '' }),
    })
    if (res.ok) {
      const item = await res.json()
      setItems(prev => [...prev, { ...item, result: null }])
      setNewTitle(p => ({ ...p, [focusAreaId]: '' }))
      setNewTarget(p => ({ ...p, [focusAreaId]: '' }))
      showMsg('항목이 추가되었습니다')
    }
  }

  const deleteItem = async (id: string) => {
    if (!confirm('항목을 삭제할까요?')) return
    const res = await fetch('/api/checklist/items', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      setItems(prev => prev.filter(i => i.id !== id))
      showMsg('삭제되었습니다')
    }
  }

  const updateResult = useCallback(async (itemId: string, data: Partial<ResultData>) => {
    const item = items.find(i => i.id === itemId)
    if (!item) return
    const current = item.result ?? { isDone: false, achieveTypes: [], failType: null, failDetails: [], note: '' }
    const next = { ...current, ...data }
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, result: next } : i))
  }, [items])

  const saveResult = async (itemId: string) => {
    const item = items.find(i => i.id === itemId)
    if (!item) return
    setSaving(p => ({ ...p, [itemId]: true }))
    try {
      await fetch('/api/checklist/result', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, ...item.result }),
      })
      showMsg('저장되었습니다')
    } finally {
      setSaving(p => ({ ...p, [itemId]: false }))
    }
  }

  const toggleExpand = (id: string) => setExpanded(p => ({ ...p, [id]: !p[id] }))

  const totalItems = items.length
  const doneItems = items.filter(i => i.result?.isDone).length
  const rate = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0

  return (
    <div>
      {/* 헤더 요약 */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">{churchName} — {year}년 {month}월</h2>
          <p className="text-slate-500 text-sm mt-0.5">총 {totalItems}개 항목 · {doneItems}개 달성</p>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${rate >= 80 ? 'text-green-600' : rate >= 60 ? 'text-blue-600' : rate >= 40 ? 'text-amber-600' : 'text-red-500'}`}>
            {rate}%
          </div>
          <div className="w-32 h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
            <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${rate}%` }} />
          </div>
        </div>
      </div>

      {msg && (
        <div className="mb-4 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-200">{msg}</div>
      )}

      {/* 중점사항별 항목 */}
      {FOCUS_AREAS.map(fa => {
        const faItems = items.filter(i => i.focusAreaId === fa.id)
        return (
          <div key={fa.id} className="bg-white rounded-xl border border-slate-200 mb-4 overflow-hidden">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">{fa.id}</span>
                <span className="font-semibold text-slate-700 text-sm">{fa.name}</span>
              </div>
              <span className="text-xs text-slate-400">{faItems.filter(i => i.result?.isDone).length}/{faItems.length}</span>
            </div>

            <div className="divide-y divide-slate-100">
              {faItems.length === 0 && (
                <div className="px-5 py-4 text-slate-400 text-sm text-center">항목이 없습니다</div>
              )}
              {faItems.map(item => {
                const r = item.result ?? { isDone: false, achieveTypes: [], failType: null, failDetails: [], note: '' }
                const isOpen = expanded[item.id]
                return (
                  <div key={item.id}>
                    {/* 항목 행 */}
                    <div className="px-5 py-3 flex items-center gap-3">
                      {/* 달성 토글 */}
                      <button
                        disabled={readonly}
                        onClick={() => updateResult(item.id, { isDone: !r.isDone })}
                        className={`flex-shrink-0 transition-colors ${r.isDone ? 'text-green-500' : 'text-slate-300 hover:text-slate-400'}`}
                      >
                        <CheckCircle2 size={22} fill={r.isDone ? 'currentColor' : 'none'} />
                      </button>

                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${r.isDone ? 'line-through text-slate-400' : 'text-slate-700'}`}>{item.title}</p>
                        {item.targetDate && (
                          <p className="text-xs text-slate-400 mt-0.5">📅 {item.targetDate}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {r.isDone ? (
                          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">달성</span>
                        ) : r.failType ? (
                          <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full">미달성</span>
                        ) : null}

                        {!readonly && (
                          <>
                            <button onClick={() => toggleExpand(item.id)} className="text-slate-400 hover:text-blue-500 p-1">
                              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            <button onClick={() => deleteItem(item.id)} className="text-slate-300 hover:text-red-500 p-1">
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* 상세 패널 */}
                    {isOpen && !readonly && (
                      <div className="bg-slate-50 border-t border-slate-100 px-5 py-4 space-y-4">
                        {r.isDone ? (
                          <div>
                            <p className="text-xs font-semibold text-slate-600 mb-2">달성 유형 (복수 선택)</p>
                            <div className="flex flex-wrap gap-2">
                              {ACHIEVE_TYPES.map(t => (
                                <label key={t.key} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs cursor-pointer border transition-colors ${
                                  r.achieveTypes?.includes(t.key) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                                }`}>
                                  <input type="checkbox" className="hidden"
                                    checked={r.achieveTypes?.includes(t.key) ?? false}
                                    onChange={e => {
                                      const next = e.target.checked
                                        ? [...(r.achieveTypes ?? []), t.key]
                                        : (r.achieveTypes ?? []).filter(x => x !== t.key)
                                      updateResult(item.id, { achieveTypes: next })
                                    }}
                                  />
                                  {t.label}
                                </label>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs font-semibold text-slate-600 mb-2">미달성 유형</p>
                              <div className="flex flex-wrap gap-2">
                                {FAIL_TYPES.map(t => (
                                  <label key={t.key} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs cursor-pointer border transition-colors ${
                                    r.failType === t.key ? 'bg-red-500 text-white border-red-500' : 'bg-white text-slate-600 border-slate-200 hover:border-red-300'
                                  }`}>
                                    <input type="radio" name={`failType-${item.id}`} className="hidden"
                                      checked={r.failType === t.key}
                                      onChange={() => updateResult(item.id, { failType: t.key, failDetails: [] })}
                                    />
                                    {t.label}
                                  </label>
                                ))}
                              </div>
                            </div>
                            {r.failType && (
                              <div>
                                <p className="text-xs font-semibold text-slate-600 mb-2">세부 원인</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {FAIL_DETAILS.filter(d => d.group === r.failType).map(d => (
                                    <label key={d.key} className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs cursor-pointer border transition-colors ${
                                      r.failDetails?.includes(d.key) ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-slate-500 border-slate-200 hover:border-orange-300'
                                    }`}>
                                      <input type="checkbox" className="hidden"
                                        checked={r.failDetails?.includes(d.key) ?? false}
                                        onChange={e => {
                                          const next = e.target.checked
                                            ? [...(r.failDetails ?? []), d.key]
                                            : (r.failDetails ?? []).filter(x => x !== d.key)
                                          updateResult(item.id, { failDetails: next })
                                        }}
                                      />
                                      {d.label}
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 비고 */}
                        <div>
                          <p className="text-xs font-semibold text-slate-600 mb-1.5">비고 / 특이사항</p>
                          <textarea
                            rows={2}
                            value={r.note ?? ''}
                            onChange={e => updateResult(item.id, { note: e.target.value })}
                            placeholder="특이사항을 입력하세요"
                            className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => saveResult(item.id)}
                            disabled={saving[item.id]}
                            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
                          >
                            <Save size={14} />
                            {saving[item.id] ? '저장 중...' : '저장'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* 항목 추가 */}
            {!readonly && (
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTitle[fa.id] ?? ''}
                    onChange={e => setNewTitle(p => ({ ...p, [fa.id]: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') addItem(fa.id) }}
                    placeholder="월간 추진 리스트 항목 추가..."
                    className="flex-1 text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <input
                    type="text"
                    value={newTarget[fa.id] ?? ''}
                    onChange={e => setNewTarget(p => ({ ...p, [fa.id]: e.target.value }))}
                    placeholder="목표일자"
                    className="w-28 text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <button
                    onClick={() => addItem(fa.id)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
