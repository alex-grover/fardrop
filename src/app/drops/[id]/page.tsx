import { and, eq } from 'drizzle-orm'
import { getIronSession } from 'iron-session'
import { ChevronLeftIcon } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { z } from 'zod'
import { Header } from '@/components/header'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { H1 } from '@/components/ui/typography'
import { SessionData, sessionOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { drop, participant } from '@/lib/db/schema'

type DropProps = {
  params: {
    id: string
  }
}

const paramsSchema = z.object({
  id: z.string().pipe(z.coerce.number().positive().int()),
})

export default async function Drop({ params }: DropProps) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)

  if (!session.id) redirect('/')

  const parseResult = paramsSchema.safeParse(params)
  if (!parseResult.success) redirect('/')

  const createdDrop = await db.query.drop.findFirst({
    where: and(
      eq(drop.id, parseResult.data.id),
      eq(drop.creatorFid, session.id),
    ),
  })
  if (!createdDrop) notFound()

  const participants = await db.query.participant.findMany({
    where: eq(participant.dropId, createdDrop.id),
  })

  return (
    <>
      <Header />
      <main className="container flex max-w-screen-md flex-col gap-4 py-10">
        <div className="flex items-center gap-4">
          <Link href="/drops">
            <ChevronLeftIcon />
          </Link>
          <H1>{createdDrop.name}</H1>
        </div>
        <div className="flex w-full flex-col items-center gap-8">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>FID</TableHead>
                <TableHead>Caster FID</TableHead>
                <TableHead className="text-right">Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant) => (
                <TableRow key={participant.fid}>
                  <TableCell className="font-medium">
                    {participant.fid}
                  </TableCell>
                  <TableCell>{participant.casterFid}</TableCell>
                  <TableCell className="text-right"></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {participants.length === 0 && (
            <div className="italic text-muted-foreground">
              No participants yet!
            </div>
          )}
        </div>
      </main>
    </>
  )
}
