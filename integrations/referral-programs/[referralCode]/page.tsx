'use client'

import { SetStateAction, useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import HubspotLogo from '@/../public/assets/HubspotLogo.svg'
import { format, subDays, subMonths, subWeeks } from 'date-fns'
import { ArrowLeft, ChevronDown, Plus } from 'lucide-react'
import Pagination from 'rc-pagination'

import {
  fetchconnectedApps,
  getCurrentOrganization,
  PatchIntegrationData
} from '@/lib/db/organization'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { showCustomToast } from '@/components/custom-toast'

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

function LeadsPage() {
  const router = useRouter()
  const params: { referralCode: string } = useParams()
  const searchParams = useSearchParams()
  const appId = searchParams.get('appId')

  const [accessToken, setAccessToken] = useState('')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsDataProps | null>(
    null
  )
  const [position, setPosition] = useState('bottom')
  const [buttonText, setButtonText] = useState('Today')
  const [uniqueImpressions, setUniqueImpressions] = useState(false)
  const [dates, setDates] = useState<{ to: string; from: string }>({
    to: '2024-05-26',
    from: '2024-05-20'
  })
  const [hubspotSyncLoading, sethubspotSyncLoadingLoading] = useState(false)
  // table
  const [perPage, setPerPage] = useState(10)
  const [size, setSize] = useState(perPage)
  const [current, setCurrent] = useState(1)
  const [integrationAppDetals, setIntegrationAppDetails] = useState<any>()

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setAnalyticsData(null)
      const response = await fetch(
        `/api/get-referral-analytics-data?referralCode=${params?.referralCode}&from=${dates.from}&to=${dates.to}&uniqueImpressions=${uniqueImpressions}`,
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
  }, [dates.from, dates.to, params?.referralCode, uniqueImpressions])

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

  const createContact = async (contacts: any): Promise<number | null> => {
    try {
      const response = await fetch('/api/create-hubspot-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          data: contacts,
          hubSpotApiKey: accessToken
        })
      })
      const data = await response.json()
      console.log(`Contact created successfully for email`)
      return data
    } catch (error: unknown) {
      sethubspotSyncLoadingLoading(false)
      console.log(`Unexpected error creating contact for email:`, error)
      return null
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

  const createCompaniesAndContacts = async () => {
    try {
      sethubspotSyncLoadingLoading(true)
      const { id: orgId } = await getCurrentOrganization()
      const companyId = await createCompany(orgId)

      const syncData =
        Array.isArray(analyticsData?.leads) && analyticsData?.leads?.length > 0
          ? analyticsData?.leads.flatMap((lead) =>
              lead.details.map((detail) => ({
                email: detail.email,
                properties: [
                  { property: 'email', value: detail.email },
                  { property: 'firstname', value: detail.name },
                  { property: 'lastname', value: '' }
                ]
              }))
            )
          : []
      if (Array.isArray(syncData) && syncData?.length > 0) {
        const response: any = await createContact(syncData)
        if (response?.success) {
          // setTimeout(async () => {
          // const allContactsAddedRecently = await fetch(
          //   `/api/get-recently-added-hubspot-contacts?count=${syncData?.length}`
          // )
          // const allContactsREsponse = await allContactsAddedRecently?.json()
          // console.log({ allContactsREsponse })
          // console.log({ contacts: allContactsREsponse?.contacts })
          // const bulkAssociates = allContactsREsponse?.contacts?.map(
          //   (contact: any) => ({
          //     fromObjectId: contact?.vid,
          //     toObjectId: companyId,
          //     category: 'HUBSPOT_DEFINED',
          //     definitionId: 1 // 1 is the default definition ID for contact-to-company in HubSpot
          //   })
          // )
          // console.log('bulkAssociates', bulkAssociates)
          // const assData = await associateContactToCompany(bulkAssociates)

          // if (assData?.success) {
          showCustomToast('Success', 'synced successfully', 'success', 5000)
          sethubspotSyncLoadingLoading(false)
          // }
          // }, 3000)
        }
      }
    } catch (error: unknown) {
      sethubspotSyncLoadingLoading(false)
      console.error('Unexpected error integrating with HubSpot:', error)
    }
  }

  const handleSync = async () => {
    if (accessToken) {
      createCompaniesAndContacts()
      return
      try {
        const response = await fetch('/api/zoho-bulk-create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            accessToken,
            contacts: [
              {
                email: 'john.doe@example.com',
                firstName: 'John Doe',
                lastName: 'John Doe'
              },
              {
                email: 'jane.smith@example.com',
                firstName: 'Jane Smith',
                lastName: 'Jane Smith'
              },
              {
                email: 'alice.jones@example.com',
                firstName: 'Alice Jones',
                lastName: 'Alice Jones'
              }
            ]
          })
        })

        const result = await response.json()
        if (response.ok) {
          console.log('Bulk write job created successfully.')
        } else {
          console.log(`Error: ${result.error}`)
        }
      } catch (error: any) {
        console.log(`Error: ${error.message}`)
      }
    }
  }

  const GetHubspotAccessToeken = useCallback(async () => {
    const client_id = process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID
    const clientSecret = process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_SECRET
    const redirectUri = process.env.NEXT_PUBLIC_HUBSPOT_REDIRECTION_URL
    const apps: any = await fetchconnectedApps()
    const keyApp = apps?.find(
      (app: any) => app?.id?.toString() === appId?.toString()
    )
    const code = keyApp?.refreshToken
    setIntegrationAppDetails(keyApp)
    if (code) {
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
            integrationType: keyApp?.integrationType
          }

          const res = await PatchIntegrationData(JSON.stringify(updatePayload))
          console.log('-----HUBSPOT:::Updated:PatchIntegrationData---', res)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }, [appId])

  const GetZohoAccessToeken = useCallback(async () => {
    const apps: any = await fetchconnectedApps()
    const keyApp = apps?.find(
      (app: any) => app?.id?.toString() === appId?.toString()
    )
    const code = keyApp?.refreshToken
    setIntegrationAppDetails(keyApp)
    if (code) {
      try {
        const zohoId =
          (process.env.NEXT_PUBLIC_ZOHO_CLIENT_ID as string)
            ?.trim()
            .replace(/\+/g, '') ?? ''
        const zohoSecret = process.env.NEXT_PUBLIC_ZOHO_CLIENT_SECRET as string
        const redirectZohoUri = process.env
          .NEXT_PUBLIC_ZOHO_REDIRECTION_URL as string
        const payloadData = {
          grant_type: 'refresh_token',
          client_id: zohoId,
          client_secret: zohoSecret as string,
          redirect_uri: redirectZohoUri as string,
          refresh_token: code as string
        }

        const response = await fetch('/api/zoho-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams(payloadData).toString()
        })

        const tokenResponse = await response.json()

        const accessToken = tokenResponse.access_token
        setAccessToken(accessToken)
        if (accessToken) {
          console.log('-----tokenResponse:Token Recieved---')

          const { id } = await getCurrentOrganization()

          const updatePayload = {
            organizationId: id,
            refreshToken: code,
            integrationType: keyApp?.integrationType
          }

          const res = await PatchIntegrationData(JSON.stringify(updatePayload))
          console.log('-----ZOHO:::Updated:PatchIntegrationData---', res)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }, [appId])

  const getAccessTokens = useCallback(async () => {
    const apps: any = await fetchconnectedApps()
    const keyApp = apps?.find(
      (app: any) => app?.id?.toString() === appId?.toString()
    )
    if (keyApp?.integrationType === 'ZOHO') {
      console.log('ZOHO:::::::', { keyApp })
      GetZohoAccessToeken()
    } else if (keyApp?.integrationType === 'HUBSPOT') {
      console.log('HUBSPOTTTTT:::::::', { keyApp })
      GetHubspotAccessToeken()
    }
  }, [GetHubspotAccessToeken, GetZohoAccessToeken, appId])

  useEffect(() => {
    getAccessTokens()
  }, [getAccessTokens])

  useEffect(() => {
    fetchAnalyticsData()
  }, [dates, fetchAnalyticsData, uniqueImpressions])

  const PaginationChange = (page: number, pageSize: number) => {
    setCurrent(page)
    setSize(pageSize)
  }

  const PerPageChange = (value: number) => {
    setSize(value)
    const data =
      analyticsData?.leads &&
      Array.isArray(analyticsData?.leads) &&
      analyticsData?.leads?.length > 0 &&
      Array.isArray(analyticsData?.leads?.flatMap((elem) => elem?.details)) &&
      analyticsData?.leads?.flatMap((elem) => elem?.details)?.length > 0
        ? analyticsData?.leads?.flatMap((elem) => elem?.details)
        : []
    const newPerPage = Math.ceil(data?.length / value)
    if (current > newPerPage) {
      setCurrent(newPerPage)
    }
  }

  const getTableData = (current: number, pageSize: number) => {
    // Normally you should get the data from the server
    const data =
      analyticsData?.leads &&
      Array.isArray(analyticsData?.leads) &&
      analyticsData?.leads?.length > 0 &&
      Array.isArray(analyticsData?.leads?.flatMap((elem) => elem?.details)) &&
      analyticsData?.leads?.flatMap((elem) => elem?.details)?.length > 0
        ? analyticsData?.leads?.flatMap((elem) => elem?.details)
        : []
    if (data?.length > 0) {
      return data.slice((current - 1) * pageSize, current * pageSize)
    }
    return []
  }

  const PrevNextArrow = (current: number, type: any, originalElement: any) => {
    if (type === 'prev') {
      return (
        <button>
          <i className='fa fa-angle-double-left'></i>
        </button>
      )
    }
    if (type === 'next') {
      return (
        <button>
          <i className='fa fa-angle-double-right'></i>
        </button>
      )
    }
    return originalElement
  }

  const handleValueChange = (value: SetStateAction<string>) => {
    setPosition(value)
    let fromDate = ''
    let toDate = format(new Date(), 'yyyy-MM-dd')

    // Calculate the fromDate based on the selected value
    switch (value) {
      case 'today':
        setButtonText('Today')
        fromDate = toDate
        break
      case 'yesterday':
        setButtonText('Yesterday')
        fromDate = format(subDays(new Date(), 1), 'yyyy-MM-dd')
        toDate = fromDate
        break
      case 'lastweek':
        setButtonText('Last week')
        fromDate = format(subWeeks(new Date(), 1), 'yyyy-MM-dd')
        break
      case 'lastmonth':
        setButtonText('Last month')
        fromDate = format(subMonths(new Date(), 1), 'yyyy-MM-dd')
        break
      case 'last3months':
        setButtonText('Last 3 months')
        fromDate = format(subMonths(new Date(), 3), 'yyyy-MM-dd')
        break
      default:
        setButtonText('Select Date')
        break
    }
    setDates({ from: fromDate, to: toDate })
  }

  return (
    <main className='w-full space-y-6 p-8'>
      <Link
        className='flex gap-2 font-medium text-[#0062F1]'
        href='/integrations/referral-programs'
      >
        <ArrowLeft />
        Back to Referral Programs
      </Link>

      <div className='flex w-full flex-col'>
        <div className='flex justify-between'>
          {integrationAppDetals?.integrationType === 'HUBSPOT' ? (
            <Image
              src={HubspotLogo}
              width={150}
              height={50}
              alt='hubspot logo'
            />
          ) : (
            'ZOHO'
          )}
          <div className='flex gap-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='primary' className='gap-10 rounded-lg'>
                  {buttonText}
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56'>
                <DropdownMenuRadioGroup
                  value={position}
                  onValueChange={handleValueChange}
                >
                  <DropdownMenuRadioItem value='today'>
                    Today
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='yesterday'>
                    Yesterday
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='lastweek'>
                    Last week
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='lastmonth'>
                    Last month
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='last3months'>
                    Last 3 months
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className='flex items-center'>
              Unique Impressions:
              <Switch
                className='ml-4'
                checked={uniqueImpressions}
                onChange={(e: any) => setUniqueImpressions(e)}
                onCheckedChange={(e: any) => setUniqueImpressions(e)}
              />
            </div>
            <Button
              variant='primary'
              className='px-6'
              onClick={() => router.push('/partner-programs')}
            >
              <Plus />
              Add leads
            </Button>
            <Button
              variant='primary'
              className='px-6'
              loading={hubspotSyncLoading}
              loadingText={'Syncing...'}
              onClick={() => handleSync()}
              disabled={
                !analyticsData?.leads?.flatMap((elem) => elem?.details)?.length
              }
            >
              <Plus />
              Sync Now (
              {analyticsData?.leads?.flatMap((elem) => elem?.details)?.length})
            </Button>
          </div>
        </div>
        <div className='mt-4 text-center'>
          {analyticsData === null && <span>{`Loading...`}</span>}
          {analyticsData?.leads?.flatMap((elem) => elem?.details)?.length ===
            0 && 'No Leads Found.'}
        </div>
        {analyticsData?.leads &&
          Array.isArray(analyticsData?.leads) &&
          analyticsData?.leads?.length > 0 &&
          Array.isArray(
            analyticsData?.leads?.flatMap((elem) => elem?.details)
          ) &&
          analyticsData?.leads?.flatMap((elem) => elem?.details)?.length >
            0 && (
            <>
              {/* <div className='w-full'>
                <div className='flex items-center gap-4 py-4'>
                  <Input
                    placeholder='Search by Lead name, Email, Phone no.'
                    onChange={(e: any) => setValue(e.target.value)}
                    type='search'
                    value={value}
                    className='max-w-sm'
                  />
                </div>
              </div> */}
              <Pagination
                className='pagination-data py-2'
                showTotal={(total, range) =>
                  `Showing ${range[0]}-${range[1]} of ${total}`
                }
                onChange={PaginationChange}
                total={
                  analyticsData?.leads?.flatMap((elem) => elem?.details)?.length
                }
                current={current}
                pageSize={size}
                showSizeChanger={true}
                itemRender={PrevNextArrow}
                onShowSizeChange={PerPageChange}
              />
              <Table>
                <TableHeader className='bg-[#F3F4F6]'>
                  <TableRow>
                    <TableHead>
                      <Checkbox></Checkbox>
                    </TableHead>
                    <TableHead>Lead name</TableHead>
                    <TableHead>Email ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getTableData(current, size).map((detail, detailIndex) => (
                    <TableRow key={`${detailIndex}`}>
                      <TableCell className='font-medium'>
                        <Checkbox></Checkbox>
                      </TableCell>
                      <TableCell className='font-medium'>
                        {detail.name}
                      </TableCell>
                      <TableCell className='font-medium'>
                        {detail.email}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                className='pagination-data py-2'
                showTotal={(total, range) =>
                  `Showing ${range[0]}-${range[1]} of ${total}`
                }
                onChange={PaginationChange}
                total={
                  analyticsData?.leads?.flatMap((elem) => elem?.details)?.length
                }
                current={current}
                pageSize={size}
                showSizeChanger={true}
                itemRender={PrevNextArrow}
                onShowSizeChange={PerPageChange}
              />
            </>
          )}
      </div>
    </main>
  )
}

export default LeadsPage
