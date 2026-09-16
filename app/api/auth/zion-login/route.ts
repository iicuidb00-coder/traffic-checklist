import { buildZionAuthorizeUrl } from '@/lib/zion'
import { NextResponse } from 'next/server'

export function GET() {
  const url = buildZionAuthorizeUrl()
  return NextResponse.redirect(url)
}
