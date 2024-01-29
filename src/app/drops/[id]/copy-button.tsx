'use client'

import { CopyIcon } from 'lucide-react'
import { useCallback } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useIsMounted } from '@/lib/hooks'

export function CopyButton() {
  const isMounted = useIsMounted()
  const url = isMounted ? `${location.href}/frame` : ''

  const handleCopyClick = useCallback(() => {
    async function execute() {
      try {
        await navigator.clipboard.writeText(url)
        toast('Copied to clipboard!')
      } catch {
        toast('Error copying to clipboard')
      }
    }

    void execute()
  }, [url])

  return (
    <Button className="gap-2" onClick={handleCopyClick}>
      <CopyIcon className="h-4 w-4" />
      <div>Copy frame link</div>
    </Button>
  )
}
