import React from 'react'
import { useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { OpenDealIcon } from '@/components/icons/icons'

const Container: React.FC<{
  children: React.ReactElement
  className?: string
}> = ({ children, className }) => (
  <div className={cn('rounded-xl border border-[#E4E7EE] bg-white', className)}>
    {children}
  </div>
)

const EmptyState = () => {
  const router = useRouter()
  return (
    <Container className={'mt-6 flex h-[443px] items-center justify-center'}>
      <div className='flex flex-col items-center'>
        <OpenDealIcon />
        <div className='flex flex-col items-center gap-4'>
          <p className='mt-5 text-xl font-bold'>
            Create data source to start using Partner Match
          </p>
        </div>
        <Button
          onClick={() => router.push('/my-data')}
          className='mt-8 bg-[#3E50F7]'
        >
          Create Data Source
        </Button>
      </div>
    </Container>
  )
}

export default EmptyState
