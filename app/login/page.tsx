export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  const errorMsg: Record<string, string> = {
    no_code: '인증 코드를 받지 못했습니다. 다시 시도해주세요.',
    no_user: '사용자 정보를 조회할 수 없습니다.',
    auth_failed: '로그인 처리 중 오류가 발생했습니다.',
  }
  const error = searchParams.error ? (errorMsg[searchParams.error] ?? '알 수 없는 오류가 발생했습니다.') : null

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-2xl font-bold">교</span>
        </div>
        <h1 className="text-xl font-bold text-slate-800 mb-1">베드로 지파 교통과</h1>
        <p className="text-slate-500 text-sm mb-8">월간 체크리스트 관리 시스템</p>
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">{error}</div>
        )}
        <a href="/api/auth/zion-login"
          className="block w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm">
          시온 로그인으로 시작하기
        </a>
        <p className="text-slate-400 text-xs mt-4">시온 계정으로 로그인하세요</p>
      </div>
    </div>
  )
}
