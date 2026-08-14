import { NextResponse } from 'next/server'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { donations } from '@/lib/db/schema'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mine = searchParams.get('mine') === 'true'
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (mine && !session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const rows = await db.select().from(donations).where(mine ? eq(donations.posterUserId, session!.user.id) : eq(donations.status, 'active')).orderBy(desc(donations.createdAt))
    return NextResponse.json(rows)
  } catch { return NextResponse.json({ error: 'Unable to load posts' }, { status: 500 }) }
}
