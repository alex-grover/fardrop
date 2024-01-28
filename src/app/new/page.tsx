import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { SessionData, sessionOptions } from '@/lib/auth'

export default async function New() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)

  if (!session.id) redirect('/')

  return (
    <>
      <Header />
      <main />
    </>
  )
}