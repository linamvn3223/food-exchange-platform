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

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return NextResponse.json({ error: 'Please sign in before posting an item.' }, { status: 401 })
    const body = await request.json() as Record<string, unknown>
    const title = typeof body.title === 'string' ? body.title.trim() : ''
    const category = typeof body.category === 'string' ? body.category.trim() : ''
    const quantity = typeof body.quantity === 'string' ? body.quantity.trim() : ''
    const provider = typeof body.provider === 'string' ? body.provider.trim() : ''
    const description = typeof body.description === 'string' ? body.description.trim() : ''
    const expiryAt = typeof body.expiryAt === 'string' ? new Date(body.expiryAt) : null
    if (!title || !category || !quantity || !provider || !description || !expiryAt || Number.isNaN(expiryAt.getTime())) return NextResponse.json({ error: 'Please complete every field with valid information.' }, { status: 400 })
    if (expiryAt.getTime() <= Date.now()) return NextResponse.json({ error: 'Best before must be in the future.' }, { status: 400 })
    const [post] = await db.insert(donations).values({ title, category, quantity, provider, description, expiryAt, posterUserId: session.user.id, price: 'Free', deliveryAvailable: false, status: 'active' }).returning()
    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error('[v0] post creation failed', error)
    return NextResponse.json({ error: 'We could not publish that item. Please try again.' }, { status: 500 })
  }
}
