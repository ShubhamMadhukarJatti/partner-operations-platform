'use client'

import React from 'react'
import Image from 'next/image'
import { IconChartPie } from '@tabler/icons-react'
import { CheckCheck, Tv, Unplug } from 'lucide-react'

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
  imageClassName?: string
}

const FeatureCard = ({
  title,
  subtitle,
  description,
  features,
  imageSrc,
  imageClassName,
  reverse = false
}: FeatureCardProps) => {
  return (
    <div className='hover-scale-smooth flex flex-col gap-4 overflow-hidden rounded-[24px] bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:gap-20'>
      {/* Content Side */}
      <div className={cn('flex-1 space-y-8 pl-6', reverse && 'lg:order-2')}>
        <div className='space-y-4'>
          <h3 className='text-3xl font-semibold leading-tight text-gray-900 lg:text-4xl'>
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
            <Image
              src={imageSrc}
              alt={title}
              fill
              className={imageClassName || 'object-cover'}
            />
          )}
        </div>
      </div>
    </div>
  )
}

const KeyCapabilitiesSection = () => {
  return (
    <section className='bg-[var(--background-default)] py-24'>
      <div className='max-w-8xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mx-auto mb-20 text-center'>
          <GradientLabel className='mb-6'>KEY CAPABILITIES</GradientLabel>
          <h2 className='mb-6 text-4xl font-medium leading-[66px] text-gray-900 lg:text-[60px]'>
            Partner training for Partner led-Growth
          </h2>
          <p className='text-lg text-gray-500'>
            Improve your partner program visibility rate by 7x
          </p>
        </div>

        {/* Cards */}
        <div className='mx-auto flex max-w-6xl flex-col gap-[60px]'>
          <FeatureCard
            title='Partner Training Snapshot'
            description='Completion status and readiness at a glance, pot stalled partners and trigger targeted interventions to shorten time-to-first-deal.'
            features={[
              {
                icon: <Unplug size={20} />,
                text: 'Map your training workflow with various partner workflows'
              },
              {
                icon: <CheckCheck size={20} />,
                text: 'Keep versioning of your courses maintained'
              }
            ]}
            imageSrc='/assets/partner-training/card_1.png'
            imageClassName='object-fill'
            reverse={false}
          />

          <FeatureCard
            title='From Course Metadata to Visibility to Certification Mapping'
            description='Surface course details, public visibility settings and earned certificates so leadership can connect enablement activities to activation outcome'
            features={[
              {
                icon: <Tv className='rotate-180' size={20} />,
                text: 'Keep all metrics regarding partner actions'
              },
              {
                icon: <IconChartPie size={20} />,
                text: 'Assign partners based on course completion'
              }
            ]}
            imageSrc='/assets/partner-training/card_2.png'
            imageClassName='object-fill'
            reverse={true}
          />
        </div>
      </div>
    </section>
  )
}

export default KeyCapabilitiesSection
