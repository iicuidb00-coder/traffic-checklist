export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const correct = process.env.APP_PASSWORD ?? 'peter2024'
  if (password !== correct) {
    return NextResponse.json({ error: 'wrong_password' }, { status: 401 })
  }
  return NextResponse.json({ ok: true })
}
