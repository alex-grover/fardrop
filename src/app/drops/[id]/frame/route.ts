import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { z } from 'zod'
import { db } from '@/lib/db'
import { drop } from '@/lib/db/schema'

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

export async function POST(request: Request, { params }: Props) {
  const parseResult = paramsSchema.safeParse(params)
  if (!parseResult.success) notFound()

  const frameDrop = await db.query.drop.findFirst({
    where: eq(drop.id, parseResult.data.id),
  })
  if (!frameDrop) notFound()

  // TODO: validate data, save fid and casterFid

  const searchParams = new URLSearchParams({
    // TODO: success/error states
  })

  return new Response(
    `
      <html>
        <head>
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
