import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import { PropsWithChildren } from 'react'
import { FarcasterProvider } from '@/components/providers/farcaster'
import { SWRProvider } from '@/components/providers/swr'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/cn'
import './globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'fardrop',
  description: 'Collect addresses on Farcaster.',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-svh bg-background font-sans text-foreground antialiased',
          fontSans.variable,
        )}
      >
        <SWRProvider>
          <FarcasterProvider>
            {children}
            <Toaster />
          </FarcasterProvider>
        </SWRProvider>
        <Analytics />
      </body>
    </html>
  )
}
