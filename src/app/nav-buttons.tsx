'use client'

import {
  SignInButton,
  StatusAPIResponse,
  useProfile,
  useSignIn,
} from '@farcaster/auth-kit'
import { Loader2Icon, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { useCallback } from 'react'
import { toast } from 'sonner'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { useIsMounted } from '@/lib/hooks'
import { useSession } from '@/lib/session'

export function NavButtons() {
  const isMounted = useIsMounted()
  const { signOut: unauthenticate } = useSignIn({})
  const { isAuthenticated } = useProfile()
  const { session, signIn, signOut } = useSession()

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

  const handleSignOut = useCallback(() => {
    unauthenticate()
    void signOut()
  }, [unauthenticate, signOut])

  if (!isMounted) return null

  if (!isAuthenticated && !session?.id)
    return (
      <SignInButton
        hideSignOut
        onSuccess={handleSuccess}
        onError={handleError}
      />
    )

  if (!session?.id)
    return (
      <Button disabled>
        <Loader2Icon className="animate-spin" />{' '}
      </Button>
    )

  return (
    <>
      <Link href="/new" className={cn(buttonVariants({ className: 'gap-2' }))}>
        <PlusIcon className="h-4 w-4" />
        <span>Create</span>
      </Link>
      <Button variant="outline" onClick={handleSignOut}>
        Sign Out
      </Button>
    </>
  )
}
