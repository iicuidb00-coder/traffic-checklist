// Zion OAuth + 사용자정보 조회 (VOSS 문서 기준)

export function buildZionAuthorizeUrl(): string {
  const base = process.env.ZION_AUTHORIZE_URL!
  const params = new URLSearchParams({
    client_id: process.env.ZION_APP_KEY!,
    redirect_uri: process.env.ZION_REDIRECT_URI!,
    response_type: 'code',
    state: Math.random().toString(36).slice(2),
    encode_state: 'true',
  })
  return `${base}?${params}`
}

export async function exchangeToken(code: string): Promise<{ access_token: string; refresh_token: string }> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.ZION_APP_KEY!,
    redirect_uri: process.env.ZION_REDIRECT_URI!,
    code,
  })
  const res = await fetch(process.env.ZION_TOKEN_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: body.toString(),
  })
  if (!res.ok) throw new Error(`token exchange failed: ${res.status}`)
  return res.json()
}

export async function fetchZionMe(accessToken: string) {
  const url = new URL(process.env.ZION_ME_URL!)
  url.searchParams.append('properties', 'NEW_NO')
  url.searchParams.append('properties', 'NAME')
  url.searchParams.append('properties', 'ORGANIZATION_WITH_DUTY')

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: '*/*' },
    signal: AbortSignal.timeout(5000),
  })
  if (!res.ok) throw new Error(`/me failed: ${res.status}`)
  const data = await res.json()
  return {
    newNo: data?.data?.properties?.newNo as string,
    name: data?.data?.properties?.name as string,
    organizationWithDuties: data?.data?.organizationWithDuties as Array<{
      organization: { name: string; level: string }
      duty: { positionName: string }
    }> | undefined,
  }
}
