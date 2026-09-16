import { NextResponse } from 'next/server'

export function POST() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const res = NextResponse.redirect(new URL('/login', base))
  res.cookies.delete('session')
  return res
}
