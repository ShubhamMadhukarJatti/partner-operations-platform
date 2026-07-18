'use client'

import React from 'react'
import Image from 'next/image'
import {
  Check,
  Layers,
  Layout,
  Repeat,
  Settings,
  Users,
  Workflow
} from 'lucide-react'

import { cn } from '@/lib/utils'
import VideoPlayer from '@/components/common/VideoPlayer'

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
  videoSrc?: string
  videoPoster?: string
  reverse?: boolean
}

const FeatureCard = ({
  title,
  subtitle,
  description,
  features,
  imageSrc,
  videoSrc,
  videoPoster,
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

      {/* Image/Video Side */}
      <div className={cn('flex-1', reverse && 'lg:order-1')}>
        <div className='relative mx-auto h-[400px] w-full overflow-hidden rounded-[24px] lg:h-[500px] lg:w-[500px]'>
          {videoSrc ? (
            <div className='h-full w-full [&>div>div]:rounded-[24px] [&>div]:!m-0 [&>div]:h-full [&>div]:w-full [&>div]:!max-w-none'>
              <VideoPlayer
                src={videoSrc}
                poster={videoPoster}
                autoPlay={false}
                muted={true}
                loop={false}
                controls={false}
                height={{ base: '400px', md: '500px' }}
                containerMaxWidth='full'
                className='h-full w-full [&>div>div]:h-full [&>div>div]:w-full [&>div]:h-full [&>div]:w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover'
              />
            </div>
          ) : (
            imageSrc && (
              <Image src={imageSrc} alt={title} fill className='object-cover' />
            )
          )}
        </div>
      </div>
    </div>
  )
}

const KeyCapabilitiesSection = () => {
  return (
    <section className='bg-[#F9FAFB] py-24'>
      <div className='mx-auto max-w-8xl px-4 sm:px-6 lg:px-8'>
        {/* Header — matches Partner / Figma treatment */}
        <div className='mx-auto mb-20 max-w-5xl text-center'>
          <div className='mb-6 flex justify-center'>
            <div className='inline-flex rounded-full border border-[#E2D5F3] bg-white px-3 py-1.5 font-jakarta text-xs font-semibold uppercase tracking-[0.06em] text-[#0F172A] shadow-[0px_4px_12px_rgba(0,0,0,0.06)]'>
              KEY CAPABILITIES
            </div>
          </div>
          <h2 className='mb-6 font-jakarta text-4xl font-bold leading-[1.12] tracking-tight lg:text-[60px] lg:leading-[1.08]'>
            <span className='text-[#6366F1]'>Partner, scale and manage</span>
            <br />
            <span className='text-black'>entire partnership ecosystem</span>
          </h2>
          <p className='mx-auto max-w-[600px] font-jakarta text-lg font-normal leading-relaxed text-[#4B5563]'>
            Sharkdom helps you tackle data bottlenecks, streamline analysis, and
            make smarter decisions with ease.
          </p>
        </div>

        {/* Cards */}
        <div className='mx-auto flex max-w-6xl flex-col gap-[60px]'>
          <FeatureCard
            title='Zero-Friction Partner Collaboration'
            subtitle='(No-Login Co-Sell Portal)'
            description='Send partners a live Deal Snapshot Link, no logins, no onboarding, no password hell.'
            features={[
              { icon: <Layout size={20} />, text: 'Submit deals' },
              { icon: <Users size={20} />, text: 'Request updates' },
              { icon: <Repeat size={20} />, text: 'View CRM-synced progress' }
            ]}
            imageSrc='/assets/home/key_capabilities/card_1.png'
            videoSrc='https://storage.googleapis.com/sharkdom_resources/Zero%20friction%20partner%20collab.mp4'
            videoPoster='/landing/zero-friction-collaboration.webp'
            reverse={false}
          />

          <FeatureCard
            title='Dual-Motion Automation Engine in One Workflow'
            subtitle='(Co-Sell + Resell)'
            description='Every PRM forces you to pick either co-selling or reselling. Sharkdom is the only platform that automates both motions natively:'
            features={[
              { icon: <Workflow size={20} />, text: 'License allocation' },
              { icon: <Repeat size={20} />, text: 'Renewal workflows' },
              {
                icon: <Settings size={20} />,
                text: 'Reseller-led deal registration'
              },
              { icon: <Check size={20} />, text: 'Progress sync from CRM' }
            ]}
            videoSrc='https://storage.googleapis.com/sharkdom_resources/Dual%20motion.mp4'
            videoPoster='/landing/Dual-motion-thumb.webp'
            reverse={true}
          />

          <FeatureCard
            title='Intelligent automation Workflow Engine'
            description='Automate repetitive tasks, optimize workflows, and boost productivity with smart, AI-powered automation capabilities.'
            features={[
              {
                icon: <Settings size={20} />,
                text: 'Streamlined Workflow Automation'
              },
              {
                icon: <Check size={20} />,
                text: 'Efficient Task Optimization'
              },
              { icon: <Workflow size={20} />, text: 'Smart Trigger Functions' }
            ]}
            videoSrc='https://storage.googleapis.com/sharkdom_resources/Intelligent%20workflow.mp4'
            videoPoster='/landing/Intelligent-workflow.webp'
            reverse={false}
          />

          <FeatureCard
            title='Seamless Integrations'
            description='Leverage intelligent analytics to uncover hidden patterns, predict future trends, and make data-driven decisions with confidence.'
            features={[
              {
                icon: <Layers size={20} />,
                text: 'Sync outside and inside sharkdom'
              },
              { icon: <Workflow size={20} />, text: '20+ integrations' },
              {
                icon: <Settings size={20} />,
                text: 'Predictive Integration based on region'
              }
            ]}
            videoSrc='https://storage.googleapis.com/sharkdom_resources/Seamless%20Integration.mp4'
            videoPoster='/landing/Seamless-Integration.webp'
            reverse={true}
          />
        </div>
      </div>
    </section>
  )
}

export default KeyCapabilitiesSection
