'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { RootState } from '@/redux/store'
import { ArrowRight } from 'iconsax-react'
import {
  ArrowLeft,
  Check,
  FileText,
  HistoryIcon,
  Info,
  Loader,
  Settings,
  X as XIcon
} from 'lucide-react'
import { useSelector } from 'react-redux'

import { fetchconnectedApps } from '@/lib/db/organization'
import { getServerUser } from '@/lib/server'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  DealHistoryDrawer,
  type DealHistoryDrawerData
} from '@/components/deal-history-drawer'

interface Deal {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  customerAccountName: string
  dealId: string
  dealCode: string
  website: string
  headQuarterLocation: string
  estimatedAcv: number
  expectedClosingTime: number
  currentSolution: string
  requirements: string
  customFields: string
  dealStage: string
  source: string
  isApproved: boolean
  dealerOrgId: number
  vendorOrgId: number
  dealProtectionPeriod: number
  isSent: boolean
  customFieldsMap: Record<string, { value: any; dataType: string }>
  hotspotDealId: string
}

interface Partner {
  orgId: number
  name: string
}

interface Country {
  code: string
  name: string
}

export default function DealDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [deal, setDeal] = useState<Deal | null>(null)
  const [partners, setPartners] = useState<Partner[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [dealProtectionPeriod, setDealProtectionPeriod] = useState(90)
  const [showModal, setShowModal] = useState(false)
  const [isHubSpotConnected, setIsHubSpotConnected] = useState(false)
  const [checkingConnection, setCheckingConnection] = useState(true)
  const [hubspotApp, setHubspotApp] = useState<any>(null)
  const { organization } = useSelector((state: RootState) => state.currentOrg)
  const currentOrgId = organization?.id
  const [history, setHistory] = useState<DealHistoryDrawerData>(null)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [errorHistory, setErrorHistory] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false)
  const [connectedApps, setConnectedApps] = useState<string[]>([])
  const [selectedCRM, setSelectedCRM] = useState<string>('')

  // Helper function to format CRM names for display
  const formatCRMName = (type: string): string => {
    const nameMap: Record<string, string> = {
      G_CALENDAR: 'Google Calendar',
      G_SHEET: 'Google Sheet',
      G_FORM: 'Google Form',
      HUBSPOT: 'HubSpot',
      TRELLO: 'Trello'
    }
    return nameMap[type] || type
  }

  // Check HubSpot connection status and fetch all connected apps
  useEffect(() => {
    const checkHubSpotConnection = async () => {
      try {
        setCheckingConnection(true)

        // Fetch connected apps from new API endpoint
        const response = await fetch('/api/organization/connected/types', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch connected apps')
        }
        const connectedTypes: string[] = (
          (await response.json()) as string[]
        ).filter((type) => type !== 'STRIPE')

        if (connectedTypes.length == 0) {
          setShowModal(true)
        } else {
          console.log('connectedTypes', connectedTypes)
          // Store all connected apps
          setConnectedApps(connectedTypes)
        }

        // Set default selected CRM if available (prioritize CRM apps)
        const crmApps = connectedTypes.filter(
          (type) => type === 'HUBSPOT' || type === 'TRELLO'
        )
        if (crmApps.length > 0) {
          setSelectedCRM(crmApps[0])
          setShowModal(false)
        } else if (connectedTypes.length > 0) {
          setSelectedCRM(connectedTypes[0])
        }

        // Check HubSpot connection for backward compatibility
        const isHubSpotConnected = connectedTypes.includes('HUBSPOT')
        setIsHubSpotConnected(isHubSpotConnected)

        // Fetch detailed HubSpot app data if needed
        const apps = await fetchconnectedApps()
        const hubspotAppData = apps.find(
          (app: any) => app.integrationType === 'HUBSPOT'
        )
        setHubspotApp(hubspotAppData)

        // Add delay before showing modal to ensure correct status
        setTimeout(() => {
          if (
            !isHubSpotConnected &&
            deal &&
            deal.dealerOrgId !== currentOrgId &&
            !deal.isApproved
          ) {
            setShowModal(true)
          }
          setCheckingConnection(false)
        }, 500)
      } catch (error) {
        console.error('Error fetching connected apps:', error)
        setCheckingConnection(false)
      }
    }

    if (deal && currentOrgId && token) {
      checkHubSpotConnection()
    }
  }, [deal, currentOrgId, token])

  // Get deal data from localStorage
  useEffect(() => {
    console.log(
      'Deal detail page: Starting to load deal data from localStorage'
    )
    // Add a small delay to ensure localStorage is available
    const timer = setTimeout(() => {
      console.log('Deal detail page: Checking localStorage for selectedDeal')
      const dealDataString = localStorage.getItem('selectedDeal')
      console.log(
        'Deal detail page: localStorage data exists:',
        !!dealDataString
      )

      if (dealDataString) {
        try {
          console.log('Deal detail page: Parsing deal data from localStorage')
          const dealData = JSON.parse(dealDataString)
          console.log('Deal detail page: Parsed deal data:', dealData)

          // Validate that we have the required deal properties
          if (!dealData || !dealData.dealId) {
            throw new Error('Invalid deal data structure')
          }

          setDeal(dealData)
          setDealProtectionPeriod(dealData.dealProtectionPeriod || 90)
          setLoading(false)
          console.log(
            'Deal detail page: Deal data loaded successfully from localStorage'
          )

          // Note: Don't remove from localStorage as it may be needed for other operations
          // localStorage.removeItem('selectedDeal')
        } catch (error) {
          console.error(
            'Deal detail page: Error parsing deal data from localStorage:',
            error
          )
          setError('Failed to load deal data from localStorage')
          setLoading(false)
        }
      } else {
        console.error('Deal detail page: No deal data found in localStorage')
        setError('No deal data provided in localStorage')
        setLoading(false)
      }
    }, 100)

    const initializeData = async () => {
      setLoading(true)
      console.log('initializeData started')
      try {
        // Get user and token
        const { token, user: serverUser } = await getServerUser()
        setToken(token)
      } catch (error) {
        console.log('Error initializing data:', error)
      } finally {
        setLoading(false)
      }
    }
    initializeData()

    return () => clearTimeout(timer)
  }, [])

  // Fetch partners and countries
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch('/api/active-partners')
        if (!response.ok) {
          throw new Error('Failed to fetch active partners')
        }
        const data = await response.json()
        setPartners(data)
      } catch (error) {
        console.error('Error fetching partners:', error)
      }
    }

    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/countries')
        const data = await response.json()
        setCountries(data)
      } catch (error) {
        console.error('Error fetching countries:', error)
      }
    }

    fetchPartners()
    fetchCountries()
  }, [])

  const handleApprove = async () => {
    try {
      setSubmitting(true)

      // First, approve the deal in the system
      if (!deal?.dealId) {
        alert('Deal data is not available. Please refresh the page.')
        return
      }

      // Validate that we have a valid integration type
      if (!selectedCRM) {
        alert('Please select a CRM integration before approving the deal.')
        return
      }

      const requestBody = {
        dealId: deal.dealId,
        isApproved: true,
        dealProtectionPeriod: dealProtectionPeriod,
        integrationType: selectedCRM
      }

      const approveResponse = await fetch(
        `/api/my-deals/approve/${deal.dealId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      )

      if (!approveResponse.ok) {
        const errorText = await approveResponse.text()
        throw new Error(
          `Failed to approve deal: ${approveResponse.status} - ${errorText}`
        )
      }

      const result = await approveResponse.json()
      if (result) {
        router.push('/deal-pipeline')
        return
      }
      // Then, create HubSpot deal using the stored hubspotApp data
      // if (!hubspotApp) {
      //   alert('HubSpot integration not found. Please connect HubSpot first.')
      //   return
      // }

      // if (!hubspotApp.refreshToken) {
      //   alert('HubSpot refresh token not found. Please reconnect HubSpot.')
      //   return
      // }

      // Generate access token from refresh token using API route to avoid CORS
      const client_id = process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID
      const clientSecret = process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_SECRET
      const redirectUri = process.env.NEXT_PUBLIC_HUBSPOT_REDIRECTION_URL

      const payloadData = {
        grant_type: 'refresh_token',
        client_id: client_id as string,
        client_secret: clientSecret as string,
        redirect_uri: redirectUri as string,
        refresh_token: hubspotApp.refreshToken as string
      }

      const response = await fetch('/api/hubapi-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(payloadData).toString()
      })

      const tokenResponse = await response.json()

      if (tokenResponse && tokenResponse.access_token) {
        // Now create the HubSpot deal using the access token
        // const dealProperties = {
        //   dealname: `${deal?.customerAccountName}`,
        //   dealstage: 'appointmentscheduled',
        //   pipeline: 'default',
        //   amount: deal?.estimatedAcv?.toString() || '0',
        //   dealtype: 'newbusiness'
        // }

        router.push('/deal-pipeline')

        const createDealResponse = await fetch('/api/create-hubspot-deal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            bearerToken: tokenResponse.access_token
            // properties: dealProperties
          })
        })

        // const createDealResult = await createDealResponse.json()

        // if (createDealResult.success) {
        //   // Redirect to deal pipeline
        //   router.push('/deal-pipeline')
        // } else {
        //   alert('Failed to create deal in HubSpot. Check console for details.')
        //   // Still redirect even if HubSpot creation fails since deal is approved
        //   router.push('/deal-pipeline')
        // }
      } else {
        alert(
          'Failed to generate HubSpot access token. Please check the console for details.'
        )
        // Still redirect even if HubSpot creation fails since deal is approved
        router.push('/deal-pipeline')
      }
    } catch (error) {
      alert(
        'An error occurred while processing the approval. Check console for details.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeny = async () => {
    try {
      setSubmitting(true)
      if (!isHubSpotConnected) {
        setShowModal(true)
        return
      }
      if (!deal?.dealId) {
        alert('Deal data is not available. Please refresh the page.')
        return
      }

      const requestBody = {
        dealId: deal.dealId,
        isApproved: false,
        dealProtectionPeriod: dealProtectionPeriod
      }

      const response = await fetch(`/api/my-deals/approve/${deal.dealId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `Failed to deny deal: ${response.status} - ${errorText}`
        )
      }

      const result = await response.json()

      // Redirect to deal pipeline
      router.push('/deal-pipeline')
    } catch (error) {
      alert('Failed to deny deal')
    } finally {
      setSubmitting(false)
    }
  }

  const LoadingSkeleton = () => (
    <div className='relative min-h-screen bg-[#FAFBFC]'>
      <div className='flex w-full flex-col items-center'>
        <div className='flex w-full flex-col gap-0 px-4 pb-12 pt-8 md:px-[10%]'>
          <Link
            href='/deal-pipeline'
            className='mb-4 flex items-center gap-2 text-sm font-medium text-primary-blue hover:underline'
          >
            <ArrowLeft size={18} /> Back to Deal Pipeline
          </Link>
          <div className='mb-2 text-xl font-bold text-[#1A202C] md:text-2xl'>
            Deal Details
          </div>
          <div className='mb-6 text-sm text-[#6B7280] md:text-base'>
            Review deal registration details
          </div>

          <div className='flex w-full flex-col items-start gap-6 md:flex-row md:gap-8'>
            {/* Left: Form skeleton */}
            <div className='w-full flex-1 md:min-w-[340px]'>
              <div className='mb-6 rounded-2xl border bg-white p-4 md:p-8'>
                <div className='mb-6 flex items-center gap-2'>
                  <FileText size={20} className='text-gray-800' />
                  <span className='text-base font-semibold text-[#1A202C] md:text-lg'>
                    Opportunity Details
                  </span>
                </div>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className={i > 6 ? 'md:col-span-2' : ''}>
                      <div className='mb-1 h-3 w-24 animate-pulse rounded bg-gray-200'></div>
                      <div className='h-10 animate-pulse rounded-lg bg-gray-200'></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Sidebar skeleton */}
            <div className='mt-6 flex w-full flex-col gap-4 md:mt-0 md:max-w-xs md:gap-6'>
              {[1].map((i) => (
                <div key={i} className='rounded-2xl border bg-white p-4 md:p-6'>
                  <div className='mb-4 h-6 w-32 animate-pulse rounded bg-gray-200'></div>
                  <div className='space-y-2'>
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className='flex justify-between'>
                        <div className='h-4 w-16 animate-pulse rounded bg-gray-200'></div>
                        <div className='h-4 w-20 animate-pulse rounded bg-gray-200'></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return <LoadingSkeleton />
  }

  if (!deal) {
    return <LoadingSkeleton />
  }

  const isReviewCompleted = deal.isApproved || deal.dealStage === 'APPROVED'

  const fetchHistory = async (hubSpotDealId: string) => {
    try {
      setLoadingHistory(true)
      console.log('fetch deal called')
      const response = await fetch(
        `/api/my-deals/${hubSpotDealId}/history?isVendor=true`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (!response.ok) {
        throw new Error('Failed to fetch deals')
      }
      const data = await response.json()
      console.log('fetchHistory', data)
      setHistory(data)
      setIsHistoryDrawerOpen(true)
    } catch (error) {
      console.error('Error fetching deals:', error)
      setError('Failed to load deals')
    } finally {
      setLoadingHistory(false)
    }
  }
  return (
    <div className='min-h-screen bg-[#FAFBFC]'>
      <div className='flex w-full flex-col items-center'>
        <div className='flex w-full flex-col gap-0 px-4 pb-12 pt-8 md:px-[10%]'>
          <div className='flex w-full flex-col gap-0'>
            <div className='flex w-full flex-col items-start gap-6 md:flex-row md:gap-8'>
              {/* Content on the left */}
              <div className='flex-1'>
                {/* Add any additional content here, if needed */}
                <Link
                  href='/deal-pipeline'
                  className='mb-4 flex items-center gap-2 text-sm font-medium text-primary-blue hover:underline'
                >
                  <ArrowLeft size={18} /> Back to Deal Pipeline
                </Link>

                <div className='mb-2 text-xl font-bold text-[#1A202C] md:text-2xl'>
                  Deal Details
                </div>

                <div className='mb-6 text-sm text-[#6B7280] md:text-base'>
                  Review deal registration details
                </div>
              </div>

              {/* CRM Dropdown and Button aligned to the right */}
              <div className='ml-auto flex items-center gap-3'>
                {deal?.dealerOrgId !== currentOrgId &&
                  !deal?.isApproved &&
                  connectedApps.length > 0 && (
                    <div className='flex flex-col'>
                      <label className='mb-1 text-xs font-medium text-[#6B7280]'>
                        Connected CRM
                      </label>
                      <Select
                        value={selectedCRM}
                        onValueChange={setSelectedCRM}
                      >
                        <SelectTrigger className='h-9 w-[200px] rounded-lg border-gray-300 [&>span[data-placeholder]]:text-[#6B7280] [&>span]:text-black'>
                          <SelectValue
                            placeholder='Select CRM'
                            className='text-black placeholder:text-[#6B7280]'
                          >
                            {formatCRMName(selectedCRM)}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {connectedApps
                            .filter((appType) => appType !== 'G_CALENDAR')
                            .map((appType) => (
                              <SelectItem key={appType} value={appType}>
                                {formatCRMName(appType)}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                <Button
                  className='flex gap-2'
                  size='sm'
                  loading={loadingHistory}
                  onClick={() => fetchHistory(deal?.hotspotDealId || '')}
                >
                  <HistoryIcon size={16} /> View History
                </Button>
              </div>
            </div>
          </div>

          <div className='flex w-full flex-col items-start gap-6 md:flex-row md:gap-8'>
            <div className='w-full flex-1 md:min-w-[340px]'>
              <div className='mb-6 rounded-2xl border bg-white p-4 md:p-8'>
                <div className='mb-6 flex items-center gap-2'>
                  <FileText size={20} className='text-gray-800' />
                  <span className='text-base font-semibold text-[#1A202C] md:text-lg'>
                    Opportunity Details
                  </span>
                </div>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div>
                    <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                      Customer Account Name
                    </label>
                    <Input
                      value={deal?.customerAccountName || 'N/A'}
                      className='rounded-lg bg-gray-50 text-black placeholder:text-[#6B7280]'
                      readOnly
                    />
                  </div>
                  <div>
                    <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                      Website
                    </label>
                    <Input
                      value={deal?.website || 'N/A'}
                      className='rounded-lg bg-gray-50 text-black placeholder:text-[#6B7280]'
                      readOnly
                    />
                  </div>
                  <div>
                    <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                      Headquarter Location
                    </label>
                    <Input
                      value={deal?.headQuarterLocation || 'N/A'}
                      className='rounded-lg bg-gray-50 text-black placeholder:text-[#6B7280]'
                      readOnly
                    />
                  </div>
                  <div>
                    <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                      Estimated ACV
                    </label>
                    <Input
                      value={
                        deal?.estimatedAcv
                          ? `$${deal.estimatedAcv.toLocaleString()}`
                          : 'N/A'
                      }
                      className='rounded-lg bg-gray-50 text-black placeholder:text-[#6B7280]'
                      readOnly
                    />
                  </div>

                  <div className='md:col-span-2'>
                    <div>
                      <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                        Expected closing time
                      </label>
                      <Input
                        value={
                          deal?.expectedClosingTime
                            ? `${deal.expectedClosingTime} days`
                            : 'N/A'
                        }
                        className='rounded-lg bg-gray-50 text-black placeholder:text-[#6B7280]'
                        readOnly
                      />
                    </div>
                    <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                      Current Solution/Competitor
                    </label>
                    <Input
                      value={deal?.currentSolution || 'N/A'}
                      className='rounded-lg bg-gray-50 text-black placeholder:text-[#6B7280]'
                      readOnly
                    />
                  </div>
                  <div className='md:col-span-2'>
                    <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                      Use Case & Requirements
                    </label>
                    <Textarea
                      value={deal?.requirements || 'N/A'}
                      rows={3}
                      className='rounded-lg bg-gray-50'
                      readOnly
                    />
                  </div>

                  {/* Custom Fields */}
                  {deal?.customFieldsMap &&
                    Object.entries(deal.customFieldsMap).map(
                      ([fieldName, fieldData]) => (
                        <div key={fieldName} className='md:col-span-2'>
                          <div className='mb-1 flex items-center justify-between'>
                            <label className='block text-xs font-medium text-[#6B7280]'>
                              {fieldName}
                            </label>
                          </div>
                          <Input
                            value={String(fieldData?.value || 'N/A')}
                            className='rounded-lg bg-gray-50 text-black placeholder:text-[#6B7280]'
                            readOnly
                          />
                        </div>
                      )
                    )}
                </div>

                {deal?.dealerOrgId !== currentOrgId && !deal?.isApproved && (
                  <div className='mt-8 flex flex-col gap-3 md:flex-row md:gap-4'>
                    <Button
                      variant='outline'
                      className='flex-1 rounded-lg border-gray-300 text-gray-700'
                      onClick={handleDeny}
                      disabled={submitting}
                    >
                      <XIcon size={16} className='mr-2' /> Deny
                    </Button>
                    <Button
                      variant={
                        submitting || !selectedCRM ? 'disable' : 'primary'
                      }
                      className={cn(
                        'flex-1 rounded-lg font-semibold',
                        (submitting || !selectedCRM) &&
                          'disabled:pointer-events-auto disabled:cursor-not-allowed'
                      )}
                      onClick={handleApprove}
                      disabled={submitting || !selectedCRM}
                    >
                      {submitting ? (
                        <>
                          <Loader size={16} className='mr-2 animate-spin' />
                          Approving...
                        </>
                      ) : (
                        <>
                          <Check size={16} className='mr-2' />
                          Approve
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className='mt-6 flex w-full flex-col gap-4 md:mt-0 md:max-w-xs md:gap-6'>
              <div className='rounded-2xl border bg-white p-4 md:p-6'>
                <div className='mb-4 text-base font-semibold text-[#1A202C] md:text-lg'>
                  Process Overview
                </div>
                <ol className='space-y-2 text-sm'>
                  <li className='flex items-center gap-2 text-black'>
                    <span className='flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-black text-white'>
                      <Check size={14} />
                    </span>
                    Submit Registration
                  </li>
                  <li className='flex items-center gap-2 text-black'>
                    <span className='flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-black text-white'>
                      <Check size={14} />
                    </span>
                    CRM Sync
                  </li>
                  <li
                    className={cn(
                      'flex items-center gap-2',
                      isReviewCompleted ? 'text-black' : 'text-gray-600'
                    )}
                  >
                    <span className='flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-black text-white'>
                      {isReviewCompleted ? <Check size={14} /> : 3}
                    </span>
                    Review ≤48h
                  </li>
                </ol>
              </div>

              <div className='flex flex-col gap-2 rounded-2xl border bg-white p-4 text-sm text-gray-700 md:p-6'>
                Deal Created on{' '}
                {deal?.creationTimestamp
                  ? new Date(deal.creationTimestamp).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                      timeZoneName: 'short'
                    })
                  : 'N/A'}
                <br />
              </div>
              <div className='flex flex-col gap-2 rounded-2xl border bg-white p-4 text-sm text-gray-500 md:p-6'>
                <div className='flex items-center gap-2 text-black'>
                  <Settings size={20} />
                  <span className='text-sm'>Deal Settings</span>
                </div>
                <p className='text-sm'>Deal Protection Period</p>
                <div className='flex items-center'>
                  <Input
                    type='text'
                    inputMode='numeric'
                    pattern='[0-9]*'
                    placeholder='90'
                    className='w-[60px] rounded-lg text-center'
                    value={dealProtectionPeriod}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      const num = Number(value)

                      if (!value) {
                        setDealProtectionPeriod(90)
                        return
                      }

                      if (num >= 10 && num <= 90) {
                        setDealProtectionPeriod(num)
                      }
                    }}
                    disabled={deal?.vendorOrgId === currentOrgId}
                  />
                  <span className='ml-2'>days</span>
                </div>
                <p className='text-sm'>
                  The number of days this deal will be protected from other
                  partners registering the same opportunity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal &&
        // deal.dealerOrgId !== currentOrgId &&
        !deal.isApproved &&
        !checkingConnection && (
          <div
            className='fixed inset-0 z-50 flex w-full items-center justify-center bg-black bg-opacity-80 transition-all'
            onClick={() => setShowModal(false)} // close when clicking overlay
          >
            <div
              className='flex w-5/12 flex-col gap-6 rounded-xl bg-white p-6'
              onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
            >
              {/* Modal content */}
              <div className='flex items-start gap-3'>
                <div className='mt-1'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F6FF]'>
                    <Info className='h-5 w-5 text-[#2563EB]' strokeWidth={2} />
                  </div>
                </div>
                <div className='flex flex-col gap-0.5'>
                  <p className='text-xl font-semibold text-[#0F172A]'>
                    You need to connect your CRM
                  </p>
                  <p className='text-sm text-[#475569]'>
                    Connect your company information to unlock insights
                  </p>
                </div>
              </div>
              <p className='text-sm text-[#475569]'>
                To see your audience overlap and partnership potential with{' '}
                <span className='font-semibold'>
                  {deal?.customerAccountName || 'the company'}
                </span>
                , we need some basic information about company and target
                audience.
              </p>
              <div className='flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4'>
                <Link href='/integrations' className='w-1/2'>
                  <div className='inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#3E50F7] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2c3ed9]'>
                    Connect CRM
                    <ArrowRight size={16} />
                  </div>
                </Link>
                <a
                  className='transitio inline-flex cursor-pointer items-center justify-center gap-2 bg-white px-5 py-2 text-sm font-semibold text-gray-700'
                  href='https://help.sharkdom.com/'
                  target='_blank'
                >
                  Why do I need to connect CRM?
                </a>
              </div>
            </div>
          </div>
        )}

      {/* Deal History Drawer */}
      <DealHistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        historyData={history}
      />
    </div>
  )
}
