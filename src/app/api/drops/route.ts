import { eq } from 'drizzle-orm'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { SessionData, sessionOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { drop } from '@/lib/db/schema'

export type DropsResponse = Awaited<ReturnType<typeof db.query.drop.findMany>>

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.id) return new Response('Unauthorized', { status: 401 })

  const createdDrops = await db.query.drop.findMany({
    where: eq(drop.creatorFid, session.id),
  })

  return NextResponse.json<DropsResponse>(createdDrops)
}

const createDropSchema = z.object({
  name: z.string().min(1),
})
export type CreateDropInput = z.input<typeof createDropSchema>

export type CreateDropResponse = {
  name: string
}

export async function POST(request: Request) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.id) return new Response('Unauthorized', { status: 401 })

  const parseResult = createDropSchema.safeParse(await request.json())
  if (!parseResult.success)
    return new Response(parseResult.error.message, { status: 422 })

  const [createdDrop] = await db
    .insert(drop)
    .values({
      name: parseResult.data.name,
      creatorFid: session.id,
    })
    .returning()

  return NextResponse.json<CreateDropResponse>(createdDrop, { status: 201 })
}
