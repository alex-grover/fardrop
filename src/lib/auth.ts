import { type SessionOptions } from 'iron-session'
import { env } from '@/lib/env'

export type SessionData = { id: number } | Record<string, never>

export const sessionOptions: SessionOptions = {
  cookieName: 'fardrop',
  password: env.SESSION_SECRET,
  cookieOptions: {
    secure: env.VERCEL_ENV !== 'development',
  },
}
