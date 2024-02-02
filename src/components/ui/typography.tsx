import { PropsWithChildren } from 'react'

export function H1({ children }: PropsWithChildren) {
  return (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {children}
    </h1>
  )
}

export function Lead({ children }: PropsWithChildren) {
  return <p className="text-xl text-muted-foreground">{children}</p>
}
