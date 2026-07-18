'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export const DashboardFilters = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [type, setType] = useState<string>('all')
  const [status, setStatus] = useState<string>('all')

  type Props = {
    type?: string
    status?: string
  }

  function updateParams({ type, status }: Props) {
    const params = new URLSearchParams(searchParams.toString())
    if (type) params.set('type', type)
    if (status) params.set('status', status)
    router.push(`?${params.toString()}`)
  }

  useEffect(() => {
    updateParams({ type, status })
  }, [type, status])

  return (
    <div className='flex flex-wrap gap-1 sm:gap-6 md:gap-10'>
      <div className='flex items-center gap-2'>
        <Button
          size='sm'
          variant={type === 'all' ? 'default' : 'secondary'}
          onClick={() => setType('all')}
        >
          All
        </Button>
        <Button
          size='sm'
          variant={type === 'sent' ? 'default' : 'secondary'}
          onClick={() => setType('sent')}
        >
          Sent
        </Button>
        <Button
          size='sm'
          variant={type === 'recieved' ? 'default' : 'secondary'}
          onClick={() => setType('recieved')}
        >
          Recieved
        </Button>
      </div>
      <div className='flex items-center gap-2'>
        <Select name='status' value={status} onValueChange={setStatus}>
          <SelectTrigger className='max-w-[120px] bg-secondary'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All</SelectItem>
            <SelectItem value='pending'>Pending</SelectItem>
            <SelectItem value='active'>Active</SelectItem>
            <SelectItem value='rejected'>Rejected</SelectItem>
            <SelectItem value='expired'>Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
