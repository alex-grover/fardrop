'use client'

import { useRouter } from 'next/navigation'
import { FormEventHandler, useCallback } from 'react'
import { toast } from 'sonner'
import useSWRMutation from 'swr/mutation'
import { CreateDropInput, CreateDropResponse } from '@/app/api/drops/route'
import { createMutationFetcher } from '@/components/providers/swr'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function CreateCard() {
  const router = useRouter()

  const { trigger, isMutating } = useSWRMutation(
    '/api/drops',
    createMutationFetcher<CreateDropResponse, CreateDropInput>({
      method: 'POST',
    }),
  )

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (event) => {
      event.preventDefault()

      async function execute() {
        const formData = new FormData(event.currentTarget)
        const name = formData.get('name')
        if (!name || typeof name !== 'string') {
          toast('Name is required')
          return
        }

        try {
          const response = await trigger({ name })
          toast('Created drop!')
          router.push(`/drops/${response.id}`)
        } catch {
          toast('Error creating drop.')
        }
      }

      void execute()
    },
    [trigger, router],
  )

  return (
    <Card className="w-96">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create drop</CardTitle>
          <CardDescription>
            Start collecting addresses in one click.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Name of your project"
            required
          />
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={isMutating}>
            Create
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
