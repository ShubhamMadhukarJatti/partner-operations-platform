import React from 'react'
import dynamic from 'next/dynamic'
import Script from 'next/script'

import FAQAccordion from './_components/home-v2/FAQAccordian'
import Hero from './_components/home-v2/hero'
import HowSharkdomFunctions from './_components/home-v2/HowSharkdomFunctions'
import IntegrationsSection from './_components/home-v2/IntegrationSection'
import KeyCapabilitiesSection from './_components/home-v2/KeyCapabilitiesSection'
import PartnerScaleSection from './_components/home-v2/PartnerScaleSection'
import MarketingAuthPrefetch from './_components/MarketingAuthPrefetch'
import { ScrollReveal } from './_components/ScrollReveal'

const HomeVideoSection = dynamic(
  () => import('./_components/home-v2/HomeVideoSection')
)

const MarketplaceAddon = dynamic(
  () => import('./_components/home-v2/MarketplaceAddon')
)

// const CookieConsent = dynamic(() => import('./_components/cookies'), {
//   ssr: false
// })
const Calculate = dynamic(() => import('./_components/home-v2/Calculate'))
const Calculate2 = dynamic(() => import('./_components/home-v2/Calculate2'))
const EscrowMatrix = dynamic(() => import('./_components/home-v2/EscrowMatrix'))
const Feature = dynamic(() => import('./_components/home-v2/Feature'))
const FooterCta = dynamic(() => import('./_components/home-v2/FooterCta'))
const HeroOld = dynamic(() => import('./_components/home-v2/hero_old'))

const MakeYourBusiness = dynamic(
  () => import('./_components/home-v2/MakeYourBusiness')
)
const Orbit = dynamic(() => import('./_components/home-v2/Orbit'))
const SecureAccountMapping = dynamic(
  () => import('./_components/home-v2/SecureAccountMapping')
)

const StoryTelling = dynamic(() => import('./_components/home-v2/StoryTelling'))

const WhyChooseSharkdom = dynamic(
  () => import('./_components/home-v2/WhyChooseSharkdom')
)

const DemoAdvancedTable = dynamic(
  () => import('./_components/home-v2/DemoAdvancedTable')
)

// Metadata moved to layout.tsx since this is now a client component

const ChatbotWidget = dynamic(() => import('@/components/chat/ChatbotWidget'), {
  ssr: false
})

const LandingPage = () => {
  // No full page loading - just render the page content

  return (
    <main className=''>
      <MarketingAuthPrefetch />
      <Script
        id='avail-code-detection'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const urlParams = new URLSearchParams(window.location.search);
              const availCode = urlParams.get('avail_code');
              if (availCode === 'free_trial') {
                sessionStorage.setItem('avail_code', 'free_trial');
              }
            })();
          `
        }}
      />
      <Script
        id='schema-service-pages'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'WebSite',
            name: 'Sharkdom',
            url: 'https://www.sharkdom.com/',
            potentialAction: {
              '@type': 'SearchAction',
              target: '{search_term_string}',
              'query-input': 'required name=search_term_string'
            }
          })
        }}
      />
      <div className='relative overflow-hidden'>
        <Hero />

        <ScrollReveal>
          <HomeVideoSection />
        </ScrollReveal>

        {/* Add MarketPlaceAddon */}

        {/* <OnboardingCostFull /> */}

        <ScrollReveal className='overflow-visible'>
          <MarketplaceAddon />
        </ScrollReveal>

        {/* Partner Scale Section */}
        <ScrollReveal>
          <PartnerScaleSection />
        </ScrollReveal>

        {/* Key Capabilities Section */}
        <ScrollReveal>
          <KeyCapabilitiesSection />
        </ScrollReveal>

        {/* <ColabrateAndComarket /> */}

        <ScrollReveal>
          <HowSharkdomFunctions />
        </ScrollReveal>

        <ScrollReveal>
          <WhyChooseSharkdom />
        </ScrollReveal>

        <ScrollReveal>
          <MakeYourBusiness />
        </ScrollReveal>

        <ScrollReveal>
          <Calculate2 />
        </ScrollReveal>

        <ScrollReveal>
          <IntegrationsSection />
        </ScrollReveal>

        {/* <Feature /> */}

        {/* <Calculate /> */}

        <ScrollReveal>
          <FAQAccordion />
        </ScrollReveal>

        {/* <SecureAccountMapping /> */}

        {/* <EscrowMatrix /> */}

        {/* <Orbit /> */}

        {/* <FooterCta /> */}

        {/* <CookieConsent /> */}
        <ChatbotWidget />
      </div>
    </main>
  )
}

export default LandingPage
