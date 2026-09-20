export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { initDatabase } from '@/lib/db'

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.INIT_SECRET) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  try {
    const result = await initDatabase()
    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}