'use client'

import React from 'react'
import dynamicImport from 'next/dynamic'

import { EventVideoAndBriefGlance } from '../../_components/EventVideoAndBriefGlance'
import FAQAccordion from '../../_components/home-v2/FAQAccordian'
import MeetOurSpeaker from '../../_components/MeetOurSpeaker'
import EventScheduleSection from './_components/EventScheduleSection'
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
        videoSrc='https://storage.googleapis.com/sharkdom_resources/dashboard_play/How%20to%20avoid%20Partnership%20stalling%20after%20Early%20Wins%20Ft.%20Justin%20Z..mp4'
        videoPoster='https://storage.googleapis.com/sharkdom_resources/videos/Group%201511077292we.png'
      >
        <div>
          <h3 className='mb-4 text-2xl font-semibold text-gray-900'>
            The Illusion of Early Partner Success
          </h3>
          <p className='mb-4'>
            Most companies start partnerships opportunistically:
          </p>
          <ul className='mb-4 ml-6 list-disc space-y-2'>
            <li>A friendly company at a similar stage</li>
            <li>A joint webinar or blog</li>
            <li>A few leads that convert</li>
          </ul>
          <p className='mb-4'>And it works initially.</p>
          <p className='mb-4'>
            But as Justin Zimmerman (Founder, Partner Playbooks) explained,
            early wins don&apos;t mean you&apos;ve built a system. They only
            prove that a partner can work, not that partnerships will scale.
          </p>
          <p className='mb-4'>This is where many teams get stuck:</p>
          <ul className='mb-6 ml-6 list-disc space-y-2'>
            <li>Activity looks high</li>
            <li>Revenue predictability stays low</li>
            <li>Forecasting becomes guesswork</li>
          </ul>
          <p className='font-medium italic'>
            The mistake? Treating partnerships as a campaign instead of a
            motion.
          </p>
        </div>

        <div className='rounded-lg bg-purple-50 p-6'>
          <h4 className='mb-3 text-xl font-semibold text-gray-900'>
            Partnerships Are Not a Side Channel—They&apos;re an Ops Problem
          </h4>
          <p className='mb-4'>
            One of the strongest themes from the discussion was this:
          </p>
          <p className='mb-4'>
            Partnerships don&apos;t fail because of bad partners.
            <br />
            They fail because of missing operations.
          </p>
          <p className='mb-4'>
            As partner programs mature, they stop being just a partnerships
            problem and become:
          </p>
          <ul className='mb-4 ml-6 list-disc space-y-2'>
            <li>Partner Ops</li>
            <li>Marketing Ops</li>
            <li>Sales Ops</li>
            <li>RevOps</li>
          </ul>
          <p className='mb-4'>Without this cross-functional ownership:</p>
          <ul className='ml-6 list-disc space-y-2'>
            <li>Leads are tracked, but not revenue</li>
            <li>Meetings happen, but pipelines don&apos;t move</li>
            <li>Partners stay &quot;active&quot; but unproductive</li>
          </ul>
          <p className='mt-4 font-medium italic'>
            In short, activity replaces accountability.
          </p>
        </div>

        <div className='rounded-lg bg-blue-50 p-6'>
          <h4 className='mb-3 text-xl font-semibold text-gray-900'>
            Data Is the Golden Thread
          </h4>
          <p className='mb-4'>
            A recurring idea throughout the session was simple but
            uncomfortable:
          </p>
          <p className='mb-4 font-medium italic'>
            If it&apos;s not in the CRM, it doesn&apos;t exist.
          </p>
          <p className='mb-4'>Many companies rely on:</p>
          <ul className='mb-4 ml-6 list-disc space-y-2'>
            <li>Spreadsheets</li>
            <li>Slack updates</li>
            <li>Anecdotal partner feedback</li>
          </ul>
          <p className='mb-4'>
            This creates perceived momentum, not measurable growth.
          </p>
          <p className='mb-4'>To reach repeatability, partner teams need:</p>
          <ul className='ml-6 list-disc space-y-2'>
            <li>Partner-sourced and partner-influenced pipeline tracking</li>
            <li>Evidence-based forecasting (not optimism)</li>
            <li>Clear attribution rules</li>
          </ul>
          <p className='mt-4'>
            Only then can partnerships be included confidently in revenue
            forecasts.
          </p>
        </div>

        <div className='rounded-lg bg-green-50 p-6'>
          <h4 className='mb-3 text-xl font-semibold text-gray-900'>
            Not All Partners Are Equal—Stop Treating Them That Way
          </h4>
          <p className='mb-4'>
            Another key insight: partner segmentation is non-negotiable.
          </p>
          <p className='mb-4'>
            Every partner program should clearly distinguish between:
          </p>
          <ul className='mb-4 ml-6 list-disc space-y-2'>
            <li>Partners who can drive revenue now</li>
            <li>Partners who need long-term nurturing</li>
            <li>Partners who should be deprioritized</li>
          </ul>
          <p className='mb-4'>Segmentation can be based on:</p>
          <ul className='mb-4 ml-6 list-disc space-y-2'>
            <li>Market overlap</li>
            <li>Time zone and regional presence</li>
            <li>Sales maturity</li>
            <li>Speed to first deal</li>
          </ul>
          <p className='font-medium italic'>
            Treating every partner equally is one of the fastest ways to burn
            time and trust.
          </p>
        </div>

        <div className='rounded-lg bg-amber-50 p-6'>
          <h4 className='mb-3 text-xl font-semibold text-gray-900'>
            Repeatability Comes From Playbooks, Not Luck
          </h4>
          <p className='mb-4'>
            Justin highlighted that repeatable partner revenue doesn&apos;t come
            from &quot;finding better partners&quot;—it comes from building
            repeatable playbooks.
          </p>
          <p className='mb-4'>
            Much like software development follows a lifecycle, partnerships
            need:
          </p>
          <ul className='mb-4 ml-6 list-disc space-y-2'>
            <li>Clear onboarding stages</li>
            <li>Defined 30 / 60 / 90-day goals</li>
            <li>Enablement content tied to outcomes</li>
            <li>Measurable success criteria</li>
          </ul>
          <p className='mb-4'>This is especially critical for:</p>
          <ul className='mb-4 ml-6 list-disc space-y-2'>
            <li>Product-Led Growth (PLG) motions</li>
            <li>Mid-market vs enterprise pricing</li>
            <li>Long-cycle partner deals</li>
          </ul>
          <p className='font-medium italic'>
            Different motions require different playbooks—there is no
            one-size-fits-all partner strategy.
          </p>
        </div>

        <div className='rounded-lg bg-rose-50 p-6'>
          <h4 className='mb-3 text-xl font-semibold text-gray-900'>
            The Biggest Mistake: Chasing Big Logos Too Early
          </h4>
          <p className='mb-4'>
            One of the most practical warnings from the session:
          </p>
          <p className='mb-4 font-medium italic'>
            Don&apos;t go after the biggest, baddest partners too early.
          </p>
          <p className='mb-4'>Large partners:</p>
          <ul className='mb-4 ml-6 list-disc space-y-2'>
            <li>Move slowly</li>
            <li>Require mature enablement</li>
            <li>Expect proof, not promises</li>
          </ul>
          <p className='mb-4'>
            Early-stage companies often burn credibility by approaching large
            partners without:
          </p>
          <ul className='mb-4 ml-6 list-disc space-y-2'>
            <li>Internal alignment</li>
            <li>Proven smaller wins</li>
            <li>Clear partner value propositions</li>
          </ul>
          <p className='mb-4'>The smarter path:</p>
          <ul className='ml-6 list-disc space-y-2'>
            <li>Win with peers</li>
            <li>Prove repeatability</li>
            <li>Scale upmarket with confidence</li>
          </ul>
        </div>

        <div className='rounded-lg border-2 border-gray-900 bg-gray-50 p-6'>
          <h4 className='mb-4 text-xl font-semibold text-gray-900'>
            Final Takeaway: Partnerships Scale When Systems Do
          </h4>
          <p className='mb-4'>The webinar made one thing clear:</p>
          <p className='mb-4 font-medium italic'>
            Partnerships don&apos;t scale because of enthusiasm.
            <br />
            They scale because of structure, data, and ownership.
          </p>
          <p className='mb-4'>Early wins are just signals.</p>
          <p className='mb-4'>Repeatable revenue requires:</p>
          <ul className='mb-4 ml-6 list-disc space-y-2'>
            <li>Operational rigor</li>
            <li>Cross-functional buy-in</li>
            <li>Evidence-based forecasting</li>
            <li>Playbooks built for the right growth motion</li>
          </ul>
          <p className='text-lg font-semibold text-gray-900'>
            If partnerships feel promising but unpredictable, the problem
            isn&apos;t the channel—it&apos;s the system behind it.
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
            src: '/events/Justin_Zimmer.png',
            linkdirect: '#'
          }
        ]}
      />
      <EventScheduleSection />
      <FAQAccordion />
    </div>
  )
}

export default PartnerSourceRevenuePage
