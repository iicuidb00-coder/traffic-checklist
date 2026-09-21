'use client'
import { useState, useCallback } from 'react'
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
  const [msgType, setMsgType] = useState<'ok' | 'err'>('ok')

  const showMsg = (m: string, type: 'ok' | 'err' = 'ok') => {
    setMsg(m); setMsgType(type); setTimeout(() => setMsg(''), 2500)
  }

  const totalItems = items.length
  const doneItems = items.filter(i => i.result?.isDone).length
  const rate = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0

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
      setItems(prev => [...prev, { ...item, focusAreaId: item.focus_area_id ?? focusAreaId, result: null }])
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
    if (res.ok) { setItems(prev => prev.filter(i => i.id !== id)); showMsg('삭제되었습니다') }
  }

  const updateResult = useCallback(async (itemId: string, data: Partial<ResultData>) => {
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, result: { ...(i.result ?? { isDone: false, achieveTypes: [], failType: null, failDetails: [], note: '' }), ...data } } : i))
  }, [])

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
    } catch { showMsg('저장 실패', 'err') }
    finally { setSaving(p => ({ ...p, [itemId]: false })) }
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="stat-strip" style={{ marginBottom: 16 }}>
        <div className="stat">
          <div className="stat-top"><div className="stat-dot" style={{ background: 'var(--accent)' }} /><div className="stat-label">{churchName} · {year}년 {month}월</div></div>
          <div className="stat-value" style={{ color: rate >= 80 ? 'var(--ok)' : rate >= 60 ? 'var(--accent)' : rate >= 40 ? 'var(--warn)' : 'var(--bad)' }}>{rate}%</div>
          <div className="stat-delta">{doneItems} / {totalItems} 달성</div>
        </div>
        <div className="stat">
          <div className="stat-top"><div className="stat-dot" style={{ background: 'var(--ok)' }} /><div className="stat-label">달성 항목</div></div>
          <div className="stat-value" style={{ color: 'var(--ok)' }}>{doneItems}개</div>
          <div className="stat-delta">체크 완료</div>
        </div>
        <div className="stat">
          <div className="stat-top"><div className="stat-dot" style={{ background: 'var(--bad)' }} /><div className="stat-label">미달성 항목</div></div>
          <div className="stat-value" style={{ color: 'var(--bad)' }}>{totalItems - doneItems}개</div>
          <div className="stat-delta">추가 확인 필요</div>
        </div>
        <div className="stat">
          <div className="stat-top"><div className="stat-dot" style={{ background: 'var(--neu)' }} /><div className="stat-label">전체 항목</div></div>
          <div className="stat-value">{totalItems}개</div>
          <div className="stat-delta">이번 달 계획</div>
        </div>
      </div>

      {msg && (
        <div className={`badge ${msgType === 'ok' ? 'success' : 'danger'}`} style={{ marginBottom: 12, display: 'block', padding: '8px 12px', borderRadius: 6 }}>
          {msg}
        </div>
      )}

      {FOCUS_AREAS.map(fa => {
        const faItems = items.filter(i => i.focusAreaId === fa.id)
        const faDone = faItems.filter(i => i.result?.isDone).length

        return (
          <div key={fa.id} className="panel" style={{ marginBottom: 12 }}>
            <div className="panel-head">
              <div className="gem m" style={{ background: 'var(--accent-weak)', color: 'var(--accent-ink)', fontWeight: 800 }}>{fa.id}</div>
              <span className="panel-title">{fa.name}</span>
              <span className="panel-sub">
                <span className={`badge ${faDone === faItems.length && faItems.length > 0 ? 'success' : 'neutral'}`}>
                  {faDone}/{faItems.length}
                </span>
              </span>
            </div>

            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>완료</th>
                    <th>월간 추진 리스트</th>
                    <th style={{ width: 120 }}>목표일자</th>
                    <th style={{ width: 80 }}>상태</th>
                    <th style={{ width: 80 }}>상세</th>
                    {!readonly && <th style={{ width: 50 }}>삭제</th>}
                  </tr>
                </thead>
                <tbody>
                  {faItems.length === 0 ? (
                    <tr><td colSpan={readonly ? 5 : 6} style={{ textAlign: 'center', color: 'var(--ink-3)', padding: '20px' }}>항목이 없습니다</td></tr>
                  ) : faItems.map(item => {
                    const r = item.result ?? { isDone: false, achieveTypes: [], failType: null, failDetails: [], note: '' }
                    const isOpen = expanded[item.id]
                    return (
                      <>
                        <tr key={item.id} style={{ background: r.isDone ? 'var(--ok-bg)' : undefined }}>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              disabled={readonly}
                              onClick={() => updateResult(item.id, { isDone: !r.isDone })}
                              style={{ background: 'none', border: 'none', cursor: readonly ? 'default' : 'pointer', fontSize: 18 }}
                            >
                              {r.isDone ? '✅' : '⬜'}
                            </button>
                          </td>
                          <td style={{ textDecoration: r.isDone ? 'line-through' : 'none', color: r.isDone ? 'var(--ink-3)' : 'var(--ink)' }}>
                            {item.title}
                          </td>
                          <td style={{ color: 'var(--ink-3)', fontSize: 12 }}>{item.targetDate ?? '-'}</td>
                          <td>
                            {r.isDone
                              ? <span className="badge success">달성</span>
                              : r.failType
                              ? <span className="badge danger">미달성</span>
                              : <span className="badge neutral">미입력</span>}
                          </td>
                          <td>
                            {!readonly && (
                              <button
                                onClick={() => setExpanded(p => ({ ...p, [item.id]: !p[item.id] }))}
                                className="btn"
                                style={{ height: 26, padding: '0 10px', fontSize: 11 }}
                              >
                                {isOpen ? '닫기' : '입력'}
                              </button>
                            )}
                          </td>
                          {!readonly && (
                            <td>
                              <button onClick={() => deleteItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--bad)', fontSize: 14 }}>✕</button>
                            </td>
                          )}
                        </tr>

                        {isOpen && !readonly && (
                          <tr key={`${item.id}-detail`}>
                            <td colSpan={6} style={{ background: 'var(--surface-2)', padding: '16px' }}>
                              {r.isDone ? (
                                <div>
                                  <div className="overline" style={{ marginBottom: 8 }}>달성 유형 (복수 선택)</div>
                                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                                    {ACHIEVE_TYPES.map(t => (
                                      <label key={t.key} style={{ cursor: 'pointer' }}>
                                        <input type="checkbox" className="hidden"
                                          checked={r.achieveTypes?.includes(t.key) ?? false}
                                          onChange={e => {
                                            const next = e.target.checked
                                              ? [...(r.achieveTypes ?? []), t.key]
                                              : (r.achieveTypes ?? []).filter(x => x !== t.key)
                                            updateResult(item.id, { achieveTypes: next })
                                          }}
                                          style={{ display: 'none' }}
                                        />
                                        <span className={`chip`} style={{
                                          background: r.achieveTypes?.includes(t.key) ? 'var(--accent)' : 'var(--surface)',
                                          color: r.achieveTypes?.includes(t.key) ? '#fff' : 'var(--ink-2)',
                                          borderColor: r.achieveTypes?.includes(t.key) ? 'var(--accent)' : 'var(--line-2)',
                                          cursor: 'pointer'
                                        }}>
                                          {t.label}
                                        </span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="overline" style={{ marginBottom: 8 }}>미달성 유형</div>
                                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                                    {FAIL_TYPES.map(t => (
                                      <label key={t.key} style={{ cursor: 'pointer' }}>
                                        <input type="radio" name={`failType-${item.id}`} style={{ display: 'none' }}
                                          checked={r.failType === t.key}
                                          onChange={() => updateResult(item.id, { failType: t.key, failDetails: [] })}
                                        />
                                        <span className="chip" style={{
                                          background: r.failType === t.key ? 'var(--bad)' : 'var(--surface)',
                                          color: r.failType === t.key ? '#fff' : 'var(--ink-2)',
                                          borderColor: r.failType === t.key ? 'var(--bad)' : 'var(--line-2)',
                                          cursor: 'pointer'
                                        }}>
                                          {t.label}
                                        </span>
                                      </label>
                                    ))}
                                  </div>
                                  {r.failType && (
                                    <>
                                      <div className="overline" style={{ marginBottom: 8 }}>세부 원인</div>
                                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                                        {FAIL_DETAILS.filter(d => d.group === r.failType).map(d => (
                                          <label key={d.key} style={{ cursor: 'pointer' }}>
                                            <input type="checkbox" style={{ display: 'none' }}
                                              checked={r.failDetails?.includes(d.key) ?? false}
                                              onChange={e => {
                                                const next = e.target.checked
                                                  ? [...(r.failDetails ?? []), d.key]
                                                  : (r.failDetails ?? []).filter(x => x !== d.key)
                                                updateResult(item.id, { failDetails: next })
                                              }}
                                            />
                                            <span className="badge" style={{
                                              background: r.failDetails?.includes(d.key) ? 'var(--warn)' : 'var(--warn-bg)',
                                              color: r.failDetails?.includes(d.key) ? '#fff' : 'var(--warn)',
                                              cursor: 'pointer', height: 'auto', padding: '3px 8px'
                                            }}>
                                              {d.label}
                                            </span>
                                          </label>
                                        ))}
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                              <div style={{ marginBottom: 12 }}>
                                <div className="overline" style={{ marginBottom: 6 }}>비고</div>
                                <textarea rows={2} value={r.note ?? ''}
                                  onChange={e => updateResult(item.id, { note: e.target.value })}
                                  placeholder="특이사항을 입력하세요"
                                  style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--line-2)', borderRadius: 6, fontSize: 13, fontFamily: 'inherit', resize: 'none', background: 'var(--surface)' }}
                                />
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button onClick={() => saveResult(item.id)} disabled={saving[item.id]} className="btn primary">
                                  {saving[item.id] ? '저장 중...' : '저장'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {!readonly && (
              <div className="panel-body" style={{ borderTop: '1px solid var(--line)', display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  value={newTitle[fa.id] ?? ''}
                  onChange={e => setNewTitle(p => ({ ...p, [fa.id]: e.target.value }))}
                  onKeyDown={e => { if (e.key === 'Enter') addItem(fa.id) }}
                  placeholder="월간 추진 리스트 항목 추가..."
                  style={{ flex: 1, padding: '7px 10px', border: '1px solid var(--line-2)', borderRadius: 6, fontSize: 13, fontFamily: 'inherit' }}
                />
                <input
                  type="text"
                  value={newTarget[fa.id] ?? ''}
                  onChange={e => setNewTarget(p => ({ ...p, [fa.id]: e.target.value }))}
                  placeholder="목표일자"
                  style={{ width: 110, padding: '7px 10px', border: '1px solid var(--line-2)', borderRadius: 6, fontSize: 13, fontFamily: 'inherit' }}
                />
                <button onClick={() => addItem(fa.id)} className="btn primary">+ 추가</button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}