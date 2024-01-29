import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/og'
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

  const { searchParams } = new URL(request.url)
  const success = searchParams.get('success')
  const error = searchParams.get('error')

  const frameDrop = await db.query.drop.findFirst({
    where: eq(drop.id, parseResult.data.id),
  })
  if (!frameDrop) notFound()

  // TODO: style
  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>{frameDrop.name}</div>
        <div>{frameDrop.creatorFid}</div>
        {success && <div>Success!</div>}
        {error && <div>{error}</div>}
      </div>
    ),
    {
      width: 1910,
      height: 1000,
    },
  )
}
