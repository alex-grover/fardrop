import Link from 'next/link'
import { NavButtons } from '@/app/nav-buttons'

export default function Home() {
  return (
    <>
      <header className="container flex h-14 max-w-screen-2xl items-center justify-between border-b">
        <Link href="/" className="font-bold">
          fardrop
        </Link>
        <nav className="flex items-center gap-2">
          <NavButtons />
        </nav>
      </header>
      <main />
    </>
  )
}
