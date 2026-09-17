export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  const errorMsg: Record<string, string> = {
    no_code: '인증 코드를 받지 못했습니다. 다시 시도해주세요.',
    no_user: '사용자 정보를 조회할 수 없습니다.',
    auth_failed: '로그인 처리 중 오류가 발생했습니다.',
  }
  const error = searchParams.error ? (errorMsg[searchParams.error] ?? '알 수 없는 오류가 발생했습니다.') : null
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm flex flex-col items-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mb-6">
          <span className="text-white text-3xl font-bold">V</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">베드로 지파 교통과</h1>
        <p className="text-slate-500 text-sm">월간 체크리스트 관리 시스템</p>
      </div>
      <div className="w-full max-w-sm mb-8">
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <span className="text-slate-800 font-semibold">시온 로그인</span>
          <span>›</span>
          <span>OTP</span>
          <span>›</span>
          <span>완료</span>
        </div>
      </div>
      {error && (
        <div className="w-full max-w-sm mb-4 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>
      )}
      <div className="w-full max-w-sm">
        <a href="/api/auth/zion-login" className="block w-full py-4 px-6 bg-slate-900 hover:bg-slate-700 text-white font-bold rounded-2xl transition-colors text-center text-base">
          로 그 인
        </a>
        <p className="text-center text-slate-400 text-xs mt-4">다음 단계에서 위아원 앱으로 받은 6자리 OTP를 입력합니다.</p>
      </div>
    </div>
  )
}
