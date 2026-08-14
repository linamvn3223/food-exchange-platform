import { betterAuth } from 'better-auth'
import { Pool } from 'pg'

const origins = [
  process.env.BETTER_AUTH_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
  process.env.V0_DEV_APP_URL,
  process.env.V0_RUNTIME_URL,
  typeof window !== 'undefined' ? window.location.origin : undefined,
].filter(Boolean) as string[]

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  baseURL: process.env.BETTER_AUTH_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined),
  trustedOrigins: origins,
  emailAndPassword: { enabled: true },
  advanced: process.env.NODE_ENV === 'development' ? { defaultCookieAttributes: { sameSite: 'none', secure: true } } : undefined,
})
