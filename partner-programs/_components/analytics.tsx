'use client'

import { SetStateAction, useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { format, subDays, subMonths, subWeeks } from 'date-fns'
import { ChevronDown } from 'lucide-react'
import { CSVLink } from 'react-csv'

import { buildHubSpotOAuthUrl } from '@/lib/crm-oauth'
import { getZohoAccessToken } from '@/lib/db/customer-persona'
import {
  fetchconnectedApps,
  getCurrentOrganization,
  Postintegrationdata
} from '@/lib/db/organization'
import { getZohoAccountsBase } from '@/lib/zoho'
import { Heading } from '@/components/ui/heading'
import { Search } from '@/components/ui/search'
import { Switch } from '@/components/ui/switch'
import { showCustomToast } from '@/components/custom-toast'

import { AnalyticsChart } from './analytics-chart'
import { ExportOption } from './ExportOption'
import GraphTabs from './GraphTabs'
import LeadsTable from './LeadsTable'

type ImpressionData = { count: number; date: string }
type LeadDetails = {
  name: string
  email: string
}
type LeadData = {
  date: string
  details: LeadDetails[]
}

interface AnalyticsDataProps {
  referralCode: string
  organizationId: number
  impressions: ImpressionData[]
  leads: LeadData[]
}

function ReferralAnalytics() {
  const params: { code: string } = useParams()
  const [position, setPosition] = useState('bottom')
  const [buttonText, setButtonText] = useState('Today')
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [page, setPage] = useState(0)
  const [uniqueImpressions, setUniqueImpressions] = useState(false)
  const [dates, setDates] = useState<{ to: string; from: string }>({
    to: '2024-05-26',
    from: '2024-05-20'
  })
  const [hubspotSyncLoading, sethubspotSyncLoadingLoading] = useState(false)
  const [zohoSyncLoading, setZohoSyncLoading] = useState(false)
  const [accessToken, setAccessToken] = useState('')

  const [zohoRefreshToken, setZohoRefreshToken] = useState('')

  console.log({ accessToken })

  const GetAccessToeken = async () => {
    const apps: any = await fetchconnectedApps()
    let keyApp = apps.find((app: any) => app.integrationType === 'HUBSPOT')

    const zohoRefreshToken = apps.find(
      (app: any) => app.integrationType === 'ZOHO'
    )?.refreshToken

    setZohoRefreshToken(zohoRefreshToken)

    const code = keyApp?.refreshToken

    if (code) {
      const client_id = process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID
      const clientSecret = process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_SECRET
      const redirectUri = process.env.NEXT_PUBLIC_HUBSPOT_REDIRECTION_URL
      try {
        const payloadData = {
          grant_type: 'refresh_token',
          client_id: client_id as string,
          client_secret: clientSecret as string,
          redirect_uri: redirectUri as string,
          refresh_token: code as string
        }
        const response = await fetch('/api/hubapi-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams(payloadData).toString()
        })

        const tokenResponse = await response.json()

        const accessToken = tokenResponse.access_token
        setAccessToken(accessToken)
        if (tokenResponse?.refresh_token) {
          console.log('-----tokenResponse:Token Recieved---')

          const { id } = await getCurrentOrganization()

          const updatePayload = {
            organizationId: id,
            refreshToken: tokenResponse?.refresh_token,
            integrationType: 'HUBSPOT'
          }

          const res = await Postintegrationdata(JSON.stringify(updatePayload))
          console.log('-----Updated:Postintegrationdata---', res)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
  const fetchAnalyticsData = useCallback(async () => {
    try {
      setAnalyticsData(null)
      const response = await fetch(
        `/api/get-referral-analytics-data?referralCode=${params?.code}&page=${page}&size=7`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Error fetching Referral Campaign Details`)
      }

      const data = await response.json()
      setAnalyticsData(data)
      console.log('REFERRAL ANALYTICS DATA:::', { data })
    } catch (error: any) {
      console.log(`ERROR fetchAnalyticsData`, error)
      showCustomToast(
        'Error',
        'Error fetching Referral Analytics Details',
        'error',
        5000
      )
    }
  }, [page])

  useEffect(() => {
    fetchAnalyticsData()
  }, [page])

  useEffect(() => {
    GetAccessToeken()
  }, [])

  // Format lead data for CSV
  const csvData =
    Array.isArray(analyticsData?.content) && analyticsData?.content?.length > 0
      ? analyticsData?.content?.map((detail: any) => ({
          'Lead Name': detail.name,
          'Email ID': detail.email
        }))
      : []

  const createCompany = async (orgID: number): Promise<number | null> => {
    try {
      const response = await fetch('/api/create-hubspot-company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          hubSpotApiKey: accessToken,
          data: {
            properties: [
              { name: 'name', value: `Company ${orgID}` },
              { name: 'description', value: `Organization id is ${orgID}` }
            ]
          }
        })
      })
      const data = await response.json()
      console.log(`Company created successfully for orgID ${orgID}`)
      return data.companyId
    } catch (error: unknown) {
      sethubspotSyncLoadingLoading(false)
      console.error(
        `Unexpected error creating company for orgID ${orgID}:`,
        error
      )
      return null
    }
  }

  const createContact = async (): Promise<number | null> => {
    sethubspotSyncLoadingLoading(true)
    const syncData =
      Array.isArray(analyticsData?.content) &&
      analyticsData?.content?.length > 0
        ? analyticsData?.content?.map((detail: any) => ({
            properties: {
              email: detail.email,
              firstname: detail.name,
              lastname: '',
              hs_lead_status: detail.leadsStatus
            }
          }))
        : []

    if (!Array.isArray(syncData) && !(syncData?.length > 0))
      throw new Error('array not found')
    try {
      const response = await fetch('/api/create-hubspot-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          inputs: syncData
        })
      })
      const data = await response.json()
      showCustomToast('Success', 'Data synced to HubSpot', 'success', 5000)

      return data
    } catch (error: unknown) {
      sethubspotSyncLoadingLoading(false)
      console.log(`Unexpected error creating contact for email:`, error)
      showCustomToast('Error', 'Error syncing data', 'error', 5000)
      return null
    } finally {
      sethubspotSyncLoadingLoading(false)
    }
  }

  const associateContactToCompany = async (body: any) => {
    try {
      const response = await fetch('/api/create-hubspot-associations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      const data = await response.json()
      console.log('assData', data)
      return data
    } catch (error: unknown) {
      sethubspotSyncLoadingLoading(false)
      console.error(
        `Unexpected error associating contact ID with company ID:`,
        error
      )
    }
  }

  // const createCompaniesAndContacts = async () => {
  //   try {
  //     sethubspotSyncLoadingLoading(true)
  //     const { id: orgId } = await getCurrentOrganization()
  //     // const companyId = await createCompany(orgId)

  //     const syncData =
  //       Array.isArray(analyticsData?.content) && analyticsData?.content?.length > 0
  //         ? analyticsData?.content?.map((detail: any) => ({
  //             properties: {
  //               'email': detail.email,
  //               'firstname': detail.name,
  //               'lastname': '',
  //               'hs_lead_status': detail.leadsStatus
  //             }
  //           }))
  //         : []
  //     console.log({ syncData })
  //     if (Array.isArray(syncData) && syncData?.length > 0) {
  //       const response: any = await createContact(syncData)
  //       if (response?.success) {
  //         // setTimeout(async () => {
  //         //   const allContactsAddedRecently = await fetch(
  //         //     `/api/get-recently-added-hubspot-contacts?count=${syncData?.length}`
  //         //   )
  //         //   const allContactsREsponse = await allContactsAddedRecently?.json()
  //         //   console.log({ allContactsREsponse })
  //         //   console.log({ contacts: allContactsREsponse?.contacts })
  //         // const bulkAssociates = allContactsREsponse?.contacts?.map(
  //         //   (contact: any) => ({
  //         //     fromObjectId: contact?.vid,
  //         //     toObjectId: companyId,
  //         //     category: 'HUBSPOT_DEFINED',
  //         //     definitionId: 1 // 1 is the default definition ID for contact-to-company in HubSpot
  //         //   })
  //         // )
  //         // console.log('bulkAssociates', bulkAssociates)
  //         // const assData = await associateContactToCompany(bulkAssociates)

  //         // if (assData?.success) {
  //         showCustomToast('Success', 'synced successfully', 'success', 5000)
  //         // sethubspotSyncLoadingLoading(false)
  //         // }
  //         // }, 3000)
  //       }
  //     }
  //   } catch (error: unknown) {
  //     sethubspotSyncLoadingLoading(false)
  //     console.error('Unexpected error integrating with HubSpot:', error)
  //   } finally {
  //     sethubspotSyncLoadingLoading(false);
  //   }
  // }

  const handleRedirection = async () => {
    if (accessToken && accessToken !== '') {
      return createContact()
    }
    showCustomToast(
      'Info',
      'please integrate HubSpot, navigating...',
      'info',
      5000
    )
    const redirectUri = process.env
      .NEXT_PUBLIC_HUBSPOT_REDIRECTION_URL as string
    const authUrl = buildHubSpotOAuthUrl({
      redirectUri,
      source: 'partner-programs-analytics'
    })
    window.open(authUrl)
  }

  // const getZohoAccessToken = async () => {
  //   const client_id = process.env.NEXT_PUBLIC_ZOHO_CLIENT_ID
  //   const clientSecret = process.env.NEXT_PUBLIC_ZOHO_CLIENT_SECRET
  //   // const redirectUri = process.env.NEXT_PUBLIC_ZOHO_REDIRECTION_URL

  //   try {
  //     const payloadData = {
  //       grant_type: 'refresh_token',
  //       client_id: client_id as string,
  //       client_secret: clientSecret as string,
  //       refresh_token: zohoRefreshToken as string
  //     }
  //     const response = await fetch('/api/zoho-token', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded'
  //       },
  //       body: new URLSearchParams(payloadData).toString()
  //     })

  //     const tokenResponse = await response.json()

  //     const accessToken = tokenResponse.access_token
  //     // setAccessToken(accessToken)
  //     if (tokenResponse?.refresh_token) {
  //       console.log('-----tokenResponse:Token Recieved---')

  //       const { id } = await getCurrentOrganization()

  //       const updatePayload = {
  //         organizationId: id,
  //         refreshToken: tokenResponse?.refresh_token,
  //         integrationType: 'ZOHO'
  //       }

  //       const res = await Postintegrationdata(JSON.stringify(updatePayload))
  //       console.log('-----Updated:Postintegrationdata---', res)
  //     }

  //     return accessToken
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  const syncLeadsToZoho = async (
    accessToken: string,
    accountsServer: string
  ) => {
    setZohoSyncLoading(true)
    const syncData =
      Array.isArray(analyticsData?.content) &&
      analyticsData?.content?.length > 0
        ? analyticsData?.content?.map((detail: any) => ({
            Email: detail.email,
            First_Name: detail.name,
            Last_Name: 'bbb',
            Lead_Status: detail.leadsStatus,
            Company: 'swwew'
          }))
        : []

    if (!Array.isArray(syncData) && !(syncData?.length > 0))
      throw new Error('array not found')
    try {
      const response = await fetch(
        `/api/sync-zoho?accounts-server=${accountsServer}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Zoho-oauthtoken ${accessToken}`
          },
          body: JSON.stringify({
            data: syncData,
            trigger: ['workflow'],
            duplicate_check_fields: ['Email']
          })
        }
      )
      const data = await response.json()
      showCustomToast('Success', 'Data synced to Zoho', 'success', 5000)

      return data
    } catch (error: unknown) {
      setZohoSyncLoading(false)
      showCustomToast('Error', 'Error syncing data', 'error', 5000)
      return null
    } finally {
      setZohoSyncLoading(false)
    }
  }

  const handleZohoClick = async () => {
    setZohoSyncLoading(true)

    //@ts-ignore
    const { accessToken, publishableKey } = await getZohoAccessToken()

    if (accessToken) {
      return syncLeadsToZoho(accessToken, publishableKey)
    }

    setZohoSyncLoading(false)
    showCustomToast(
      'Info',
      'please integrate Zoho, navigating...',
      'info',
      5000
    )
    const zohoId =
      (process.env.NEXT_PUBLIC_ZOHO_CLIENT_ID as string)
        ?.trim()
        .replace(/\+/g, '') ?? ''
    const redirectUri = process.env.NEXT_PUBLIC_ZOHO_REDIRECTION_URL as string
    const zohoScopes = process.env.NEXT_PUBLIC_ZOHO_SCOPES as string as string
    const state = JSON.stringify({
      timestamp: Date.now(),
      source: 'integration-drawer'
    })

    void (async () => {
      const zohoAccountsBase = await getZohoAccountsBase()
      const authUrl =
        `${zohoAccountsBase}/oauth/v2/auth` +
        `?scope=${encodeURIComponent(zohoScopes)}` +
        `&client_id=${zohoId}` +
        `&state=${encodeURIComponent(state)}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&access_type=offline` +
        `&prompt=consent`
      window.location.href = authUrl
    })()
  }

  return (
    <main className='flex flex-col gap-4 px-4 py-6'>
      {/* <Heading title='Referral Link Analytics' /> */}
      <div className=''>
        <GraphTabs />
      </div>

      <div className='flex gap-5'>
        <h2 className='grow items-center text-lg  font-semibold'>
          Recently Leads
        </h2>
        <Search placeholder='Search' className='w-fit shrink' />
        <ExportOption
          analyticsData={analyticsData}
          csvData={csvData}
          handleHubspotClick={handleRedirection}
          hubspotSyncLoading={hubspotSyncLoading}
          zohoSyncLoading={zohoSyncLoading}
          handleZohoClick={handleZohoClick}
          loadingText={'Syncing...'}
        />
        {/* {analyticsData?.leads?.reduce(
          (acc, lead) => acc + lead.details.length,
          0
        ) && ( */}
        {/* <div className='flex flex-col gap-2'>
            <CSVLink data={csvData} filename='leads.csv'>
              <Button variant='primary' className='border-2 border-black'>
                Export as CSV
              </Button>
            </CSVLink>
            <Button
              variant='outline'
              className='border-2 border-black'
              onClick={() => handleRedirection()}
              loading={hubspotSyncLoading}
              loadingText={'Syncing...'}
            >
              Sync Leads with HubSpot
            </Button>
          </div> */}
        {/* )} */}
      </div>
      {/* <div className='flex w-full gap-6 p-4'>
        <Table className='w-[578px]'>
          <TableHeader className='bg-[#F3F4F6]'>
            <TableRow>
              <TableHead>Lead name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Email ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analyticsData?.leads?.map((leadData: LeadData, index) =>
              leadData.details.map((detail, detailIndex) => (
                <TableRow key={`${index}-${detailIndex}`}>
                  <TableCell className='font-medium'>{leadData.date}</TableCell>
                  <TableCell className='font-medium'>{detail.name}</TableCell>
                  <TableCell className='font-medium'>{detail.email}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {analyticsData?.leads?.reduce(
          (acc, lead) => acc + lead.details.length,
          0
        ) && (
          <div className='flex flex-col gap-2'>
            <CSVLink data={csvData} filename='leads.csv'>
              <Button variant='outline' className='border-2 border-black'>
                Export as CSV
              </Button>
            </CSVLink>
            <Button
              variant='outline'
              className='border-2 border-black'
              onClick={() => handleRedirection()}
              loading={hubspotSyncLoading}
              loadingText={'Syncing...'}
            >
              Sync Leads with HubSpot
            </Button>
          </div>
        )}
      </div> */}
      <LeadsTable setAnalyticsData={setAnalyticsData} />
    </main>
  )
}

export default ReferralAnalytics
