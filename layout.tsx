import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Inter } from 'next/font/google'
import { GoogleTagManager } from '@next/third-parties/google'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'

import 'react-toastify/dist/ReactToastify.css'
import './globals.css'

import { headers } from 'next/headers'
import Script from 'next/script'
// import { getTokens } from 'next-firebase-auth-edge'
import { Toaster } from 'sonner'

import { cn } from '@/lib/utils'
import { RootErrorBoundary } from '@/components/error-boundary/RootErrorBoundary'
// import { AuthProvider } from '@/lib/firebase/auth/client-auth-provider'
// import { mapTokensToUser } from '@/lib/firebase/auth/firebase'
// import { authConfig } from '@/lib/firebase/config/server-config'
import { Providers } from '@/components/providers'
import QueryProvider from '@/components/providers/QueryProvider'

// Heavy components loaded lazily to avoid blocking initial compilation
const GiftStep = dynamic(() => import('./(onboarding)/_components/gift-step'), {
  ssr: false
})
const DynamicToastContainer = dynamic(
  () =>
    import('react-toastify').then((mod) => ({ default: mod.ToastContainer })),
  { ssr: false }
)

const inter = Inter({ subsets: ['latin'] })

/**
 * Cookiebot CMP (auto-blocking). Cookiebot requires this to be the first *script*
 * in <head>. Register every public host (e.g. dev.sharkdom.com) on the same CBID in the manager.
 * @see https://manage.cookiebot.com → Implementation
 */
const COOKIEBOT_CBID =
  process.env.NEXT_PUBLIC_COOKIEBOT_CBID ??
  '249baa0f-2ca3-445c-8bea-bba34a54724a'

