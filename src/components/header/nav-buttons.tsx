'use client'

import { useProfile, useSignIn } from '@farcaster/auth-kit'
import { Loader2Icon, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { SignInButton } from '@/components/sign-in-button'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { useIsMounted } from '@/lib/hooks'
import { useSession } from '@/lib/session'

export function NavButtons() {
  const isMounted = useIsMounted()
  const pathname = usePathname()
  const router = useRouter()
  const { signOut: unauthenticate } = useSignIn({})
  const { isAuthenticated } = useProfile()
  const { session, isLoading, signOut } = useSession()

  const handleSignOut = useCallback(() => {
    unauthenticate()
    void signOut()
    router.replace('/')
  }, [unauthenticate, signOut, router])

  if (!isMounted || isLoading || (!isAuthenticated && !session?.id))
    return <SignInButton />

  if (!session?.id)
    return (
      <Button disabled>
        <Loader2Icon className="animate-spin" />{' '}
      </Button>
    )

  return (
    <>
      {pathname === '/new' ? (
        <Link
          href="/drops"
          className={cn(buttonVariants({ className: 'gap-2' }))}
        >
          Manage
        </Link>
      ) : (
        <Link
          href="/new"
          className={cn(buttonVariants({ className: 'gap-2' }))}
        >
          <PlusIcon className="h-4 w-4" />
          <span>Create</span>
        </Link>
      )}
      <Button variant="outline" onClick={handleSignOut}>
        Sign Out
      </Button>
    </>
  )
}
