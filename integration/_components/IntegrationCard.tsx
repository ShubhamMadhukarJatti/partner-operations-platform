import React, { useState } from 'react'
import Image from 'next/image'

import { Integration } from '@/types/integrations'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type Props = {
  data: Integration
}

function IntegrationCard({ data }: Props) {
  const [isConnecting, setIsConnecting] = useState(false)
  const handleConnect = async () => {
    if (data.name === 'Mailchimp') {
      setIsConnecting(true)
      try {
        // Check if user is authenticated first
        const response = await fetch('/api/auth/session')
        const session = await response.json()

        if (!session?.user) {
          // Redirect to login page with return URL
          window.location.href = `/login?callbackUrl=${encodeURIComponent('/integration')}`
          return
        }

        // Redirect to Mailchimp OAuth flow
        window.location.href = '/api/mailchimp'
      } catch (error) {
        console.error('Error connecting to Mailchimp:', error)
        // Fallback to login if there's an error
        window.location.href = `/login?callbackUrl=${encodeURIComponent('/integration')}`
      } finally {
        setIsConnecting(false)
      }
    }
  }

  const isConnectable =
    data.name === 'Mailchimp' && data.integrationStage !== 'in-pipeline'

  return (
    <div
      className={cn(
        'relative flex h-[320px] flex-col justify-between rounded-2xl border border-[#C6D1E1] px-10 py-8',
        {
          'bg-gradient-to-b from-[#cdf5e8] to-[#d9edea]':
            data.integrationStage === 'new'
        }
      )}
    >
      <div>
        <span
          className={cn(
            'absolute right-3 top-2 rounded-xl bg-[#F2F2F2] px-3 py-1 text-sm font-bold uppercase text-[#03313F] ',
            {
              'bg-gradient-to-r from-[#58C9A3] via-[#78D4B7] to-[#4FC28D]':
                data.integrationStage === 'new'
            }
          )}
        >
          {data.integrationStage}
        </span>
        <Image src={data.icon} alt={data.name} width={64} height={64} />
        <h5 className='pb-5 pt-3 font-semibold text-[#0D1928]'>{data.name}</h5>
        <p className='line-clamp-3 overflow-hidden text-ellipsis text-sm'>
          {data.desc}
        </p>
      </div>

      {isConnectable && (
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className='mt-4 w-full bg-[#042C59] text-white hover:bg-[#042C59]/90 disabled:opacity-50'
        >
          {isConnecting ? 'Connecting...' : 'Connect to Mailchimp'}
        </Button>
      )}
    </div>
  )
}

export default IntegrationCard
