import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { env } from '@/lib/db/env'

const sql = postgres(env.DIRECT_DATABASE_URL ?? env.DATABASE_URL, {
  max: 1,
})
const db = drizzle(sql)

await migrate(db, { migrationsFolder: 'src/lib/db/migrations' })
await sql.end()
