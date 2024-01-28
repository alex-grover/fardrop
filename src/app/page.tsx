import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/cn'

export default function Home() {
  return (
    <>
      <header className="container flex h-14 max-w-screen-2xl items-center justify-between border-b">
        <Link href="/" className="font-bold">
          fardrop
        </Link>
        <Link
          href="/new"
          className={cn(
            buttonVariants({ className: 'flex items-center gap-2' }),
          )}
        >
          <PlusIcon className="h-4 w-4" />
          <span>Create</span>
        </Link>
      </header>
      <main />
    </>
  )
}
