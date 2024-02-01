import { Message, UserDataType } from '@farcaster/hub-nodejs'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { toHex } from 'viem'
import { z } from 'zod'
import { db } from '@/lib/db'
import { cast, drop, participant } from '@/lib/db/schema'
import { hubClient } from '@/lib/hub'

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
  const { fid, casterFid, castHash } = message

  const [user, verifications, caster] = await Promise.all([
    hubClient.getUserDataByFid({ fid }),
    hubClient.getVerificationsByFid({ fid }),
    hubClient.getUserDataByFid({ fid: casterFid }),
  ])

  if (!verifications.isOk() || !user.isOk() || !caster.isOk())
    return new Response('Failed to fetch user data', { status: 500 })

  /* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
  const rawAddress =
    verifications.value.messages[0]?.data?.verificationAddEthAddressBody
      ?.address
  const participantAddress = rawAddress && toHex(rawAddress)
  const participantUsername = user.value.messages.find(
    (message) => message.data?.userDataBody?.type === UserDataType.USERNAME,
  )?.data?.userDataBody?.value
  const participantAvatar = user.value.messages.find(
    (message) => message.data?.userDataBody?.type === UserDataType.PFP,
  )?.data?.userDataBody?.value
  const casterUsername = caster.value.messages.find(
    (message) => message.data?.userDataBody?.type === UserDataType.USERNAME,
  )?.data?.userDataBody?.value
  const casterAvatar = caster.value.messages.find(
    (message) => message.data?.userDataBody?.type === UserDataType.PFP,
  )?.data?.userDataBody?.value

  const searchParams = new URLSearchParams()
  if (participantAddress) {
    try {
      await db
        .insert(cast)
        .values({
          hash: castHash,
          casterFid,
          casterUsername,
          casterAvatar,
        })
        .onConflictDoNothing()
      await db.insert(participant).values({
        dropId: frameDrop.id,
        castHash,
        participantFid: fid,
        participantUsername,
        participantAvatar,
        participantAddress,
      })
      searchParams.set('success', 'true')
    } catch {
      searchParams.set('error', 'Already joined')
    }
  } else {
    searchParams.set('error', 'No connected address')
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
  const castHash = validMessage?.data?.frameActionBody?.castId?.hash

  return fid && casterFid && castHash
    ? { fid, casterFid, castHash: toHex(castHash) }
    : null
}
