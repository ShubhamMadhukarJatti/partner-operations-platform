'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useIntegrationApps } from '@/http-hooks/app-integration'
import { useQuery } from '@tanstack/react-query'
import { ArrowUp, Search } from 'lucide-react'

import {
  fetchconnectedApps,
  getCurrentOrganization,
  PatchIntegrationData,
  Postintegrationdata
} from '@/lib/db/organization'
import { getSubscription } from '@/lib/db/subscription'
import { Button } from '@/components/ui/button'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'
import { showCustomToast } from '@/components/custom-toast'
import { Logo } from '@/components/icons/logo'

import MainIntegrationApps from './_components/main-integrationa-apps'
import MoreIntegrationApps from './_components/more-integration-apps'
import { SelectSlackChannel } from './_components/select-slack-channel'

const IntegrationsPage = ({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) => {
  const pathname = usePathname()
  const searchParamss = useSearchParams()
  const router = useRouter()
  const code = searchParams?.code as string
  const zohoState = searchParams?.state as string
  const [error, setError] = useState<string | null>(null)

  const [slackOpen, setSlackOpen] = useState<boolean>(false)
  const [updateTrigger, setUpdateTrigger] = useState(false)
  const [isHubspotLoading, setIsHubspotLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filterTabs = [
    'All',
    'CRM',
    'Communication',
    'Productivity',
    'Payments',
    'Connected'
  ]

  // useEffect(() => {
  //   const fetchApps = async () => {
  //     try {
  //       const connectedApps: any[] = await fetchconnectedApps()
  //       setConnectedApps(connectedApps)
  //       const connectedAppsSet = new Set(
  //         connectedApps
  //           // .filter((c) => c.refreshToken && c.connected)
  //           .filter((c) => c.refreshToken)
  //           .map((c) => c.integrationType)
  //       )
  //       const disconnectedAppsSet = new Set(
  //         connectedApps
  //           // .filter((c) => c.refreshToken && c.connected)
  //           .filter((c) => !c.refreshToken)
  //           .map((c) => c.integrationType)
  //       )

  //       const appsStatusMap: Record<string, string> = {}
  //       ALL_INTEGRATIONS.forEach((i) => {
  //         if (COMING_SOON_INTEGRATIONS.has(i.id))
  //           appsStatusMap[i.id] = INTEGRATION_STATUS.COMING_SOON
  //         else if (connectedAppsSet.has(i.id))
  //           appsStatusMap[i.id] = INTEGRATION_STATUS.CONNECTED
  //         else if (disconnectedAppsSet.has(i.id))
  //           appsStatusMap[i.id] = INTEGRATION_STATUS.IN_ACTIVE
  //         else appsStatusMap[i.id] = INTEGRATION_STATUS.NOT_CONNECTED
  //       })

  //       const updatedIntegrationsList = ALL_INTEGRATIONS?.map((k) => ({
  //         ...k,
  //         status: appsStatusMap[k.id]
  //       }))

  //       setIntegrations(updatedIntegrationsList)
  //     } catch (err) {
  //       console.error('Error fetching connected apps:', err)
  //       setError('Error fetching connected apps')
  //     }
  //   }
  //   fetchApps()
  // }, [])

  // Handle Trello OAuth callback
  const handleTrelloCallback = useCallback(async () => {
    // Check if we have a token in the URL fragment
    setTimeout(() => {
      showCustomToast(
        'Processing',
        'Processing Trello integration...',
        'info',
        5000
      )
    }, 1000)
    const hash = window.location.hash
    const tokenMatch = hash.match(/token=([^&]+)/)

    if (tokenMatch) {
      const token = tokenMatch[1]

      try {
        const { id } = await getCurrentOrganization()

        const updatePayload = {
          organizationId: id,
          refreshToken: token,
          integrationType: 'TRELLO'
        }

        const postData = await Postintegrationdata(
          JSON.stringify(updatePayload)
        )

        if (postData?.statusCode === 400) {
          showCustomToast('Info', postData?.message, 'info', 5000)
          const patchData = await PatchIntegrationData(
            JSON.stringify(updatePayload)
          )
          console.log('Trello PATCH data:', patchData)
        }

        showCustomToast(
          'Success',
          'Trello App Installed Successfully!',
          'success',
          5000
        )

        // Clean up URL
        const url = new URL(window.location.href)
        url.searchParams.delete('trello_callback')
        url.hash = ''
        router.replace(url.pathname + url.search)
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } catch (error) {
        console.error('Error handling Trello integration:', error)
        showCustomToast('Error', 'Failed to connect Trello', 'error', 5000)
      }
    } else {
      // No token found, redirect back to integrations
      const url = new URL(window.location.href)
      url.searchParams.delete('trello_callback')
      router.replace(url.pathname + url.search)
    }
  }, [router])

  useEffect(() => {
    if (pathname === '/integrations' && searchParamss.get('app') === 'SLACK') {
      setSlackOpen(true)
    }
  }, [pathname, searchParamss])

  // Handle OAuth success callbacks
  useEffect(() => {
    const success = searchParamss.get('success')
    const trelloCallback = searchParamss.get('trello_callback')

    if (success === 'salesforce_connected') {
      showCustomToast(
        'Success',
        'Salesforce App Installed Successfully!',
        'success',
        5000
      )

      // Clean up URL parameters
      const url = new URL(window.location.href)
      url.searchParams.delete('success')
      url.searchParams.delete('access_token')
      router.replace(url.pathname + url.search)
    } else if (success === 'close_connected') {
      showCustomToast(
        'Success',
        'Close CRM App Installed Successfully!',
        'success',
        5000
      )

      // Clean up URL parameters
      const url = new URL(window.location.href)
      url.searchParams.delete('success')
      router.replace(url.pathname + url.search)
    } else if (success === 'trello_connected') {
      showCustomToast(
        'Success',
        'Trello App Installed Successfully!',
        'success',
        5000
      )

      // Clean up URL parameters
      const url = new URL(window.location.href)
      url.searchParams.delete('success')
      router.replace(url.pathname + url.search)
    } else if (trelloCallback === 'true') {
      // Handle Trello callback - token is in URL fragment
      handleTrelloCallback()
    }
  }, [searchParamss, router, handleTrelloCallback])

  const fetchHubspotCodeApps = useCallback(async () => {
    setIsHubspotLoading(true)
    const client_id = process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID as string
    const clientSecret = process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_SECRET as string
    const redirectUri = process.env
      .NEXT_PUBLIC_HUBSPOT_REDIRECTION_URL as string
    setTimeout(() => {
      showCustomToast(
        'Processing',
        'Processing HubSpot integration...',
        'info',
        5000
      )
    }, 800)
    try {
      const payloadData = {
        grant_type: 'authorization_code',
        client_id: client_id,
        client_secret: clientSecret,
        // redirect_uri: redirectUri,
        redirect_uri: redirectUri,
        code: code
      }

      const response = await fetch('/api/hubapi-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(payloadData).toString()
      })

      const data = await response.json()
      console.log('🚀🚀🚀    ', data)
      if (data.access_token) {
        const { id } = await getCurrentOrganization()

        const updatePayload = {
          organizationId: id,
          refreshToken: data.refresh_token,
          integrationType: 'HUBSPOT'
        }

        const postData = await Postintegrationdata(
          JSON.stringify(updatePayload)
        )
        if (postData?.statusCode === 400) {
          showCustomToast('Info', postData?.message, 'info', 5000)
          console.log('POST DATA:::::', { postData })
          const updatePayload = {
            organizationId: id,
            refreshToken: data?.refresh_token,
            integrationType: 'HUBSPOT'
          }
          console.log('PATCH DATA:::::', { postData })

          const patchData = await PatchIntegrationData(
            JSON.stringify(updatePayload)
          )
          // router.push(`integrations/referral-programs?appId=${patchData?.id}`)
          console.log(
            '-----HUBSPOT:::Updated:PatchIntegrationData---',
            patchData
          )

          // Check if this came from my-data flow and redirect accordingly
          if (searchParams?.state === 'my-data-flow') {
            showCustomToast(
              'Success',
              'HubSpot App Installed Successfully!',
              'success',
              5000
            )
            sessionStorage.setItem('crm_just_connected', 'hubspot')
            setTimeout(() => {
              router.push('/my-data/connect-service/hubspot')
            }, 400)
            return
          } else {
            showCustomToast(
              'Success',
              'HubSpot App Installed Successfully!',
              'success',
              5000
            )
            // Strip code/state from URL before reload to prevent re-processing
            window.history.replaceState({}, '', pathname || '/integrations')
            window.location.reload()
          }
          return
        }
        // router.push(`integrations/referral-programs?appId=${postData?.id}`)
        console.log('POST DATA:::::', { postData })

        // Check if this came from my-data flow and redirect accordingly
        if (searchParams?.state === 'my-data-flow') {
          showCustomToast(
            'Success',
            'HubSpot App Installed Successfully!',
            'success',
            5000
          )
          sessionStorage.setItem('crm_just_connected', 'hubspot')
          setTimeout(() => {
            router.push('/my-data/connect-service/hubspot')
          }, 400)
          return
        } else {
          showCustomToast(
            'Success',
            'HubSpot App Installed Successfully!',
            'success',
            5000
          )
          // Strip code/state from URL before reload to prevent re-processing
          window.history.replaceState({}, '', pathname || '/integrations')
          window.location.reload()
        }
      } else {
        console.error(
          '[HubSpot OAuth] Failed to obtain access token:',
          data.message
        )
        setError(
          'Something went wrong while connecting HubSpot. Please try again.'
        )
      }
    } catch (e) {
      console.error('[HubSpot OAuth] Error handling HubSpot integration:', e)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsHubspotLoading(false)
    }
  }, [code, router])

  // const fetchZohoByCode = useCallback(async () => {
  //   if (code) {
  //     const zohoId = process.env.NEXT_PUBLIC_ZOHO_CLIENT_ID as string
  //     const zohoSecret = process.env.NEXT_PUBLIC_ZOHO_CLIENT_SECRET as string
  //     const redirectUri = process.env.NEXT_PUBLIC_ZOHO_REDIRECTION_URL as string

  //     const payloadData = {
  //       grant_type: 'authorization_code',
  //       client_id: zohoId,
  //       client_secret: zohoSecret,
  //       redirect_uri: redirectUri,
  //       code: code
  //     }
  //     const response = await fetch('/api/zoho-token', {
  //       method: 'POST',
  //       body: new URLSearchParams(payloadData).toString()
  //     })
  //     const data = await response.json()

  //     if (data.access_token) {
  //       const { id } = await getCurrentOrganization()

  //       const updatePayload = {
  //         organizationId: id,
  //         refreshToken: data.refresh_token,
  //         integrationType: 'ZOHO'
  //       }

  //       const postData = await Postintegrationdata(
  //         JSON.stringify(updatePayload)
  //       )

  //       if (postData?.id) {
  //         router.push(`integrations/referral-programs?appId=${postData?.id}`)
  //       } else {
  //         router.refresh()
  //       }

  //       console.log('POST DATA:::::', { postData })
  //     } else {
  //       setError(
  //         `Failed to obtain access token: ${data.message || 'Unknown error'}`
  //       )
  //     }
  //   }
  // }, [code, router])

  useEffect(() => {
    const zohoStateMatch = zohoState === process.env.NEXT_PUBLIC_ZOHO_STATE

    if (zohoStateMatch && code) {
      // fetchZohoByCode()
    } else if (code) {
      fetchHubspotCodeApps()
    }
  }, [code, fetchHubspotCodeApps, router, zohoState])

  const {
    integrations,
    isLoading,
    error: fetchError
  } = useIntegrationApps({
    activeFilter: activeFilter as
      | 'All'
      | 'CRM'
      | 'Communication'
      | 'Productivity'
      | 'Payments'
      | 'Connected',
    searchQuery
  })
  const {
    data: subscription,
    isLoading: subscriptionLoading,
    error: subscriptionError
  } = useQuery<any>({
    queryKey: ['get-subscription-data'],
    queryFn: () => getSubscription()
  })

  console.log('integrations123', integrations)

  const mainIntegrations =
    integrations?.filter((integration: any) => integration.isMain) ?? []

  const moreIntegrations =
    integrations?.filter((integration: any) => !integration.isMain) ?? []

  useEffect(() => {
    const fetchData = async () => {
      const apps: any = await fetchconnectedApps()
      console.log('thesea are my apps', apps)
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (subscription) {
      if (subscription[0]?.price.planType) {
        setUpdateTrigger(true)
      } else {
        setUpdateTrigger(false)
      }
    }
  }, [subscription])

  if (isLoading)
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Logo className='h-10 w-auto animate-pulse' />
      </div>
    )

  return (
    <Suspense>
      <div className='relative flex min-h-screen flex-col overflow-hidden bg-[#F4FAFD] dark:bg-transparent'>
        <Image
          src='/integration-blue-glow-gradient.svg'
          alt=''
          aria-hidden='true'
          width={1000}
          height={600}
          className='pointer-events-none absolute left-[-150px] top-[-150px] z-0 max-w-none'
        />

        <Image
          src='/integration-purple-glow-gradient.svg'
          alt=''
          aria-hidden='true'
          width={1800}
          height={900}
          className='pointer-events-none absolute right-[-100px] top-[-140px] z-0 max-w-none'
        />

        <div className='relative z-10'>
          <div className='px-6 pb-5 pt-6 lg:px-8'>
            <div className='w-full'>
              <h1 className='text-[28px] font-bold text-[#111827] dark:text-white'>
                Integrations
              </h1>
              <p className='mb-8 mt-1 text-[16px] text-[#4D5C78] dark:text-gray-300'>
                Connect your tools to sync data and automate partner workflows
              </p>

              {/* Filter tabs + Search */}
              <div className='mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                {/* Tabs */}
                <div className='scrollbar-hide flex items-center gap-6 overflow-x-auto whitespace-nowrap'>
                  {filterTabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveFilter(tab)}
                      className={`relative pb-[10px] font-inter text-[16px] font-medium transition-colors ${
                        activeFilter === tab
                          ? 'text-[#8B5CF6] dark:text-[#a78bfa]'
                          : 'text-[#6B7280] hover:text-[#374151] dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                    >
                      {tab}
                      {activeFilter === tab && (
                        <span className='absolute bottom-0 left-0 h-[2px] w-full rounded-t-sm bg-[#8B5CF6] dark:bg-[#a78bfa]' />
                      )}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className='relative w-full sm:w-[400px]'>
                  <Search className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#9CA3AF]' />
                  <input
                    type='text'
                    placeholder='Search integrations'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='h-[44px] w-full rounded-[8px] border border-[#E5E7EB] bg-white py-2 pl-10 pr-4 text-[15px] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#6863FB] focus:ring-1 focus:ring-[#6863FB] dark:border-border dark:bg-card dark:text-white'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Content ── */}
          <div className='flex min-h-[100vh] w-full flex-col px-6 pb-10 lg:px-8'>
            <div className='py-4' />

            {mainIntegrations.length === 0 && moreIntegrations.length === 0 ? (
              <div className='flex min-h-[60vh] flex-col items-center justify-center rounded-[24px] border border-[#E5E7EB] bg-white/70 px-6 text-center backdrop-blur-sm dark:border-border dark:bg-card/70'>
                <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF2FF]'>
                  <Search className='h-7 w-7 text-[#6863FB]' />
                </div>

                <h2 className='text-[24px] font-semibold text-[#111827] dark:text-white'>
                  No integrations found
                </h2>

                <p className='mt-2 max-w-[420px] text-sm text-[#6B7280] dark:text-gray-400'>
                  We couldn’t find any integrations matching{' '}
                  <span className='font-medium text-[#374151] dark:text-gray-200'>
                    "{searchQuery || activeFilter}"
                  </span>
                  . Try a different search term or change the filter.
                </p>

                <div className='mt-5 flex flex-wrap items-center justify-center gap-3'>
                  <Button
                    variant='outline'
                    className='rounded-full'
                    onClick={() => setSearchQuery('')}
                  >
                    Clear search
                  </Button>
                </div>
              </div>
            ) : (
              <div className='flex flex-col gap-6'>
                {mainIntegrations.length > 0 && (
                  <MainIntegrationApps
                    integrations={mainIntegrations}
                    isHubspotLoading={isHubspotLoading}
                  />
                )}

                {moreIntegrations.length > 0 && (
                  <div className='relative min-h-[80vh] w-full overflow-hidden rounded-xl'>
                    <div className='relative z-0'>
                      <MoreIntegrationApps integrations={moreIntegrations} />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' />
            <SelectSlackChannel open={slackOpen} setOpen={setSlackOpen} />
          </div>
        </div>
      </div>
    </Suspense>
  )
}

export default IntegrationsPage
