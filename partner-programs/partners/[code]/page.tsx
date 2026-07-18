'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useGetPartnerDetails } from '@/http-hooks/partner-programs'
import {
  Box,
  Globe,
  Mail,
  MapPin,
  Star,
  StarHalf,
  Star as StarOutline
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/shared/page-header'

import PartnerProgramsSidebar from '../../_components/partner-programs-sidebar'
import ProgramActivePartners from '../../_components/program-active-partners'

type Props = {}
interface StarRatingProps {
  rating: number // e.g., 4.5
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const fullStars = Math.floor(rating) // Get whole number stars
  const hasHalfStar = rating % 1 !== 0 // Check if it has a half-star
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0) // Remaining empty stars

  return (
    <div className='flex gap-[2px] p-0.5 text-[#FDB022]'>
      {/* Full Stars */}
      {Array(fullStars)
        .fill(0)
        .map((_, i) => (
          <Star key={`full-${i}`} fill='currentColor' className='h-4 w-4' />
        ))}

      {/* Half Star */}
      {hasHalfStar && (
        <StarHalf key='half' fill='currentColor' className='h-4 w-4' />
      )}

      {/* Empty Stars */}
      {Array(emptyStars)
        .fill(0)
        .map((_, i) => (
          <StarOutline key={`empty-${i}`} className='h-4 w-4 text-[#F5F5F5]' />
        ))}
    </div>
  )
}

const Container: React.FC<{
  children: React.ReactNode
  title: string
  className?: string
}> = ({ children, title, className }) => {
  return (
    <div
      className={cn(
        'rounded-xl border border-[#E9EAEB] bg-[#F8FBFF]',
        className
      )}
    >
      <h2 className='border-b border-[#E9EAEB] p-4 text-[16px] font-bold text-[#2A3241] '>
        {title}
      </h2>
      <div className='p-4 '>{children}</div>
    </div>
  )
}

