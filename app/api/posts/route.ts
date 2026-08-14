import { NextResponse } from 'next/server'
import { and, desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { donations } from '@/lib/db/schema'
import { ensureAnonymousSchema, normalizeContact, validContact } from '@/lib/contact'

const sampleItems = [
  ...['Fresh produce', 'Pantry staples', 'Prepared meals', 'Bakery & bread'].flatMap((category, index) => [
    { id: -(index * 3 + 1), title: ['Garden vegetables', 'Rice and lentil pantry box', 'Family pasta dinner', 'Morning bakery basket'][index], category, provider: ['Greenway neighbors', 'Community pantry', 'Riverside kitchen', 'Sunrise bakery'][index], quantity: ['3 boxes', '8 portions', '5 meals', '2 bags'][index], expiryAt: new Date(Date.now() + 86400000 * (index + 1)).toISOString(), description: ['Seasonal vegetables, washed and ready to cook.', 'Rice, lentils, beans, and spices for a generous meal.', 'Freshly prepared vegetarian pasta with salad.', 'Bread, rolls, and pastries from today’s bake.'][index], deliveryAvailable: index === 2, status: 'active' },
    { id: -(index * 3 + 2), title: ['Fruit share bag', 'Canned goods bundle', 'Soup for neighbors', 'Sourdough loaves'][index], category, provider: ['Maple street', 'Good Neighbors Hub', 'Oak community kitchen', 'Corner oven'][index], quantity: ['4 bags', '12 cans', '6 containers', '4 loaves'][index], expiryAt: new Date(Date.now() + 86400000 * (index + 2)).toISOString(), description: ['Apples, bananas, and oranges to share.', 'A shelf-stable mix for your pantry.', 'Warm vegetable soup, portioned and labeled.', 'Fresh loaves baked this morning.'][index], deliveryAvailable: false, status: 'active' },
    { id: -(index * 3 + 3), title: ['Herb and greens box', 'Breakfast staples', 'Rice bowl portions', 'Pastry assortment'][index], category, provider: ['Willow allotment', 'Eastside pantry', 'Local meal team', 'Baker’s table'][index], quantity: ['2 boxes', '1 crate', '8 bowls', '3 boxes'][index], expiryAt: new Date(Date.now() + 86400000 * (index + 3)).toISOString(), description: ['Leafy greens and herbs from a local garden.', 'Oats, cereal, and breakfast basics.', 'Balanced rice bowls ready for pickup.', 'Sweet and savory pastries to share.'][index], deliveryAvailable: index === 0, status: 'active' },
  ]),
]

function text(value: unknown) { return typeof value === 'string' ? value.trim() : '' }
function parsePayload(body: Record<string, unknown>) {
  const title = text(body.title), category = text(body.category), quantity = text(body.quantity), provider = text(body.provider), description = text(body.description)
  const expiryAt = text(body.expiryAt) ? new Date(text(body.expiryAt)) : null
  const contact = normalizeContact(body.email, body.phone)
  const imageUrl = text(body.imageUrl)
  return { title, category, quantity, provider, description, expiryAt, contact, imageUrl, deliveryAvailable: body.deliveryAvailable === true || body.deliveryAvailable === 'true' }
}
function invalid(data: ReturnType<typeof parsePayload>) {
  return !data.title || !data.category || !data.quantity || !data.provider || !data.description || !data.expiryAt || Number.isNaN(data.expiryAt.getTime()) || data.expiryAt.getTime() <= Date.now() || !validContact(data.contact)
}

export async function GET(request: Request) {
  try {
    await ensureAnonymousSchema()
    const url = new URL(request.url)
    const contactKey = text(url.searchParams.get('contactKey'))
    const page = Math.max(1, Number(url.searchParams.get('page') || 1))
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit') || 12)))
    const rows = contactKey ? await db.select().from(donations).where(eq(donations.posterContactKey, contactKey)).orderBy(desc(donations.createdAt)) : await db.select().from(donations).where(eq(donations.status, 'active')).orderBy(desc(donations.createdAt))
    const paged = rows.slice((page - 1) * limit, page * limit)
    return NextResponse.json({ items: paged, page, limit, total: rows.length, hasMore: page * limit < rows.length })
  } catch (error) {
    console.error('[v0] post list failed', error)
    return NextResponse.json({ items: sampleItems, page: 1, limit: sampleItems.length, total: sampleItems.length, hasMore: false })
  }
}

export async function POST(request: Request) {
  try {
    await ensureAnonymousSchema()
    const data = parsePayload(await request.json() as Record<string, unknown>)
    if (invalid(data)) return NextResponse.json({ error: 'Please complete every field, use a future date, and add an email or phone.' }, { status: 400 })
    const [post] = await db.insert(donations).values({ title: data.title, category: data.category, quantity: data.quantity, provider: data.provider, description: data.description, expiryAt: data.expiryAt!, posterEmail: data.contact.email, posterPhone: data.contact.phone, posterContactKey: data.contact.key, imageUrl: data.imageUrl || null, price: 'Free', deliveryAvailable: data.deliveryAvailable, status: 'active' }).returning()
    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error('[v0] post creation failed', error)
    return NextResponse.json({ error: 'We could not publish that item. Please try again.' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    await ensureAnonymousSchema()
    const body = await request.json() as Record<string, unknown>
    const id = Number(body.id)
    const data = parsePayload(body)
    if (!Number.isInteger(id) || id <= 0 || invalid(data)) return NextResponse.json({ error: 'Please provide valid post details.' }, { status: 400 })
    const current = await db.select().from(donations).where(eq(donations.id, id))
    if (!current[0] || current[0].posterContactKey !== data.contact.key) return NextResponse.json({ error: 'That post could not be found for this contact.' }, { status: 403 })
    const [post] = await db.update(donations).set({ title: data.title, category: data.category, quantity: data.quantity, provider: data.provider, description: data.description, expiryAt: data.expiryAt!, imageUrl: data.imageUrl || null, deliveryAvailable: data.deliveryAvailable }).where(eq(donations.id, id)).returning()
    return NextResponse.json({ post })
  } catch (error) {
    console.error('[v0] post update failed', error)
    return NextResponse.json({ error: 'We could not update that item.' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await ensureAnonymousSchema()
    const body = await request.json() as Record<string, unknown>
    const id = Number(body.id)
    const contact = normalizeContact(body.email, body.phone)
    if (!Number.isInteger(id) || id <= 0 || !validContact(contact)) return NextResponse.json({ error: 'Post and contact details are required.' }, { status: 400 })
    const current = await db.select({ id: donations.id }).from(donations).where(and(eq(donations.id, id), eq(donations.posterContactKey, contact.key!)))
    if (!current[0]) return NextResponse.json({ error: 'That post could not be found for this contact.' }, { status: 403 })
    const [post] = await db.update(donations).set({ status: 'removed' }).where(and(eq(donations.id, id), eq(donations.posterContactKey, contact.key!))).returning()
    if (!post) return NextResponse.json({ error: 'That post could not be removed.' }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[v0] post deletion failed', error)
    return NextResponse.json({ error: 'We could not remove that item.' }, { status: 500 })
  }
}
