import { PartyPopper } from 'lucide-react'

import { Alert, AlertTitle } from '@/components/ui/alert'

export function ChatAlerts() {
  return (
    <div className='m-6'>
      <Alert className='flex h-9 items-center justify-center border-none bg-[#F0F6FC]'>
        <AlertTitle className='flex'>
          <PartyPopper className='mr-2 h-4' />
          Congratulations on starting new partnership.
        </AlertTitle>
      </Alert>
    </div>
  )
}
