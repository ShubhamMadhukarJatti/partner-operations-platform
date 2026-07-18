import Link from 'next/link'
import { MessageSquareText } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function Messages({
  orgId,
  collabData
}: {
  orgId: number
  collabData: any
}) {
  // console.log('cid', orgId)
  return (
    <div className='h-32 w-full    max-w-[25rem] border-b border-l border-border'>
      <div className='flex  items-center justify-between px-1 py-4'>
        <h5 className='inline-flex items-center text-xl font-medium text-muted-foreground'>
          <MessageSquareText className='mr-2 h-6 w-6 text-muted-foreground' />
          Inbox
        </h5>
        <Link href={`/inbox/${collabData?.id}`}>
          <Button variant={'link'} className=' font-medium text-primary'>
            Go to inbox
          </Button>
        </Link>
      </div>
    </div>
  )
}
