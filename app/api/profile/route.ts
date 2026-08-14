import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'

async function currentUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  return session.user
}

export async function GET() {
  const current = await currentUser()
  if (!current) return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 })
  const rows = await db.select({ id: user.id, name: user.name, email: user.email, language: user.language }).from(user).where(eq(user.id, current.id)).limit(1)
  return NextResponse.json(rows[0] ?? current)
}

export async function PATCH(request: Request) {
  const current = await currentUser()
  if (!current) return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 })
  const body = await request.json() as { name?: string; language?: string }
  const name = body.name?.trim()
  const language = body.language === 'ar' ? 'ar' : body.language === 'en' ? 'en' : undefined
  if (!name || name.length < 2 || name.length > 80) return NextResponse.json({ error: 'Please enter a name between 2 and 80 characters.' }, { status: 400 })
  const rows = await db.update(user).set({ name, ...(language ? { language } : {}), updatedAt: new Date() }).where(eq(user.id, current.id)).returning({ id: user.id, name: user.name, email: user.email, language: user.language })
  return NextResponse.json(rows[0])
}
