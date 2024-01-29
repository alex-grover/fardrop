import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { CreatedDropTable } from '@/app/drops/created-drop-table'
import { Header } from '@/components/header'
import { H1 } from '@/components/ui/typography'
import { SessionData, sessionOptions } from '@/lib/auth'

export default async function Drops() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)

  if (!session.id) redirect('/')

  return (
    <>
      <Header />
      <main className="container flex max-w-screen-md flex-col gap-4 py-10">
        <H1>Drops</H1>
        <CreatedDropTable />
      </main>
    </>
  )
}
