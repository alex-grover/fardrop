import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import { PropsWithChildren } from 'react'
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
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        {children}
      </body>
    </html>
  )
}
