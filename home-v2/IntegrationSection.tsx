// IntegrationsSection.jsx
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import HubspotIcon from '@/../public/icons/hubspto.svg'
import IntegrationBackground from '@/../public/icons/integration-bg.svg'
import MailChimpIcon from '@/../public/icons/mailchilp.svg'
import NotionIcon from '@/../public/icons/notio.svg'
import SalesForceIcon from '@/../public/icons/salesforce.svg'
import SlackIcon from '@/../public/icons/slack-image.svg'
import TrelloIcon from '@/../public/icons/trello.svg'
import ZohoSignIcon from '@/../public/icons/zoho.svg'
import ZohoCrmIcon from '@/../public/icons/zohocrm.svg'

const integrationCards = [
  {
    id: 1,
    name: 'Trello',
    description: 'Sync GTM checklist with your partners',
    category: 'Productivity Tool',
    icon: TrelloIcon
  },
  {
    id: 2,
    name: 'Mailchimp',
    description: 'Create co-marketing email campaign with partners',
    category: 'Marketing Automation',
    icon: MailChimpIcon
  },
  {
    id: 3,
    name: 'Slack',
    description: 'Receive deal alerts and much more',
    category: 'Collaboration Tool',
    icon: SlackIcon
  },
  {
    id: 4,
    name: 'HubSpot',
    description: 'Sync your data in and out of the platform',
    category: 'CRM Tool',
    icon: HubspotIcon
  },
  {
    id: 5,
    name: 'Notion',
    description: 'Manage your task & project at one place',
    category: 'Productivity Tool',
    icon: NotionIcon
  },
  {
    id: 6,
    name: 'Zoho Sign',
    description: 'Sign NDA, SLA with your partners',
    category: 'Signing Tool',
    icon: ZohoSignIcon
  },
  {
    id: 7,
    name: 'Salesforce',
    description: 'Sync your data in and out of the platform',
    category: 'CRM Tool',
    icon: SalesForceIcon
  },
  {
    id: 8,
    name: 'Zoho CRM',
    description: 'Sync your data in and out of the platform',
    category: 'CRM Tool',
    icon: ZohoCrmIcon
  }
]

export default function IntegrationsSectionFullBg() {
  return (
    <section className='relative z-10 w-full overflow-hidden py-6 '>
      {/* Background SVG */}

      {/* Background wrapper with controlled responsive height */}
      <div
        className='relative w-full rounded-t-2xl bg-cover bg-center bg-no-repeat'
        style={{ backgroundImage: "url('/icons/integration-bg.svg')" }}
      >
        {/* Foreground Content */}
        <div className='relative z-10 mx-auto max-w-8xl bg-[#F3F3FA]  p-6 md:bg-transparent'>
          {/* Heading */}
          <div className='mb-10 pt-10 text-center'>
            <p className='text-3xl font-medium text-[#111827] lg:text-4xl'>
              Effortless app integration <br />
              with Sharkdom
            </p>
            <div className='mt-4'>
              <Link href='/integration'>
                <button className='inline-flex items-center rounded-full bg-[#726EE3] px-5 py-2.5 text-base font-medium text-white shadow hover:bg-[#6B63FB]'>
                  View Integrations
                </button>
              </Link>
            </div>
          </div>

          <div className='mt-6 w-full overflow-hidden lg:mt-12'>
            <div
              className='flex gap-6 sm:gap-10'
              style={{
                width: 'max-content',
                animation: 'seamlessScroll 40s linear infinite'
              }}
            >
              {/* Render logos multiple times for continuous effect */}
              {Array.from({ length: 8 }).map((_, setIndex) => (
                <React.Fragment key={setIndex}>
                  {integrationCards.map((card) => (
                    <div
                      key={card.id}
                      className='hover-scale-smooth flex w-64 flex-col justify-between rounded-2xl p-5'
                      style={{
                        background: '#FFF'
                        // boxShadow: '0 4px 14.2px 0 rgba(171, 169, 224, 0.50)'
                      }}
                    >
                      <div className='mb-3 flex items-center gap-2'>
                        <Image
                          src={card.icon}
                          alt={card.name}
                          width={120}
                          height={120}
                        />
                      </div>

                      <p className='mb-4 text-sm font-semibold text-[#1B1D21]'>
                        {card.description}
                      </p>
                      <Link href='/integration'>
                        <div className='flex items-center justify-center gap-2 text-sm'>
                          <span className='text-sm font-semibold text-[#1B1D21]'>
                            {card.category}
                          </span>
                          <span className='cursor-pointer font-bold text-[#1B1D21]'>
                            →
                          </span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className='mt-8 w-full overflow-hidden sm:mt-12'>
            <div
              className='flex gap-6 sm:gap-10'
              style={{
                width: 'max-content',
                animation: 'seamlessScroll 30s linear infinite reverse' // <-- reversed direction
              }}
            >
              {/* Render logos multiple times for continuous effect */}
              {Array.from({ length: 8 }).map((_, setIndex) => (
                <React.Fragment key={setIndex}>
                  {integrationCards.map((card) => (
                    <div
                      key={card.id}
                      className='hover-scale-smooth flex w-64 flex-col justify-between rounded-2xl p-5'
                      style={{
                        background: '#FFF',
                        boxShadow: '0 4px 14.2px 0 rgba(171, 169, 224, 0.50)'
                      }}
                    >
                      <div className='mb-3 flex items-center gap-2'>
                        <Image
                          src={card.icon}
                          alt={card.name}
                          width={120}
                          height={120}
                        />
                      </div>

                      <p className='mb-4 text-sm font-semibold text-[#1B1D21]'>
                        {card.description}
                      </p>

                      <div className='flex items-center justify-center gap-2 text-sm'>
                        <span className='text-sm font-semibold text-[#1B1D21]'>
                          {card.category}
                        </span>
                        <span className='cursor-pointer font-bold text-[#1B1D21]'>
                          →
                        </span>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>

            {/* Add these keyframes once (inline here for convenience).
      If you already have them globally, remove this block. */}
            {/* <style jsx>{`
            @keyframes seamlessScroll {
              from {
                transform: translateX(0);
              }
              to {
                transform: translateX(-50%);
              }
            }
          `}</style> */}
          </div>
        </div>
      </div>
    </section>
  )
}
