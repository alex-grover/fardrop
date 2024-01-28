import Link from 'next/link'
import { NavButtons } from '@/components/header/nav-buttons'

export function Header() {
  return (
    <header className="container flex h-14 max-w-screen-2xl items-center justify-between border-b">
      <Link href="/" className="text-2xl font-bold">
        fardrop
      </Link>
      <nav className="flex items-center gap-2">
        <NavButtons />
      </nav>
    </header>
  )
}
