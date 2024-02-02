'use client'

import {
  SignInButton as FarcasterSignInButton,
  type StatusAPIResponse,
  useProfile,
} from '@farcaster/auth-kit'
import { usePathname, useRouter } from 'next/navigation'
import { ReactElement, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { useIsMounted } from '@/lib/hooks'
import { useSession } from '@/lib/session'

type SignInButtonProps = {
  fallback?: ReactElement
}

export function SignInButton({ fallback }: SignInButtonProps) {
  const isMounted = useIsMounted()
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated } = useProfile()
  const { session, isLoading, signIn } = useSession()

  useEffect(() => {
    if (!isLoading && !session?.id && pathname !== '/') router.replace('/')
  }, [isLoading, session, pathname, router])

  const handleSuccess = useCallback(
    (res: StatusAPIResponse) => {
      if (res.state !== 'completed' || !res.message || !res.signature) {
        toast('Failed to sign in')
        return
      }

      void signIn({
        message: res.message,
        signature: res.signature,
        nonce: res.nonce,
      })
    },
    [signIn],
  )

  const handleError = useCallback(() => toast('Error signing in'), [])

  if (!isMounted || isLoading) return null

  if (isAuthenticated || session?.id) return fallback ?? null

  return (
    <FarcasterSignInButton
      hideSignOut
      onSuccess={handleSuccess}
      onError={handleError}
    />
  )
}
