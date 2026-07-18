import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowRight } from 'iconsax-react'
import { signIn } from 'next-auth/react'

import { INTEGRATION_STATUS, INTEGRATIONS } from '@/lib/constants/integrations'
import { connectCrm, isCrmOAuthType } from '@/lib/crm-oauth'
import { disconnectIntegration } from '@/lib/db/integrations'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { showCustomToast } from '@/components/custom-toast'

type Props = {
  data: {
    name: string
    url: string
    description: string
    status: string
    id: string
    isNew: boolean
    logo: string
  }
}

function IntegrationCardNew({
  data: { name, description, url, logo, isNew, status, id }
}: Props) {
  const queryClient = useQueryClient()
  const [switchEnabled, setSwitchEnabled] = useState<boolean>(
    status === INTEGRATION_STATUS.CONNECTED
  )

  React.useEffect(() => {
    setSwitchEnabled(status === INTEGRATION_STATUS.CONNECTED)
  }, [status])

  const handleConnectIntegration = (integrationType: string) => {
    const SCOPES = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events.readonly',
      'https://www.googleapis.com/auth/calendar.events.owned',
      'https://www.googleapis.com/auth/calendar.events.owned.readonly',
      'https://www.googleapis.com/auth/calendar.calendarlist',
      'https://www.googleapis.com/auth/calendar.calendars',
      'https://www.googleapis.com/auth/calendar.calendars.readonly'
    ].join(' ')
    switch (integrationType) {
      case INTEGRATIONS.GOOGLE_SHEET:
        signIn('google', undefined, {
          scope:
            'openid https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/drive.metadata.readonly'
        })
        break
      case INTEGRATIONS.GOOGLE_MEET:
        signIn('google', undefined, {
          scope: `openid ${SCOPES}`
        })
        break
      case INTEGRATIONS.HUBSPOT_OUTREACH:
        if (isCrmOAuthType(integrationType)) {
          void connectCrm(integrationType, { source: 'integration-card' })
        }
        break
      case INTEGRATIONS.ZOHO_CRM:
        if (isCrmOAuthType(integrationType)) {
          void connectCrm(integrationType, { source: 'integration-card' })
        }
        break

      case INTEGRATIONS.SLACK:
        handleConnectSlack()
        break
      default:
        break
    }
  }

  const handleDisconnectIntegration = async (integrationType: string) => {
    try {
      const response: any = await disconnectIntegration(integrationType)
      if (response?.success) {
        showCustomToast(
          'Success',
          `${name} App Uninstalled Successfully!`,
          'success',
          5000
        )
        setSwitchEnabled(false)

        // Clear all cached CRM data from memory and sessionStorage
        // so customer-insights correctly gates access after disconnect
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('fieldMappingData')
          sessionStorage.removeItem('csvData')
          sessionStorage.removeItem('csvFileName')
          sessionStorage.removeItem('recordType')
          sessionStorage.removeItem('crm_cleanup_triggered')
          delete (window as any).__sharkdom_temp_csvData
          delete (window as any).__sharkdom_fieldMappingData
        }

        queryClient.invalidateQueries({ queryKey: ['connected-apps'] })
        queryClient.invalidateQueries({ queryKey: ['get-persona'] })
      } else
        showCustomToast(
          'Error',
          `Error while disconnecting ${name}`,
          'error',
          5000
        )
    } catch (error: any) {
      console.error('[handleDisconnectIntegration] Unexpected error:', error)
      showCustomToast(
        'Error',
        'Something went wrong. Please try again.',
        'error',
        5000
      )
    }
  }

  const handleNotifyMeIntegration = () => {}

  const handleViewIntegrations = () => {}

  const handleConnectSlack = () => {
    const slackDirectUrl = 'https://sharkdom.com/api/slack'
    window.open(slackDirectUrl)
  }

  return (
    <div
      className={`${cn(
        'relative flex h-[270px] flex-col justify-between rounded-2xl border border-[#E4E7EE] bg-white px-6 py-5 lg:px-4',
        {
          'bg-[#F8FBFF]': isNew
        }
      )}`}
    >
      {isNew && (
        <Image
          src={'/icons/new-icon.svg'}
          alt='new-tag'
          width={50}
          height={50}
          className='absolute left-0 top-0'
        />
      )}
      <Image
        src={logo}
        alt={`${name}-logo`}
        width={70}
        height={70}
        className='absolute right-0 top-0'
      />
      <div>
        <h5 className='text-lg font-bold text-[#2A3241]'>{name}</h5>
        <Link
          target='_blank'
          href={url}
          className='flex items-center gap-2 text-xs text-[#4D5C78]'
        >
          {url}
          <ArrowRight size={12} />
        </Link>
        <p className='py-3 text-[#4D5C78]'>{description}</p>
      </div>
      {status === INTEGRATION_STATUS.NOT_CONNECTED && (
        <div>
          <hr className='border-t-2 border-[#E4E7EE]' />
          <Button
            variant='primary'
            className='mt-5 w-full  rounded-lg'
            onClick={() => handleConnectIntegration(id)}
          >
            Connect
          </Button>
        </div>
      )}
      {status === INTEGRATION_STATUS.CONNECTED && (
        <div>
          <hr className='border-t-2 border-[#E4E7EE]' />
          <div className='mt-5 flex items-center justify-between'>
            <Button
              variant='primary'
              className='w-fit rounded-lg'
              onClick={handleViewIntegrations}
            >
              View Integrations
            </Button>
            <Switch
              id={name}
              checked={switchEnabled}
              onCheckedChange={(isChecked) => {
                if (!isChecked) {
                  // disconnect
                  handleDisconnectIntegration(id)
                } else {
                  handleConnectIntegration(id)
                  setSwitchEnabled(isChecked)
                }
              }}
            />
          </div>
        </div>
      )}

      {status === INTEGRATION_STATUS.IN_ACTIVE && (
        <div>
          <hr className='border-t-2 border-[#E4E7EE]' />
          <div className='mt-5 flex items-center justify-between'>
            <Button
              variant='primary'
              className='w-fit rounded-lg'
              onClick={handleViewIntegrations}
            >
              View Integrations
            </Button>
            <Switch
              id={name}
              checked={switchEnabled}
              onCheckedChange={(isChecked) => {
                if (!isChecked) {
                  // disconnect
                  handleDisconnectIntegration(id)
                } else {
                  handleConnectIntegration(id)
                  setSwitchEnabled(isChecked)
                }
              }}
            />
          </div>
        </div>
      )}

      {status === INTEGRATION_STATUS.COMING_SOON && (
        <div>
          <hr className='border-t-2 border-[#E4E7EE]' />
          <Button
            variant='primary'
            className='mt-5 w-fit rounded-lg'
            onClick={handleNotifyMeIntegration}
          >
            Notify Me
          </Button>
        </div>
      )}
    </div>
  )
}

export default IntegrationCardNew
