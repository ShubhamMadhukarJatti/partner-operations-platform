import React from 'react'
import { ArrowRight, FileText } from 'lucide-react'

type SummaryWidgetProps = {
  totalRecords: string | number
  topIndustry: string
  topIndustryPercentage: string | number
  topSegment: string
  topSegmentPercentage: string | number
}

export default function SummaryWidget({
  totalRecords,
  topIndustry,
  topIndustryPercentage,
  topSegment,
  topSegmentPercentage
}: SummaryWidgetProps) {
  // Helper to render B2B as B -> B, B2C as B -> C, etc.
  const renderSegment = (segment: string) => {
    if (segment.toUpperCase() === 'B2B' || segment.toUpperCase() === 'B2C') {
      const first = segment.charAt(0).toUpperCase()
      const last = segment.charAt(2).toUpperCase()
      return (
        <div className='flex items-center gap-1'>
          <span className='text-[24px] font-medium text-[#101828]'>
            {first}
          </span>
          <ArrowRight className='h-4 w-4 text-[#C4CDD5]' />
          <span className='text-[24px] font-medium text-[#101828]'>{last}</span>
        </div>
      )
    }
    return (
      <span className='text-[24px] font-medium text-[#101828]'>{segment}</span>
    )
  }

  return (
    <div className='flex w-full flex-col items-start justify-start gap-4 rounded-2xl border border-[#F3F4F6] bg-white p-6 shadow-sm'>
      <div className='flex w-full items-center justify-start'>
        <h2 className='text-[16px] font-semibold leading-6 text-[#393939]'>
          Summary
        </h2>
      </div>
      <div className='flex w-full items-start justify-start gap-4'>
        {/* Total Records Card */}
        <div className='flex flex-1 flex-col items-start justify-center gap-8 rounded-2xl border border-[#F3F4F6] p-4'>
          <div className='relative flex h-6 w-6 items-center justify-center text-[#6863FB]'>
            <FileText className='h-5 w-5' />
          </div>
          <div className='flex flex-col items-start justify-start gap-1'>
            <span className='text-[12px] font-normal leading-[18px] text-[#6A7282]'>
              Total Records
            </span>
            <span className='text-[24px] font-medium text-[#101828]'>
              {totalRecords}
            </span>
          </div>
        </div>

        {/* Top Customer Industry Card */}
        <div className='flex flex-1 flex-col items-start justify-center gap-8 rounded-2xl border border-[#F3F4F6] p-4'>
          <div className='relative flex h-6 w-6 items-center justify-center text-[#6863FB]'>
            <FileText className='h-5 w-5' />
          </div>
          <div className='flex w-full flex-col items-start justify-start gap-1'>
            <span className='text-[12px] font-normal leading-[18px] text-[#6A7282]'>
              Top Customer Industry
            </span>
            <div className='flex w-full items-end justify-between'>
              <span className='text-[24px] font-medium text-[#101828]'>
                {topIndustry}
              </span>
              <div className='flex items-center justify-center rounded-full bg-[#F0F9FF] px-2 py-0.5 mix-blend-multiply'>
                <span className='text-[12px] font-medium leading-[18px] text-[#026AA2]'>
                  {topIndustryPercentage}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Customer Segment Card */}
        <div className='flex flex-1 flex-col items-start justify-center gap-8 rounded-2xl border border-[#F3F4F6] p-4'>
          <div className='relative flex h-6 w-6 items-center justify-center text-[#6863FB]'>
            <FileText className='h-5 w-5' />
          </div>
          <div className='flex w-full flex-col items-start justify-start gap-1'>
            <span className='text-[12px] font-normal leading-[18px] text-[#6A7282]'>
              Top Customer Segment
            </span>
            <div className='flex w-full items-end justify-between'>
              {renderSegment(topSegment)}
              <div className='flex items-center justify-center rounded-full bg-[#F0F9FF] px-2 py-0.5 mix-blend-multiply'>
                <span className='text-[12px] font-medium leading-[18px] text-[#026AA2]'>
                  {topSegmentPercentage}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
