import { loadEnvConfig } from '@next/env'
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

const projectDir = process.cwd()
loadEnvConfig(projectDir)

export const env = createEnv({
  server: {
    POSTGRES_URL: z.string().url(),
  },
  experimental__runtimeEnv: {},
})
