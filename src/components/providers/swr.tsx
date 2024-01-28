'use client'

import { type PropsWithChildren } from 'react'
import { SWRConfig } from 'swr'

async function fetcher<Data>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Data> {
  const res = await fetch(input, init)

  if (!res.ok) throw new Error(await res.text())

  return (await res.json()) as Data
}

export function createMutationFetcher<Data, Extra = unknown>(
  init?: RequestInit,
) {
  return (input: RequestInfo | URL, { arg }: { arg: Extra }) =>
    fetcher<Data>(input, {
      ...init,
      body: JSON.stringify(arg),
    })
}

export function SWRProvider({ children }: PropsWithChildren) {
  return <SWRConfig value={{ fetcher }}>{children}</SWRConfig>
}
