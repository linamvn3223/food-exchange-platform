import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'

export function normalizeContact(email?: unknown, phone?: unknown) {
  const normalizedEmail = typeof email === 'string' && email.trim() ? email.trim().toLowerCase() : null
  const normalizedPhone = typeof phone === 'string' && phone.trim() ? phone.replace(/[^\d+]/g, '') : null
  return { email: normalizedEmail, phone: normalizedPhone, key: normalizedEmail ? `email:${normalizedEmail}` : normalizedPhone ? `phone:${normalizedPhone}` : null }
}

let ready: Promise<void> | null = null
export function ensureAnonymousSchema() {
  ready ??= db.execute(sql.raw(`ALTER TABLE donations ADD COLUMN IF NOT EXISTS poster_email text; ALTER TABLE donations ADD COLUMN IF NOT EXISTS poster_phone text; ALTER TABLE donations ADD COLUMN IF NOT EXISTS poster_contact_key text; CREATE TABLE IF NOT EXISTS claims (id serial primary key, donation_id integer not null, claimant_email text, claimant_phone text, claimant_contact_key text not null, status text not null default 'claimed', created_at timestamptz not null default now()); CREATE TABLE IF NOT EXISTS point_events (id serial primary key, contact_key text not null, points integer not null, reason text not null, created_at timestamptz not null default now());`)).then(() => undefined)
  return ready
}

export function validContact(contact: ReturnType<typeof normalizeContact>) { return Boolean(contact.key) }
