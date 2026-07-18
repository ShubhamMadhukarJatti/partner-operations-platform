import React from 'react'

import { Button } from '@/components/ui/button'

import IntegrationAppCard from './integration-app-card'

type Props = {
  integrations: any
  isHubspotLoading?: boolean
}

const MainIntegrationApps = ({ integrations, isHubspotLoading }: Props) => {
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {integrations.map((integration: any) => (
        <IntegrationAppCard
          key={integration.id}
          integration={integration}
          isHubspotLoading={isHubspotLoading}
        />
      ))}
    </div>
  )
}

export default MainIntegrationApps
