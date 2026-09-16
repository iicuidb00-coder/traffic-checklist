import { cookies } from 'next/headers'

export type SessionUser = {
  zionNewNo: string
  name: string
  role: 'member' | 'manager' | 'admin'
  churchId: string | null
  churchName: string | null
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get('session')?.value
  if (!raw) return null
  try {
    return JSON.parse(Buffer.from(raw, 'base64').toString('utf-8')) as SessionUser
  } catch {
    return null
  }
}

export function encodeSession(user: SessionUser): string {
  return Buffer.from(JSON.stringify(user)).toString('base64')
}
