import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Sparkles } from 'lucide-react'

interface PurchaseCardProps {
  thumbnail: string
  name: string
  pricePerMonth: string
  priceSuffix?: string
  features: string[]
  learnMoreLink?: string
}

const PurchaseCard = ({
  thumbnail,
  name,
  pricePerMonth,
  priceSuffix,
  features,
  learnMoreLink
}: PurchaseCardProps) => {
  return (
    <div
      className='flex w-full max-w-[450px] flex-col rounded-[24px] bg-white transition-shadow hover:shadow-lg'
      style={{
        boxShadow:
          '0px 0px 0px 0px #0C0C0D12, 0px 1px 2px 0px #0C0C0D12, 0px 4px 8px 0px #0C0C0D12, 0px 8px 16px -2px #0C0C0D12'
      }}
    >
      {/* Thumbnail Image Container with 8px padding */}
      <div className='p-2'>
        <div className='relative h-[280px] w-full overflow-hidden rounded-[24px] bg-gray-50'>
          <Image src={thumbnail} alt={name} fill className='object-cover' />
        </div>
      </div>

      <div className='flex flex-1 flex-col px-6 pb-8 pt-2'>
        {/* Name */}
        <h3 className='mb-2 text-[24px] font-semibold text-[#1B1D21]'>
          {name}
        </h3>

        {/* Price */}
        <div className='mb-6 flex items-baseline gap-1'>
          <span className='text-[32px] font-semibold leading-tight text-[#1B1D21]'>
            {pricePerMonth}
          </span>
          {priceSuffix ? (
            <span className='text-[16px] font-medium text-[#5F6D7E]'>
              {priceSuffix}
            </span>
          ) : null}
        </div>

        {/* Separator */}
        <div className='mb-6 h-px w-full bg-gray-100' />

        {/* Features */}
        <div className='mb-8 flex flex-col gap-3'>
          {features.map((feature, index) => (
            <div key={index} className='flex items-start gap-3'>
              <Sparkles
                className='mt-1 h-4 w-4 shrink-0 text-[#1B1D21]'
                fill='currentColor'
              />
              <span className='text-[16px] leading-normal text-[#1B1D21]'>
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Learn More Link */}
        {learnMoreLink && (
          <Link
            href={learnMoreLink}
            target='_blank'
            className='mt-auto flex items-center gap-2 text-[16px] font-medium text-blue-600 hover:underline'
          >
            <ExternalLink size={20} />
            Learn More
          </Link>
        )}
      </div>
    </div>
  )
}

export default PurchaseCard
