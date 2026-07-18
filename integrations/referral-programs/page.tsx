'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { OrganizationType } from '@/types'
import { format } from 'date-fns'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { getCurrentOrganization } from '@/lib/db/organization'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { showCustomToast } from '@/components/custom-toast'

function getTimeString(date: string) {
  const now = new Date().getTime()
  const notificationTime = new Date(date).getTime()
  const diff = now - notificationTime

  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) {
    return seconds === 1 ? '1 sec ago' : `${seconds} secs ago`
  }

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return minutes === 1 ? '1 min ago' : `${minutes} mins ago`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return hours === 1 ? '1 hr ago' : `${hours} hrs ago`
  }

  const days = Math.floor(hours / 24)
  if (days < 30) {
    // Approximate 1 month as 30 days
    return days === 1 ? '1 day ago' : `${days} days ago`
  }

  const months = Math.floor(days / 30)
  if (months < 12) {
    return months === 1 ? '1 month ago' : `${months} months ago`
  }

  const years = Math.floor(months / 12)
  return years === 1 ? '1 year ago' : `${years} years ago`
}

function ReferralPrograms() {
  const router = useRouter()
  const [referralCampaign, setReferraCampaigns] = useState<any[] | null>(null)
  const searchParams = useSearchParams()
  const appId = searchParams.get('appId')
  const [organizationData, setOrganizationData] =
    useState<OrganizationType | null>(null)

  const fetchCampaigns = async () => {
    if (!organizationData || !organizationData?.id) {
      showCustomToast('Error', 'org not found', 'error', 5000)
      return
    }
    try {
      const response = await fetch(
        `/api/get-referral-campaigns?organizationId=${organizationData.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        showCustomToast('Error', 'Failed to get campaigns', 'error', 5000)
        return
      }

      const data = await response.json()
      // const filteredReferralData = data?.filter(
      //   (refData: any) => refData?.partnerId
      // ) as any[]
      // const tempData =
      //   Array.isArray(filteredReferralData) && filteredReferralData?.length > 0
      //     ? filteredReferralData
      //     : []
      setReferraCampaigns(data)
      // showCustomToast('Success', 'Referral link generated successfully', 'success', 5000)
    } catch (error) {
      console.error(error)
      showCustomToast('Error', 'Failed to get campaigns', 'error', 5000)
    }
  }

  useEffect(() => {
    const fetchOrg = async () => {
      const organizationData = await getCurrentOrganization()
      setOrganizationData(organizationData)
    }
    fetchOrg()
  }, [])

  useEffect(() => {
    if (organizationData && organizationData?.id) {
      fetchCampaigns()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationData])

  return (
    <main className='w-full space-y-6 p-8'>
      <Link
        className='flex gap-2 font-medium text-[#0062F1]'
        href='/integrations'
      >
        <ArrowLeft />
        Back to integration
      </Link>

      <div className='flex justify-between'>
        <h1 className='text-2xl font-medium'>
          Select referral program to sync
        </h1>
        {/* <Button
          className='px-6'
          onClick={() => router.push('/integrations/referral-programs/leads')}
        >
          Sync leads
        </Button> */}
      </div>

      <div className='flex gap-6'>
        {referralCampaign === null && <span>{`Loading...`}</span>}
        {referralCampaign?.length === 0 && (
          <div className='flex h-full min-h-[80vh] flex-col items-center justify-center gap-4'>
            <Image
              src={'/assets/integrations.png'}
              width={505}
              height={337}
              alt='integrations-vector'
            />
            <p>send referral to get leads...</p>
            <Button
              variant='primary'
              className='font-medium'
              size='sm'
              onClick={() => router.push('/partner-programs')}
            >
              {'Check partner programs'}{' '}
              <ArrowRight className='ml-1 h-4 w-4 ' />
            </Button>
          </div>
        )}
        {Array.isArray(referralCampaign) && referralCampaign?.length > 0 && (
          <Table className=''>
            <TableHeader className='bg-[#F3F4F6]'>
              <TableRow>
                {/* <TableHead>
                <Checkbox></Checkbox>
              </TableHead> */}
                <TableHead>Partner</TableHead>
                <TableHead>Last synced on</TableHead>
                <TableHead>Created on</TableHead>
                {/* <TableHead>Total leads</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {referralCampaign?.map((card: any, index: number) => (
                <TableRow
                  key={index}
                  className='cursor-pointer'
                  onClick={() =>
                    router.push(
                      `/integrations/referral-programs/${card?.referralCode}?appId=${appId}`
                    )
                  }
                >
                  {/* <TableCell className='font-medium'>
                    <Checkbox></Checkbox>
                  </TableCell> */}
                  <TableCell className='font-medium'>
                    {card?.partnerOrganizationName ||
                      `Partner Program ${index}`}
                  </TableCell>
                  <TableCell className='font-medium'>
                    {getTimeString(card?.lastUpdatedTimestamp)}
                  </TableCell>
                  <TableCell className='font-medium'>
                    {card?.creationTimestamp
                      ? format(new Date(card?.creationTimestamp), 'dd-MM-yyyy')
                      : 'NA'}
                  </TableCell>
                  {/* <TableCell className='font-medium'>240</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </main>
  )
}

export default ReferralPrograms
