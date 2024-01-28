import { defineConfig } from 'drizzle-kit'
import { env } from '@/lib/db/env'

export default defineConfig({
  schema: 'src/lib/db/schema.ts',
  out: 'src/lib/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: env.DIRECT_DATABASE_URL ?? env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
})
