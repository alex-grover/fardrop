import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { type SessionData, sessionOptions } from '@/lib/auth'
import { farcasterClient } from '@/lib/farcaster'
import { hexString } from '@/lib/zod'

export type SessionResponse = SessionData

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.id) return Response.json({})
  return NextResponse.json<SessionResponse>(session)
}

const loginSchema = z.object({
  message: z.string().min(1),
  signature: hexString,
  nonce: z.string().min(1),
})
export type LoginInput = z.input<typeof loginSchema>

export async function POST(request: NextRequest) {
  const json = (await request.json()) as LoginInput

  const parseResult = loginSchema.safeParse(json)
  if (!parseResult.success)
    return Response.json('Invalid credentials', { status: 422 })

  const { success, fid } = await farcasterClient.verifySignInMessage({
    message: parseResult.data.message,
    signature: parseResult.data.signature,
    nonce: parseResult.data.nonce,
    domain: request.headers.get('host') ?? 'fardrop.org',
  })

  if (!success) return Response.json('Invalid signature', { status: 422 })

  const session = await getIronSession<SessionData>(cookies(), sessionOptions)

  session.id = fid

  await session.save()

  return NextResponse.json<SessionResponse>(session, { status: 201 })
}

export async function DELETE() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  session.destroy()
  return NextResponse.json<SessionResponse>({}, { status: 202 })
}
