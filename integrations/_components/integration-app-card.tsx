import React from 'react'
import Image from 'next/image'

import { INTEGRATION_STATUS, INTEGRATIONS } from '@/lib/constants/integrations'
import LoadingIcon from '@/components/ui/loading-icon'

import IntegrationDrawer from './integration-drawer'

type Props = {
  integration: any
  isHubspotLoading?: boolean
}

const IntegrationAppCard = ({ integration, isHubspotLoading }: Props) => {
  return (
    <div className='flex h-full flex-col rounded-2xl border border-[#F2F4F7] bg-white p-6 transition-all duration-300 ease-in-out hover:border-[#E9D7FE] hover:shadow-sm dark:border-border dark:bg-card'>
      {/* Icon Wrapper */}
      <div className='mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-xl bg-white shadow-sm dark:bg-muted'>
        <Image
          width={56}
          height={56}
          src={integration.logo}
          alt={integration.name}
          className='object-contain'
        />
      </div>

      <div className='mb-6 flex-1'>
        <h3 className='mb-1 text-[18px] font-semibold text-[#111827] dark:text-white'>
          {integration.name}
        </h3>
        <p className='line-clamp-3 text-[14px] leading-relaxed text-[#6B7280] dark:text-gray-400'>
          {integration.description}
        </p>
      </div>

      <div className='mt-auto'>
        <IntegrationDrawer
          integration={integration}
          isHubspotLoading={isHubspotLoading}
        >
          <button
            className='flex h-[36px] items-center justify-center rounded-lg bg-[#6863FB] px-4 text-[14px] font-medium text-white transition-colors hover:bg-[#5229CC] disabled:opacity-50'
            disabled={
              integration.status === INTEGRATION_STATUS.COMING_SOON ||
              (integration.id === INTEGRATIONS.HUBSPOT_OUTREACH &&
                isHubspotLoading)
            }
          >
            {integration.id === INTEGRATIONS.HUBSPOT_OUTREACH &&
            isHubspotLoading ? (
              <div className='flex items-center gap-2'>
                <LoadingIcon className='h-4 w-4' />
                <span>Connecting...</span>
              </div>
            ) : integration.status === INTEGRATION_STATUS.CONNECTED ? (
              'Connected'
            ) : integration.status === INTEGRATION_STATUS.COMING_SOON ? (
              'Pipeline'
            ) : (
              'Connect'
            )}
          </button>
        </IntegrationDrawer>
      </div>
    </div>
  )
}

export default IntegrationAppCard
