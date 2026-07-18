'use client'

import React from 'react'
import Image from 'next/image'
import { Bell, FileText, Lock, Settings } from 'lucide-react'

import { cn } from '@/lib/utils'
import { GradientLabel } from '@/components/ui/gradient-label'

interface Feature {
  icon: React.ReactNode
  text: string
}

interface FeatureCardProps {
  title: string
  subtitle?: string
  description: string
  features: Feature[]
  imageSrc?: string
  reverse?: boolean
}

const FeatureCard = ({
  title,
  subtitle,
  description,
  features,
  imageSrc,
  reverse = false
}: FeatureCardProps) => {
  return (
    <div className='hover-scale-smooth flex flex-col gap-4 overflow-hidden rounded-[24px] bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:gap-20'>
      {/* Content Side */}
      <div className={cn('flex-1 space-y-8 pl-6', reverse && 'lg:order-2')}>
        <div className='space-y-4'>
          <h3 className='text-3xl font-bold leading-tight text-gray-900 lg:text-4xl'>
            {title}
            {subtitle && (
              <span className='block text-2xl font-semibold opacity-90'>
                {subtitle}
              </span>
            )}
          </h3>
          <p className='text-lg leading-relaxed text-gray-500'>{description}</p>
        </div>

        <div className='space-y-4'>
          {features.map((feature, idx) => (
            <div key={idx} className='flex items-center gap-4'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 text-gray-600 shadow-sm'>
                {feature.icon}
              </div>
              <span className='font-medium text-gray-700'>{feature.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Image Side */}
      <div className={cn('flex-1', reverse && 'lg:order-1')}>
        <div className='relative mx-auto h-[400px] w-full overflow-hidden rounded-[24px] lg:h-[500px] lg:w-[500px]'>
          {imageSrc && (
            <Image src={imageSrc} alt={title} fill className='object-cover' />
          )}
        </div>
      </div>
    </div>
  )
}

const KeyCapabilitiesSection = () => {
  return (
    <section className='bg-[#F9FAFB] py-24'>
      <div className='max-w-8xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mx-auto mb-20 max-w-5xl text-center'>
          <GradientLabel className='mb-6'>KEY CAPABILITIES</GradientLabel>
          <h2 className='mb-6 text-4xl font-semibold leading-tight text-gray-900 lg:text-[60px]'>
            Contract lifecycle Management for Trusted Partner Ecosystem
          </h2>
          <p className='text-lg text-gray-500'>
            Improve your partner program visibility rate by 7x
          </p>
        </div>

        {/* Cards */}
        <div className='mx-auto flex max-w-6xl flex-col gap-[60px]'>
          <FeatureCard
            title='No Manual Workflows needed for adding Contracts'
            description='Simply upload your contract and rest of the fields would be auto-fill and editable'
            features={[
              {
                icon: <FileText size={20} />,
                text: 'Support all type of contracts from TOS to MOU'
              },
              {
                icon: <Settings size={20} />,
                text: 'Customize Table upto your needs'
              }
            ]}
            imageSrc='/assets/partner-mapping/card_1.png'
            reverse={false}
          />

          <FeatureCard
            title='Choose your internal members to have access to contracts'
            description='Restrict accessing of contracts to the leadership via simple steps'
            features={[
              {
                icon: <Lock size={20} />,
                text: 'Only relevant members can see particular contracts'
              },
              {
                icon: <Bell size={20} />,
                text: 'Regular notifying of expiring agreements'
              }
            ]}
            imageSrc='/assets/partner-mapping/card_2.png'
            reverse={true}
          />
        </div>
      </div>
    </section>
  )
}

export default KeyCapabilitiesSection
