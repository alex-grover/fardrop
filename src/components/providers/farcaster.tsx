'use client'

import '@farcaster/auth-kit/styles.css'
import { AuthKitProvider } from '@farcaster/auth-kit'
import { PropsWithChildren } from 'react'

export function FarcasterProvider({ children }: PropsWithChildren) {
  return <AuthKitProvider>{children}</AuthKitProvider>
}
