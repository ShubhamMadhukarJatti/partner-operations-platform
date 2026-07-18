import React, { useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useIntegrationApps } from '@/http-hooks/app-integration'
import { Plus } from 'lucide-react'

import { ALL_INTEGRATIONS, INTEGRATIONS } from '@/lib/constants/integrations'
import { Button } from '@/components/ui/button'
import IntegrationDrawer from '@/app/(app)/(dashboard-pages)/integrations/_components/integration-drawer'

const DealNotPresentPlaceholder = () => {
  const router = useRouter()
  const { integrations } = useIntegrationApps()

  // Get integration data for HubSpot, Google Sheets, and Salesforce
  // Use ALL_INTEGRATIONS as fallback if integrations from hook aren't loaded yet
  const hubspotIntegration = useMemo(() => {
    const fromHook = integrations?.find(
      (integration: any) => integration.id === INTEGRATIONS.HUBSPOT_OUTREACH
    )
    return (
      fromHook ||
      ALL_INTEGRATIONS.find(
        (integration: any) => integration.id === INTEGRATIONS.HUBSPOT_OUTREACH
      )
    )
  }, [integrations])

  const googleSheetIntegration = useMemo(() => {
    const fromHook = integrations?.find(
      (integration: any) => integration.id === INTEGRATIONS.GOOGLE_SHEET
    )
    return (
      fromHook ||
      ALL_INTEGRATIONS.find(
        (integration: any) => integration.id === INTEGRATIONS.GOOGLE_SHEET
      )
    )
  }, [integrations])

  const salesforceIntegration = useMemo(() => {
    const fromHook = integrations?.find(
      (integration: any) => integration.id === INTEGRATIONS.SALESFORCE_CRM
    )
    return (
      fromHook ||
      ALL_INTEGRATIONS.find(
        (integration: any) => integration.id === INTEGRATIONS.SALESFORCE_CRM
      )
    )
  }, [integrations])

  return (
    <div className='flex max-w-[800px] flex-col items-center justify-center'>
      <div
        className='relative mb-8 w-full max-w-3xl overflow-hidden rounded-[16px] border border-[#DFE3E8] bg-cover bg-center bg-no-repeat px-10 py-12'
        style={{
          backgroundImage:
            "url('/assets/deal-registration/deal_registration_crm_bg.png')"
        }}
      >
        <div className='mb-8 max-w-lg'>
          <h3 className='mb-3 text-xl font-bold text-gray-900'>
            Keep your deals in sync with your CRMs
          </h3>
          <p className='text-sm leading-relaxed text-gray-500'>
            Once you create your data source, you can import and sync deal
            directly here.
          </p>
        </div>

        <div className='flex gap-4'>
          {hubspotIntegration && (
            <IntegrationDrawer integration={hubspotIntegration}>
              <div className='flex h-14 w-14 cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm transition-transform hover:scale-105 dark:border-white/10 dark:bg-transparent'>
                <Image
                  src='/hubspot-icon.svg'
                  alt='HubSpot'
                  width={28}
                  height={28}
                />
              </div>
            </IntegrationDrawer>
          )}
          {googleSheetIntegration && (
            <IntegrationDrawer integration={googleSheetIntegration}>
              <div className='flex h-14 w-14 cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm transition-transform hover:scale-105 dark:border-white/10 dark:bg-transparent'>
                <Image
                  src='/google-sheets.svg'
                  alt='Sheets'
                  width={28}
                  height={28}
                />
              </div>
            </IntegrationDrawer>
          )}
          {salesforceIntegration && (
            <IntegrationDrawer integration={salesforceIntegration}>
              <div className='flex h-14 w-14 cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm transition-transform hover:scale-105 dark:border-white/10 dark:bg-transparent'>
                <Image
                  src='/salesforce.svg'
                  alt='Salesforce'
                  width={32}
                  height={32}
                />
              </div>
            </IntegrationDrawer>
          )}
          <div
            className='flex h-14 w-14 cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm transition-transform hover:bg-gray-50 dark:border-white/10 dark:bg-transparent'
            onClick={() => router.push('/integrations')}
          >
            <Plus className='text-gray-400' size={24} />
          </div>
        </div>
      </div>

      <div className='mb-8 text-lg font-medium text-gray-400'>Or</div>

      <div className='text-center'>
        <h3 className='mb-2 text-xl font-bold text-gray-900'>
          Register your first deal
        </h3>
        <p className='mb-6 text-gray-500'>
          You can co manage the tasks with the partnerships.
        </p>
        <Button
          className='h-11 border border-blue-600 bg-white px-6 font-semibold text-blue-600 hover:bg-blue-50 dark:bg-[#090640]'
          onClick={() => router.push('/deal-pipeline/register')}
        >
          <Plus size={18} className='mr-2' /> Register Deal
        </Button>
      </div>
    </div>
  )
}

export default DealNotPresentPlaceholder
