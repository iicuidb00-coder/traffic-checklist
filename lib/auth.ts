export type SessionUser = {
  zionNewNo: string
  name: string
  role: 'member' | 'manager' | 'admin'
  churchId: string | null
  churchName: string | null
}

// 로그인 기능을 제거했으므로 항상 관리자 세션을 반환한다.
const OPEN_SESSION: SessionUser = {
  zionNewNo: 'open',
  name: 'admin',
  role: 'admin',
  churchId: null,
  churchName: null,
}

export async function getSession(): Promise<SessionUser | null> {
  return OPEN_SESSION
}