const ProgramPartnerDetails = (props: Props) => {
  const params = useParams()
  const code = params.code as string
  const { data } = useGetPartnerDetails(code) as any
  return (
    <div className='flex'>
      <PartnerProgramsSidebar />
      <div>
        <PageHeader
          title={data?.partner?.name}
          customTitle={
            <>
              <p className='text-sm text-text-80 '>
                {data?.partner?.description}
              </p>
            </>
          }
          actionButtons={
            <div className='flex w-max flex-col items-end justify-between gap-2'>
              <Badge className='w-fit border-[#ABEFC6] bg-[#ECFDF3] font-semibold text-[#067647]'>
                {data?.partner.status}
              </Badge>

              <p className='text-[10px] font-normal text-[#7688A8]'>
                Member Since {data?.partner?.memberSince}
              </p>
            </div>
          }
        />

        <div className='p-6'>
          <div className='flex gap-8'>
            <Container
              className={'w-full max-w-[344px]'}
              title={'Partner Information'}
            >
              <div className='flex flex-col gap-4 '>
                <div className='flex items-center gap-2.5 '>
                  <Box stroke='#9CA3AF' size={16} />
                  <div>
                    <p className='text-sm font-normal text-[#535862]'>
                      Industry
                    </p>
                    <p className='text-sm font-semibold lowercase text-[#181D27] first-letter:uppercase'>
                      {data?.partner?.partnerInformation?.industry ?? '-'}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2.5 '>
                  <MapPin stroke='#9CA3AF' size={16} />
                  <div>
                    <p className='text-sm font-normal text-[#535862]'>
                      Location
                    </p>
                    <p className='text-sm font-semibold text-[#181D27]'>
                      {data?.partner?.partnerInformation?.location ?? '-'}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2.5 '>
                  <Globe stroke='#9CA3AF' size={16} />
                  <div>
                    <p className='text-sm font-normal text-[#535862]'>
                      Website
                    </p>
                    <p className='text-sm font-semibold text-[#181D27]'>
                      {data?.partner?.partnerInformation?.website ?? '-'}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2.5 '>
                  <Mail stroke='#9CA3AF' size={16} />
                  <div>
                    <p className='text-sm font-normal text-[#535862]'>Email</p>
                    <p className='text-sm font-semibold text-[#181D27]'>
                      {data?.partner?.partnerInformation?.email ?? '-'}
                    </p>
                  </div>
                </div>
              </div>
            </Container>
            <Container className={'grow'} title={'Performance Overview'}>
              <div className='flex flex-col gap-6'>
                <div className='flex gap-6'>
                  <div className='flex w-full max-w-[150px] flex-col gap-1 rounded-xl border border-[#E9EAEB] bg-white p-4 shadow-sm'>
                    <p className='text-sm font-medium text-[#535862] '>
                      Total Leads
                    </p>
                    <p className='text-[20px] text-[#181D27] '>
                      {data?.partner?.performanceOverview?.totalLeads ?? '-'}
                    </p>
                  </div>
                  <div className='flex grow flex-col gap-1 rounded-xl border border-[#E9EAEB] bg-white p-4 shadow-sm'>
                    <p className='text-sm text-[#535862] '>Revenue Generated</p>
                    <p className='text-[20px] text-[#181D27] '>
                      {data?.partner?.performanceOverview?.revenueGenerate ??
                        '-'}
                    </p>
                  </div>
                </div>
                <div className='flex grow flex-col gap-4 rounded-xl border border-[#E9EAEB] bg-white p-4 shadow-sm'>
                  <div className='flex justify-between'>
                    <p className='text-sm text-[#535862] '>
                      Business Fit Score
                    </p>
                    <span className='text-[20px] font-bold text-[#3E50F7]'>
                      {data?.partner?.performanceOverview?.businessFitScore}%
                    </span>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <div className='h-2 w-full rounded-full bg-[#E9EAEB]'>
                      <div
                        className='h-full rounded-full bg-[#3E50F7]'
                        style={{
                          width: `${data?.partner?.performanceOverview?.businessFitScore}%`
                        }}
                      />
                    </div>

                    <p className='text-xs text-[#4D5C78]'>
                      {data?.partner?.performanceOverview?.businessFitComment}
                    </p>
                  </div>
                </div>
              </div>
            </Container>
          </div>
          <div className='mt-6 flex flex-col gap-4'>
            {data?.partner?.referralPrograms?.map(
              (prog: any, index: number) => {
                return (
                  <Container
                    key={index}
                    className={'bg-white '}
                    title={'Referral Program Participation'}
                  >
                    <div className='flex'>
                      <div className='flex w-full max-w-[374px] flex-col gap-1'>
                        <div className='flex gap-2.5'>
                          <p className='tedxt-[#181D27] text-lg font-bold '>
                            {prog.programName}
                          </p>
                          <Badge className='w-fit border-[#ABEFC6] bg-[#ECFDF3] font-semibold text-[#067647]'>
                            {data?.partner.status}
                          </Badge>
                        </div>
                        <p className='text-sm text-[#7688A8]'>
                          Joined on {prog?.joinedDate}
                        </p>
                      </div>

                      <div className='flex grow items-center gap-6'>
                        <div className=''>
                          <p className='text-sm text-[#7688A8]'>Rating</p>
                          <StarRating rating={prog?.rating} />
                        </div>
                        <div className=''>
                          <p className='text-sm text-[#7688A8]'>Top Comment</p>
                          <p className='text-[#181D27]w-full max-w-[288px] text-xs'>
                            {prog?.topComment}
                          </p>
                        </div>

                        <Button
                          variant={'link'}
                          className='text-sm font-semibold'
                        >
                          Update rating
                        </Button>
                      </div>
                    </div>
                    <div className='mt-6 flex gap-7'>
                      <div className='flex flex-col gap-2'>
                        <p className='text-sm font-semibold text-[#92A0B9]'>
                          Leads
                        </p>
                        <p className='text-base font-semibold text-[#181D27]'>
                          {prog?.metrics?.leads}
                        </p>
                      </div>
                      <div className='flex flex-col gap-2'>
                        <p className='text-sm font-semibold text-[#92A0B9]'>
                          Conversions
                        </p>
                        <p className='text-base font-semibold text-[#181D27]'>
                          {prog?.metrics?.conversions}
                        </p>
                      </div>
                      <div className='flex flex-col gap-2'>
                        <p className='text-sm font-semibold text-[#92A0B9]'>
                          Conversion Rate
                        </p>
                        <p className='text-base font-semibold text-[#181D27]'>
                          {prog?.metrics?.conversionRate}
                        </p>
                      </div>
                    </div>
                  </Container>
                )
              }
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgramPartnerDetails
