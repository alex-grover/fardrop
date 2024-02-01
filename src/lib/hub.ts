import { getSSLHubRpcClient } from '@farcaster/hub-nodejs'
import { env } from '@/lib/env'

export const hubClient = getSSLHubRpcClient(env.HUB_URL)
