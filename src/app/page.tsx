import Link from 'next/link'
import { Header } from '@/components/header'
import { SignInButton } from '@/components/sign-in-button'
import { buttonVariants } from '@/components/ui/button'
import { H1, Lead } from '@/components/ui/typography'

export default function Home() {
  return (
    <>
      <Header />
      <main className="container flex flex-col items-center gap-6 py-36 md:py-48">
        <H1>Collect addresses on Farcaster.</H1>
        <Lead>
          The easiest way to build allowlists, curate airdrops, and engage your
          following.
        </Lead>
        <SignInButton
          fallback={
            <Link href="/drops" className={buttonVariants()}>
              Manage Drops
            </Link>
          }
        />
      </main>
    </>
  )
}
