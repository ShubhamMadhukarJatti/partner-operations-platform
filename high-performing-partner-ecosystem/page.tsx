'use client'

import React from 'react'
import dynamicImport from 'next/dynamic'

import { EventVideoAndBriefGlance } from '../_components/EventVideoAndBriefGlance'
import FAQAccordion from '../_components/home-v2/FAQAccordian'
import MeetOurSpeaker from '../_components/MeetOurSpeaker'
import EventScheduleSection from './_components/EventScheduleSection'
import Hero from './_components/Hero'

// Dynamically import EventInsiderForm with SSR disabled to prevent build timeout
const EventInsiderForm = dynamicImport(
  () =>
    import('../event/partner-source-revenue/_components/EventInsiderForm').then(
      (mod) => ({
        default: mod.EventInsiderForm
      })
    ),
  { ssr: false }
)

function HighPerformancePartnerEcosystemPage() {
  return (
    <div className='min-h-screen w-full'>
      <EventInsiderForm />
      <Hero />
      <EventVideoAndBriefGlance
        videoSrc='https://storage.googleapis.com/sharkdom_resources/SharkdomEvents/Building%20high%20performing%20Partner%20Ecosystem.mp4'
        videoPoster='https://storage.googleapis.com/sharkdom_resources/thumbnails/Group%201511077318%20(1)%20(1).png'
      >
        <div>
          <p className='mb-4'>
            This event hosted by Sharkdom discusses &apos;building
            high-performing partner ecosystems&apos;, featuring{' '}
            <strong>Kaushik</strong> and <strong>Alex Richards</strong>, both
            experienced in the partnership domain. The session covers key areas
            such as partner program foundations, important metrics like sourced
            leads and time to closure, and actionable playbooks and frameworks.
          </p>
        </div>

        <div className='rounded-lg bg-purple-50 p-6'>
          <h4 className='mb-3 text-xl font-semibold text-gray-900'>
            Why Alex Richards highlights partnerships as more than LinkedIn
            announcements
          </h4>
          <p className='mb-4'>
            Partnerships are a go-to-market motion—essentially &quot;a company
            within a company.&quot; He stresses the importance of understanding
            internal teams and driving influence to achieve impact.
          </p>
        </div>

        <div className='rounded-lg bg-blue-50 p-6'>
          <h4 className='mb-4 text-xl font-semibold text-gray-900'>
            What more is covered in this event?
          </h4>
          <ul className='ml-6 list-disc space-y-2'>
            <li>
              What are the elements for building a successful and effective
              partner program?
            </li>
            <li>
              How to identify patterns and analyze data from the last two years
              of &quot;closed won&quot; and &quot;closed lost&quot; deals?
            </li>
            <li>
              Why to begin with smaller, impactful partnerships that don&apos;t
              require constant oversight?
            </li>
            <li>
              Why to avoid rigid, hierarchical structures—instead, focus on
              creating a &quot;business intelligence engine&quot;?
            </li>
            <li>
              How to identify opportunity gaps, highlight high-ROI
              opportunities, leverage audience influence, provide expertise and
              accelerate execution?
            </li>
            <li>Fireside Chat with other Partnership Nerds</li>
          </ul>
        </div>

        <div className='rounded-lg border-2 border-gray-900 bg-gray-50 p-6'>
          <p className='text-xl font-bold text-gray-900'>
            Building a high-performing partner ecosystem isn&apos;t about
            activity—it&apos;s about structure, metrics, and the right
            playbooks.
          </p>
        </div>
      </EventVideoAndBriefGlance>

      <MeetOurSpeaker
        title='Meet Our Speakers'
        imageSrc={[
          {
            src: '/events/AlexR.svg',
            linkdirect:
              'https://www.linkedin.com/in/mrpartnerships?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
          },
          {
            src: '/events/KaushikM.svg',
            linkdirect:
              'https://www.linkedin.com/in/kaushikkannanm?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
          }
        ]}
        imageAlt='Meet Our Speaker'
      />
      <EventScheduleSection />
      <FAQAccordion />
    </div>
  )
}

export default HighPerformancePartnerEcosystemPage
