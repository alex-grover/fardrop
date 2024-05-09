import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    POSTGRES_URL: z.string().url(),
    HUB_URL: z.string().url(),
    SESSION_SECRET: z.string().min(32),
    VERCEL_ENV: z.enum(['production', 'preview', 'development']),
  },
  experimental__runtimeEnv: {},
})
