import { getSSLHubRpcClient, Message } from '@farcaster/hub-nodejs'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { z } from 'zod'
import { db } from '@/lib/db'
import { drop, participant } from '@/lib/db/schema'
import { env } from '@/lib/env'

type Props = {
  params: {
    id: string
  }
}

const paramsSchema = z.object({
  id: z.string().pipe(z.coerce.number().positive().int()),
})

export async function GET(request: Request, { params }: Props) {
  const parseResult = paramsSchema.safeParse(params)
  if (!parseResult.success) notFound()

  const frameDrop = await db.query.drop.findFirst({
    where: eq(drop.id, parseResult.data.id),
  })
  if (!frameDrop) notFound()

  return new Response(
    `
      <html>
        <head>
          <title>${frameDrop.name}</title>
          <meta property="og:image" content="${request.url}/image" />
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${request.url}/image" />
          <meta property="fc:frame:button:1" content="Join" />
        </head>
      </html>
    `,
    {
      headers: {
        'Content-Type': 'text/html',
      },
    },
  )
}

const bodySchema = z.object({
  trustedData: z.object({
    messageBytes: z.string().min(1),
  }),
})

const hubClient = getSSLHubRpcClient(env.HUB_URL)

export async function POST(request: Request, { params }: Props) {
  const paramsParseResult = paramsSchema.safeParse(params)
  if (!paramsParseResult.success) notFound()

  const parseResult = bodySchema.safeParse(await request.json())
  if (!parseResult.success)
    return new Response(parseResult.error.message, { status: 422 })

  const frameDrop = await db.query.drop.findFirst({
    where: eq(drop.id, paramsParseResult.data.id),
  })
  if (!frameDrop) notFound()

  const message = await validateFrameMessage(
    parseResult.data.trustedData.messageBytes,
  )
  if (!message) return new Response('Invalid message', { status: 422 })

  const searchParams = new URLSearchParams()
  try {
    await db.insert(participant).values({ dropId: frameDrop.id, ...message })
    searchParams.set('success', 'true')
  } catch {
    searchParams.set('error', 'Already joined')
  }

  return new Response(
    `
      <html>
        <head>
          <meta property="og:image" content="${request.url}/image?${searchParams.toString()}" />
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${request.url}/image?${searchParams.toString()}" />
          <meta property="fc:frame:button:1" content="Join" />
        </head>
      </html>
    `,
    {
      headers: {
        'Content-Type': 'text/html',
      },
    },
  )
}

async function validateFrameMessage(data: string) {
  const frameMessage = Message.decode(Buffer.from(data, 'hex'))
  const validateResult = await hubClient.validateMessage(frameMessage)

  if (!validateResult.isOk() || !validateResult.value.valid) return null

  const validMessage = validateResult.value.message
  const fid = validMessage?.data?.fid
  const casterFid = validMessage?.data?.frameActionBody?.castId?.fid

  return fid && casterFid ? { fid, casterFid } : null
}
