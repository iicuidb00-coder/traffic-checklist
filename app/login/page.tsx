'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'password' | 'otp'>('password')
  const [password, setPassword] = useState('')
  const [memberId, setMemberId] = useState('')
  const [authCode, setAuthCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePassword = async () => {
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    setLoading(false)
    if (!res.ok) { setError('비밀번호가 올바르지 않습니다.'); return }
    setStep('otp')
  }

  const handleOtpSend = async () => {
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/otp-send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId }),
    })
    setLoading(false)
    if (!res.ok) { setError('OTP 발송에 실패했습니다. 시온 번호를 확인해주세요.'); return }
    setError('OTP가 발송됐습니다.')
  }

  const handleOtpVerify = async () => {
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/otp-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId, authCode }),
    })
    setLoading(false)
    if (!res.ok) { setError('OTP 코드가 올바르지 않습니다.'); return }
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M20 4L36 12V28L20 36L4 28V12L20 4Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
                <path d="M20 4V36M4 12L36 12M4 28L36 28" stroke="white" strokeWidth="1.5" strokeDasharray="3 3"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">교통과</h1>
            <p className="text-blue-300 text-sm font-medium tracking-widest uppercase">베드로 지파</p>
            <div className="w-16 h-0.5 bg-blue-500/50 rounded-full mt-3" />
          </div>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full " />
              <span className="text-sm ">비밀번호</span>
            </div>
            <div className="w-8 h-px bg-white/20" />
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full " />
              <span className="text-sm ">OTP 인증</span>
            </div>
            <div className="w-8 h-px bg-white/20" />
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-white/20" />
              <span className="text-slate-500 text-sm">완료</span>
            </div>
          </div>
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm text-center ">{error}</div>
          )}
          {step === 'password' && (
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-xs mb-1.5 block">비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handlePassword()}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button onClick={handlePassword} disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all disabled:opacity-50">
                {loading ? '확인 중...' : '다음'}
              </button>
            </div>
          )}
          {step === 'otp' && (
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-xs mb-1.5 block">시온 번호</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={memberId}
                    onChange={e => setMemberId(e.target.value)}
                    placeholder="00000000-00000"
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button onClick={handleOtpSend} disabled={loading}
                    className="px-4 py-3 bg-slate-600 hover:bg-slate-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 whitespace-nowrap">
                    {loading ? '...' : 'OTP 발송'}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1.5 block">OTP 코드 (6자리)</label>
                <input
                  type="text"
                  value={authCode}
                  onChange={e => setAuthCode(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleOtpVerify()}
                  placeholder="6자리 숫자 입력"
                  maxLength={6}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-widest text-center text-xl"
                />
              </div>
              <button onClick={handleOtpVerify} disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all disabled:opacity-50">
                {loading ? '확인 중...' : '로그인'}
              </button>
              <button onClick={() => setStep('password')}
                className="w-full py-2 text-slate-500 text-sm hover:text-slate-300 transition-colors">
                ← 비밀번호 다시 입력
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