export const metadata: Metadata = {
  title: {
    template: '',
    default: 'Sharkdom | Modern day Partner ops Platform'
  },
  keywords: [
    'startup company',
    'tech startups',
    'mou',
    'start ups',
    'start up company',
    'ai startup',
    'partnership management platform',
    'sales enablement',
    'partner ecosystem',
    'sales enablement platform',
    'partner management',
    'channel sales',
    'startup company',
    'startup india',
    'startup business',
    'starting a company',
    'business to start',
    'business entrepreneurship',
    'business making',
    'partnership intelligence',
    'smart partnerships',
    'partnership marketplace',
    'ideal partners',
    'startup marketplace',
    'startup intelligence platform',
    'find right partnership for your platform',
    'automating partnership process',
    'virtual partnership ally',
    'assumptionless partnerships',
    'platform generated mou',
    'ai generated proposals',
    'ai generated partnerships',
    'smart partnership bot',
    'spam proposals',
    'partnerships based on facts',
    'lifelong partnerships'
  ],

  description:
    'Sharkdom is the AI-native partner ops platform for B2B SaaS teams. Handle onboarding deal registration co-sell pipeline and AI partner matching all in one place.',

  alternates: {
    canonical: 'https://www.sharkdom.com/'
  },
  openGraph: {
    url: 'https://www.sharkdom.com',
    locale: 'en_US',
    siteName: 'Sharkdom',
    username: '@sharkdomIndia',

    images: [
      {
        url: 'https://www.sharkdom.com/og-img-small.png',
        width: 1200,
        height: 630,
        alt: 'Sharkdom - Empowering startup partnerships'
      },

      {
        url: 'https://www.sharkdom.com/og-img-small.png',
        width: 1080,
        height: 1080,
        alt: 'Sharkdom - Empowering startup partnerships'
      },
      {
        url: 'https://www.sharkdom.com/og-img-small.png',
        width: 1080,
        height: 1920,
        alt: 'Sharkdom - Empowering startup partnerships'
      },
      {
        url: 'https://www.sharkdom.com/og-img-small.png',
        width: 1024,
        height: 512,
        alt: 'Sharkdom - Empowering startup partnerships'
      }
    ]
  },
  metadataBase: new URL('https://www.sharkdom.com'),
  twitter: {
    card: 'summary_large_image',
    title: {
      template: '%s | Sharkdom',
      default: 'Sharkdom'
    },
    description: 'Empowering startup partnerships',
    site: '@sharkdomIndia',
    creator: '@SharkdomIndia'
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const headersList = headers()
  const host = headersList.get('host') || ''

  // Only load PostHog in production, not on dev.sharkdom.com
  const isProduction =
    process.env.NODE_ENV === 'production' &&
    !host.includes('dev.sharkdom.com') &&
    host !== 'localhost' &&
    !host.includes('localhost:')

  // const tokens = await getTokens(cookieStore, authConfig)
  // const user = tokens ? mapTokensToUser(tokens) : null
  // const token = tokens ? tokens.token : null

  return (
    <html lang='en'>
      <head>
        {/* Exact Cookiebot “Auto blocking” snippet — not next/script, so attrs match dashboard 1:1 */}
        <script
          id='Cookiebot'
          src='https://consent.cookiebot.com/uc.js'
          data-cbid={COOKIEBOT_CBID}
          data-blockingmode='auto'
          type='text/javascript'
        />
        {isProduction && (
          <Script
            id='posthog'
            strategy='afterInteractive'
            dangerouslySetInnerHTML={{
              __html: `
    !function(t,e){var o,n,p,r;e._SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init Re Cs Fs Pe Rs Ms capture Ve calculateEventProperties Ds register register_once register_for_session unregister unregister_for_session zs getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty js As createPersonProfile Ns Is Us opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing Os debug I Ls getPageViewId captureTraceFeedback captureTraceMetric".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e._SV=1)}(document,window.posthog||[]);
    posthog.init('phc_DRg1yQ2S9RSiSUtS8ovJHPvphfVZctYRs2JfRd8f8eg', {
        api_host: 'https://us.i.posthog.com',
        defaults: '2025-05-24',
        person_profiles: 'identified_only',
    })
`
            }}
          />
        )}

        <Script id='gtm-head' strategy='afterInteractive'>
          {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NJRB6WLQ');
        `}
        </Script>
        <Script
          src='https://www.googletagmanager.com/gtag/js?id=G-45RNX9YKF2'
          strategy='afterInteractive'
        />
        {/* Initialize GA4 */}
        <Script id='ga4-init' strategy='afterInteractive'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-45RNX9YKF2');
          `}
        </Script>
      </head>
      <body className={cn(inter.className, 'bg-background text-foreground')}>
        <noscript>
          <iframe
            src='https://www.googletagmanager.com/ns.html?id=GTM-NJRB6WLQ'
            height='0'
            width='0'
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        <Script
          async
          id='hotjar'
          dangerouslySetInnerHTML={{
            __html: `(function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:5138264,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`
          }}
        />

        <Script
          id='schema-all-pages'
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

        <Script
          async
          id='clarity'
          type='text/javascript'
          dangerouslySetInnerHTML={{
            __html: ` (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "lh1m8zow8v");
`
          }}
        />

        {isProduction && (
          <Script
            id='posthog-body'
            strategy='afterInteractive'
            dangerouslySetInnerHTML={{
              __html: `
    !function(t,e){var o,n,p,r;e._SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init Re Cs Fs Pe Rs Ms capture Ve calculateEventProperties Ds register register_once register_for_session unregister unregister_for_session zs getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty js As createPersonProfile Ns Is Us opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing Os debug I Ls getPageViewId captureTraceFeedback captureTraceMetric".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e._SV=1)}(document,window.posthog||[]);
    posthog.init('phc_DRg1yQ2S9RSiSUtS8ovJHPvphfVZctYRs2JfRd8f8eg', {
        api_host: 'https://us.i.posthog.com',
        defaults: '2025-05-24',
        person_profiles: 'identified_only',
    })
`
            }}
          />
        )}

        <Script src='https://accounts.google.com/gsi/client' async defer />
        <Script
          src='https://apis.google.com/js/api.js'
          strategy='beforeInteractive'
        />

        {/* <ReduxProviders> */}

        {/* <AuthProvider serverToken={token} serverUser={user}> */}
        <RootErrorBoundary>
          <QueryProvider>
            <Providers>
              {children}
              <GiftStep />

              <VercelAnalytics />
              <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
            </Providers>
          </QueryProvider>
        </RootErrorBoundary>
        {/* </AuthProvider> */}
        {/* </ReduxProviders> */}
        <Toaster richColors position='top-right' />
        {/* expand visibleToasts={5} */}

        <DynamicToastContainer
          position='bottom-left'
          autoClose={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          theme='light'
        />
      </body>
    </html>
  )
}
