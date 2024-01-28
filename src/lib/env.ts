import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    SESSION_SECRET: z.string().min(32),
    VERCEL_ENV: z.enum(['production', 'preview', 'development']),
  },
  experimental__runtimeEnv: {},
})
