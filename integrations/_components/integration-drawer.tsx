'use client'

import React, { memo, useState } from 'react'
import Image from 'next/image'
import { useQueryClient } from '@tanstack/react-query'
import { SquareArrowOutUpRight, Trash2 } from 'lucide-react'
import { signIn } from 'next-auth/react'

import { INTEGRATION_STATUS, INTEGRATIONS } from '@/lib/constants/integrations'
import { connectCrm, isCrmOAuthType } from '@/lib/crm-oauth'
import { disconnectIntegration } from '@/lib/db/integrations'
import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import LoadingIcon from '@/components/ui/loading-icon'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { showCustomToast } from '@/components/custom-toast'

export const SHEET_SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/drive.metadata.readonly'
].join(' ')

const IntegrationDrawer = ({
  integration,
  isHubspotLoading,
  children,
  open,
  onOpenChange
}: {
  integration: any
  isHubspotLoading?: boolean
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const queryClient = useQueryClient()
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false)

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
          scope: `openid ${SHEET_SCOPES}`
        })
        break

      case INTEGRATIONS.GOOGLE_MEET:
        signIn('google', undefined, {
          scope: `openid ${SCOPES}`
        })
        break

      case INTEGRATIONS.HUBSPOT_OUTREACH:
      case INTEGRATIONS.SALESFORCE_CRM:
      case INTEGRATIONS.PIPEDRIVE:
      case INTEGRATIONS.CLOSE_CRM:
        if (isCrmOAuthType(integrationType)) {
          void connectCrm(integrationType, { source: 'integration-drawer' })
        }
        break

      case INTEGRATIONS.ZOHO_CRM:
        if (isCrmOAuthType(integrationType)) {
          void connectCrm(integrationType, {
            source: 'integration-drawer',
            useRedirect: true
          })
        }
        break

      case INTEGRATIONS.SLACK:
        window.open(`${process.env.NEXT_PUBLIC_BASE_URL}/api/slack`)
        break

      case INTEGRATIONS.STRIPE:
        window.open(`${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe`)
        break

      case INTEGRATIONS.DISCORD:
        window.open(`${process.env.NEXT_PUBLIC_BASE_URL}/api/discord`)
        break

      case INTEGRATIONS.MAILCHIMP:
        window.open(`${process.env.NEXT_PUBLIC_BASE_URL}/api/mailchimp`)
        break

      case INTEGRATIONS.ZOOM:
        window.open(`${process.env.NEXT_PUBLIC_BASE_URL}/api/zoom`)
        break

      case INTEGRATIONS.CALENDLY:
        window.open(`${process.env.NEXT_PUBLIC_BASE_URL}/api/calendly`)
        break

      case INTEGRATIONS.TRELLO:
        window.open(`${process.env.NEXT_PUBLIC_BASE_URL}/api/trello`)
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
          `${integration.name} disconnected successfully!`,
          'success',
          5000
        )

        queryClient.invalidateQueries({
          queryKey: ['connected-apps'],
          exact: true
        })
      } else {
        showCustomToast(
          'Error',
          `Error while disconnecting ${integration.name}`,
          'error',
          5000
        )
      }
    } catch (error: any) {
      showCustomToast(
        'Error',
        error?.message ?? 'Failed to disconnect',
        'error',
        5000
      )
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {children ? (
        <SheetTrigger asChild>{children}</SheetTrigger>
      ) : (
        <SheetTrigger asChild>
          <Button
            variant='primary'
            className={cn(
              'fds-text-sm mt-4 cursor-pointer',
              integration.status === 'coming-soon'
                ? 'border border-text-20 bg-transparent text-primary-blue hover:bg-transparent'
                : integration.status === INTEGRATION_STATUS.CONNECTED
                  ? 'border border-primary-blue bg-transparent text-primary-blue hover:bg-transparent'
                  : ''
            )}
            disabled={
              integration.status === 'coming-soon' ||
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
          </Button>
        </SheetTrigger>
      )}
      <SheetContent
        showCloseIcon
        closeIconClassName='right-[15px] top-[15px] rounded-[6px] border border-[#BEDBFF] p-2 bg-[#E9EFF6] opacity-100 hover:opacity-100'
        className='w-full max-w-[482px] overflow-y-auto bg-white p-0'
      >
        <div className='px-[25px] py-5'>
          <span className='text-sm font-medium leading-[114.286%] text-[#4D5C78]'>
            Integration details
          </span>
        </div>

        <MaxWidthWrapper className='max-w-none px-[25px] pb-10 pt-4'>
          <SheetHeader className='space-y-8 text-left'>
            <div className='space-y-[25px]'>
              <Image
                src={integration.logo}
                alt={integration.name}
                width={integration.drawerImgWidth || 58}
                height={integration.drawerImgHeight || 58}
              />

              <div className='space-y-2'>
                <SheetTitle className='leading-0 text-[20px] font-medium tracking-normal text-[#2F3B51]'>
                  {integration.name}
                </SheetTitle>
                <p className='text-[14px] text-[#4D5C78]'>
                  {integration.description}
                </p>
              </div>
            </div>

            <div className='flex flex-wrap gap-4'>
              {integration.status === INTEGRATION_STATUS.CONNECTED ? (
                <Button
                  variant='outline'
                  className='min-w-[94px] rounded-[10px] border-[#DC2626] px-6 text-[#DC2626] hover:bg-[#FEE2E2] hover:text-[#DC2626]'
                  onClick={() => {
                    document
                      .getElementById('disconnect-section')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Disconnect
                </Button>
              ) : (
                <Button
                  className='min-w-[94px] rounded-[10px] border border-[#6863FB] bg-[#6863FB] px-6 text-white hover:bg-[#5651D9]'
                  onClick={() => handleConnectIntegration(integration.id)}
                >
                  Connect
                </Button>
              )}

              <Button
                variant='outline'
                className='rounded-[10px] border-[#91A4C6] px-6 text-[#687896] hover:bg-transparent'
                onClick={() => window.open(integration.url, '_blank')}
              >
                View Documentation
                <SquareArrowOutUpRight size={16} className='ml-2' />
              </Button>
            </div>
          </SheetHeader>

          <div className='mt-[30px] space-y-[25px]'>
            {integration?.useCases?.length > 0 && (
              <section className='border-t border-[#D7E3F4] pt-[25px]'>
                <h3 className='text-[14px] font-medium tracking-normal text-[#2F3B51]'>
                  What you can do
                </h3>

                <ul className='mt-[10px] space-y-4'>
                  {integration.useCases.map((item: string, index: number) => (
                    <li
                      key={`${integration.id}-usecase-${index}`}
                      className='flex items-start gap-3'
                    >
                      <span className='mt-[8px] h-[8px] w-[8px] shrink-0 rounded-full bg-[#635BFF]' />
                      <p className='text-[14px] text-[#4D5C78]'>{item}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className='border-t border-[#D7E3F4] pt-[25px]'>
              <h3 className='text-[14px] font-medium tracking-normal text-[#2F3B51]'>
                Integration details
              </h3>

              <div className='mt-[10px] grid grid-cols-2 gap-3'>
                <div className='rounded-[12px] bg-[#F3F6FB] p-4'>
                  <p className='text-[9px] font-medium text-[#687896]'>
                    Auth type
                  </p>
                  <p className='text-[14px] font-medium text-[#2F3B51]'>
                    {integration.authType || 'OAuth 2.0'}
                  </p>
                </div>

                <div className='rounded-[12px] bg-[#F3F6FB] p-4'>
                  <p className='text-[9px] font-medium text-[#687896]'>
                    Sync frequency
                  </p>
                  <p className='text-[14px] font-medium text-[#2F3B51]'>
                    {integration.syncFrequency || 'Real-time'}
                  </p>
                </div>

                <div className='rounded-[12px] bg-[#F3F6FB] p-4'>
                  <p className='text-[9px] font-medium text-[#687896]'>
                    Setup time
                  </p>
                  <p className='text-[14px] font-medium text-[#2F3B51]'>
                    {integration.setupTime || '5 min'}
                  </p>
                </div>

                <div className='rounded-[12px] bg-[#F3F6FB] p-4'>
                  <p className='text-[9px] font-medium text-[#687896]'>
                    Available on
                  </p>
                  <p className='text-[14px] font-medium text-[#2F3B51]'>
                    {integration.availableOn || 'Enterprise'}
                  </p>
                </div>
              </div>
            </section>

            <section className='border-t border-[#D7E3F4] pt-[25px]'>
              <h3 className='text-[14px] font-medium tracking-normal text-[#2F3B51]'>
                Setup Steps
              </h3>

              <ol className='list-decimal pl-6 text-[14px] text-[#4D5C78]'>
                <li>Connect your account via Oauth</li>
              </ol>
            </section>

            {integration.status === INTEGRATION_STATUS.CONNECTED && (
              <section
                id='disconnect-section'
                className='border-t border-[#D7E3F4] pt-[25px]'
              >
                <div className='rounded-[12px] border border-[#E4E7EC] p-4'>
                  <h2 className='mb-1 text-[16px] font-semibold text-[#2F3B51]'>
                    Disconnect {integration.name}
                  </h2>

                  <div className='space-y-4'>
                    <p className='text-[14px] text-[#4D5C78]'>
                      Remove this integrated app and any configuration from
                      Sharkdom.
                    </p>

                    <Button
                      variant='destructiveSolid'
                      className='flex items-center gap-2'
                      onClick={() => setShowDisconnectDialog(true)}
                    >
                      <Trash2 className='h-4 w-4' />
                      Uninstall
                    </Button>
                  </div>
                </div>

                <AlertDialog
                  open={showDisconnectDialog}
                  onOpenChange={setShowDisconnectDialog}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className='text-[16px] font-semibold text-[#2F3B51]'>
                        Are you sure you want to disconnect?
                      </AlertDialogTitle>
                      <AlertDialogDescription className='text-[14px] text-[#4D5C78]'>
                        All the auto sync would be disabled after disconnecting.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='flex-row gap-3 sm:justify-start'>
                      <Button
                        variant='destructiveSolid'
                        onClick={() => {
                          setShowDisconnectDialog(false)
                          handleDisconnectIntegration(integration.id)
                        }}
                      >
                        Confirm and Delete
                      </Button>
                      <Button
                        variant='outline'
                        onClick={() => setShowDisconnectDialog(false)}
                      >
                        Cancel
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </section>
            )}
          </div>
        </MaxWidthWrapper>
      </SheetContent>
    </Sheet>
  )
}

export default memo(IntegrationDrawer)
