'use client'

import React from 'react'
import dynamicImport from 'next/dynamic'

import { EventVideoAndBriefGlance } from '../../_components/EventVideoAndBriefGlance'
import MeetOurSpeaker from '../../_components/MeetOurSpeaker'
import EventScheduleSection from './_components/EventScheduleSection'
import PartnerSourceFAQAccordion from './_components/FAQAccordian'
import Hero from './_components/Hero'

// Dynamically import EventInsiderForm with SSR disabled to prevent build timeout
const EventInsiderForm = dynamicImport(
  () =>
    import('./_components/EventInsiderForm').then((mod) => ({
      default: mod.EventInsiderForm
    })),
  { ssr: false }
)

function PartnerSourceRevenuePage() {
  return (
    <div className='min-h-screen w-full'>
      <EventInsiderForm />
      <Hero />
      <EventVideoAndBriefGlance
        videoSrc='https://storage.googleapis.com/sharkdom_resources/thumbnails/All%20about%20Partner%20Sourced%20Revenue%20x%20Sharkdom.mp4'
        videoPoster='https://storage.googleapis.com/sharkdom_resources/thumbnails/Group%201321314921%20(2)%20(1).png'
        buttonText='Watch Event'
        duration='30 min'
      >
        <div>
          <h3 className='mb-4 text-2xl font-semibold text-gray-900'>
            Why Your Partnerships Look Busy but Don&apos;t Show Up in Revenue
          </h3>
          <p className='mb-4'>Most partnership teams look incredibly active</p>
          <ul className='mb-4 ml-6 list-disc space-y-2'>
            <li>new partners onboarded</li>
            <li>meetings booked</li>
            <li>decks flying everywhere</li>
          </ul>
          <p className='mb-4'>
            Yet when leadership asks, &quot;How much revenue did partnerships
            actually drive?&quot;
          </p>
          <p className='mb-6 font-medium italic'>
            The room suddenly goes quiet.
          </p>
          <p className='mb-4'>
            That was the core problem unpacked in Sharkdom&apos;s latest live
            session with <strong>Kyle</strong> (Ecosystem Revenue Dynamics) and{' '}
            <strong>Snehanshu</strong> (Partnership Consultant).
          </p>
        </div>

        <div className='rounded-lg bg-purple-50 p-6'>
          <h4 className='mb-3 text-xl font-semibold text-gray-900'>
            Kyle summed it up best
          </h4>
          <ul className='ml-6 list-disc space-y-2'>
            <li>
              today&apos;s GTM systems are built for direct sales, not the messy
              reality of ecosystems where up to seven partners can touch a
              single deal.
            </li>
            <li>
              Marketing sees influence, Sales sees ownership, Partners want
              credit, Finance sees risk and RevOps gets a migraine. Without a
              single data thread running from first partner touch to invoice and
              renewal, partner revenue simply disappears from forecasts.
            </li>
          </ul>
        </div>

        <div className='rounded-lg bg-blue-50 p-6'>
          <h4 className='mb-3 text-xl font-semibold text-gray-900'>
            Snehanshu summed up best through some reality check from the field
          </h4>
          <ul className='ml-6 list-disc space-y-2'>
            <li>
              Most companies recruit partners based on enthusiasm, not fit.
            </li>
            <li>
              Without an ideal partner profile and a 30-60-90 day plan, you get
              lots of activity and very little pipeline.
            </li>
          </ul>
          <p className='mt-4 font-medium italic'>
            His favorite test? If you can&apos;t predict your partner&apos;s
            pipeline, you&apos;ll never predict your own.
          </p>
        </div>

        <div className='rounded-lg bg-green-50 p-6'>
          <p className='mb-4 font-semibold text-gray-900'>
            Both agreed on one thing though
          </p>
          <p className='mb-4 italic'>
            &apos;Partnerships don&apos;t fail because of people, it fail
            because of missing structure, misaligned incentives and invisible
            data. Partners need clear onboarding, localized enablement and a way
            to see how they make money. Internally, RevOps needs partner touches
            to show up as revenue evidence, not vibes.&apos;
          </p>
        </div>

        <div className='rounded-lg border-2 border-gray-900 bg-gray-50 p-6'>
          <p className='mb-4'>
            And yes, Sharkdom came up for a reason not as a portal, but as the
            operating layer that connects partners, deals, attribution, and
            forecasting into one coherent system.
          </p>
          <p className='text-xl font-bold text-gray-900'>
            Because in 2025, partnerships aren&apos;t a side channel.
          </p>
          <p className='text-xl font-bold text-gray-900'>
            They&apos;re a revenue channel and revenue deserves infrastructure.
          </p>
        </div>
      </EventVideoAndBriefGlance>

      <MeetOurSpeaker
        title='Meet Our Speakers'
        imageAlt='Meet Our Speaker'
        imageSrc={[
          {
            src: '/events/event_meet3.svg',
            linkdirect: 'https://www.linkedin.com/in/deepak-vadivel'
          },
          {
            src: '/events/event_meet4.svg',
            linkdirect: 'https://www.linkedin.com/in/snehansushekhar'
          },
          {
            src: '/events/event_meet5.svg',
            linkdirect: 'https://www.linkedin.com/in/kyleedmundhayes'
          }
        ]}
      />
      <EventScheduleSection />
      <PartnerSourceFAQAccordion />
    </div>
  )
}

export default PartnerSourceRevenuePage
