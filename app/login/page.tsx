export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  const errorMsg: Record<string, string> = {
    no_code: '인증 코드를 받지 못했습니다.',
    no_user: '사용자 정보를 조회할 수 없습니다.',
    auth_failed: '로그인 처리 중 오류가 발생했습니다.',
  }
  const error = searchParams.error ? (errorMsg[searchParams.error] ?? '오류가 발생했습니다.') : null
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M20 4L36 12V28L20 36L4 28V12L20 4Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
                <path d="M20 4V36M4 12L36 12M4 28L36 28" stroke="white" strokeWidth="1.5" strokeDasharray="3 3"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">교통과</h1>
            <p className="text-blue-300 text-sm font-medium tracking-widest uppercase">베드로 지파</p>
            <div className="w-16 h-0.5 bg-blue-500/50 rounded-full mt-4" />
            <p className="text-slate-400 text-sm mt-4">월간 체크리스트 관리 시스템</p>
          </div>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-white text-sm font-medium">시온 로그인</span>
            </div>
            <div className="w-8 h-px bg-white/20" />
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-white/20" />
              <span className="text-slate-500 text-sm">OTP</span>
            </div>
            <div className="w-8 h-px bg-white/20" />
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-white/20" />
              <span className="text-slate-500 text-sm">완료</span>
            </div>
          </div>
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-sm text-center">{error}</div>
          )}
          <a href="/api/auth/zion-login" className="block w-full py-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-2xl transition-all text-center text-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5">
            로그인
          </a>
          <p className="text-center text-slate-500 text-xs mt-6">다음 단계에서 위아원 앱으로 받은 6자리 OTP를 입력합니다.</p>
        </div>
      </div>
    </div>
  )
}
