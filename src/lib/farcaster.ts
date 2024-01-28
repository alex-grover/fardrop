import { createAppClient, viemConnector } from '@farcaster/auth-client'

export const farcasterClient = createAppClient({
  ethereum: viemConnector(),
})
