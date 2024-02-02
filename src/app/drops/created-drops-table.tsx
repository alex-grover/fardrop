'use client'

import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import useSWR from 'swr'
import { DropsResponse } from '@/app/api/drops/route'
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function CreatedDropsTable() {
  const { data } = useSWR<DropsResponse>('/api/drops')

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((drop) => (
            <TableRow key={drop.id}>
              <TableCell className="font-medium">{drop.name}</TableCell>
              <TableCell className="text-right">
                <Link href={`/drops/${drop.id}`} className={buttonVariants()}>
                  View
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {data === undefined && (
        <div className="flex w-full flex-col gap-4">
          {Array<null>(5)
            .fill(null)
            .map((_, index) => (
              <Skeleton key={index} className="h-4 w-full" />
            ))}
        </div>
      )}
      {data?.length === 0 && (
        <div className="flex flex-col gap-6">
          <div className="italic text-muted-foreground">No drops yet!</div>
          <Link href="/new" className={buttonVariants({ className: 'gap-2' })}>
            <PlusIcon className="h-4 w-4" />
            <div>Create</div>
          </Link>
        </div>
      )}
    </div>
  )
}
