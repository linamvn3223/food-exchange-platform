import { NextResponse } from 'next/server'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { categories } from '@/lib/db/schema'

const defaults = ['Fresh produce', 'Pantry staples', 'Prepared meals', 'Bakery & bread']
export async function GET() {
  try {
    const rows = await db.select({ name: categories.name }).from(categories).orderBy(asc(categories.name))
    return NextResponse.json([...new Set([...defaults, ...rows.map(row => row.name)])])
  } catch {
    return NextResponse.json(defaults)
  }
}
export async function POST(request: Request) {
  const body = await request.json() as { name?: string }
  const name = body.name?.trim().replace(/\s+/g, ' ')
  if (!name || name.length < 2 || name.length > 40) return NextResponse.json({ error: 'Category names must be 2–40 characters.' }, { status: 400 })
  const existing = await db.select({ id: categories.id, name: categories.name }).from(categories).where(eq(categories.name, name)).limit(1)
  if (existing[0]) return NextResponse.json(existing[0])
  const created = await db.insert(categories).values({ name }).returning({ id: categories.id, name: categories.name })
  return NextResponse.json(created[0], { status: 201 })
}
