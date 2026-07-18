import Image from 'next/image'
import { CircleX } from 'lucide-react'

import { INTEGRATIONS } from '@/lib/constants/integrations'
import { Button } from '@/components/ui/button'
import { CheckIcon } from '@/components/icons/icons'
import PageHeader from '@/components/shared/page-header'

// Main Component
const PersonaIntegrationCards = ({
  setCsvDialogOpen,
  setHubspotDialogOpen,
  setSheetsDialogOpen,
  connectedApps
}: {
  setCsvDialogOpen: (open: boolean) => void
  setHubspotDialogOpen: (open: boolean) => void
  setSheetsDialogOpen: (open: boolean) => void
  connectedApps: Array<string>
}) => {
  const isIntegrationConnected = (integration: string) =>
    connectedApps?.includes(integration)

  const onConnectCb = {
    [INTEGRATIONS.HUBSPOT_OUTREACH]: setHubspotDialogOpen,
    [INTEGRATIONS.GOOGLE_SHEET]: setSheetsDialogOpen,
    [INTEGRATIONS.CSV]: setCsvDialogOpen
  }

  return (
    <div className='flex flex-col '>
      <PageHeader
        title={'Customer Persona'}
        description={'Supercharge your business with data-driven matchmaking'}
      />
      <div className='flex flex-col gap-6 px-8 py-5'>
        <CustomerPersonaBanner />
        <div className='flex flex-col flex-wrap gap-6 lg:flex-row'>
          {integrationCardData.map((card) => (
            <IntegrationCard
              key={card.title}
              card={card}
              isConnected={isIntegrationConnected(card.integrationType)}
              onConnect={() =>
                card.onConnect(onConnectCb[card.integrationType])
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Integration Card Data
const integrationCardData = [
  {
    title: 'HubSpot',
    integrationType: INTEGRATIONS.HUBSPOT_OUTREACH,
    image: '/hubspot.svg',
    connectMethods: [
      'Admin permission in Sharkdom',
      'Credentials for the authenticating user in your CRM'
    ],
    features: [
      { name: 'Completely free to use', available: true },
      { name: 'Sync as often as you’d like', available: true },
      { name: 'Select What fields to sync', available: true }
    ],
    onConnect: (setHubspotDialogOpen: (open: boolean) => void) => {
      setHubspotDialogOpen(true)
    },
    learnMore: 'https://doc.sharkdom.com/setup/customer-persona-hubspot'
  },
  {
    title: 'Google Sheets',
    integrationType: INTEGRATIONS.GOOGLE_SHEET,
    image: '/sheets.svg',
    connectMethods: [
      'Google Sheets URL not in XLSL format',
      'Account & Website Column'
    ],
    features: [
      { name: 'Completely free to use', available: true },
      { name: 'Sync as often as you’d like', available: true },
      { name: 'Select What fields to sync', available: false }
    ],
    onConnect: (setSheetsDialogOpen: (open: boolean) => void) => {
      setSheetsDialogOpen(true)
    },
    learnMore: 'https://doc.sharkdom.com/section/google-sheet-integration'
  },
  {
    title: 'CSV',
    integrationType: INTEGRATIONS.CSV,
    image: '/csv.svg',
    connectMethods: ['Upload CSV file', 'Account & Website Column'],
    features: [
      { name: 'Completely free to use', available: true },
      { name: 'Sync as often as you’d like', available: false },
      { name: 'Select What fields to sync', available: false }
    ],
    onConnect: (setCsvDialogOpen: (open: boolean) => void) => {
      setCsvDialogOpen(true)
    },
    learnMore: 'https://doc.sharkdom.com/setup/customer-persona-upload-csv'
  }
]

// Integration Card Component
const IntegrationCard = ({
  card,
  isConnected,
  onConnect
}: {
  card: (typeof integrationCardData)[0]
  isConnected: boolean
  onConnect: () => void
}) => (
  <div className='flex-grow rounded-xl border border-[#C8CFDC] p-4'>
    <Image src={card.image} alt={card.title} width={57.33} height={57.33} />

    <div className='mt-4'>
      <h3 className='text-shark-base font-bold text-text-100 '>{card.title}</h3>
      <ul className='space-y-2 pt-3'>
        {card.features.map((feature) => (
          <li key={feature.name} className='flex items-center gap-2'>
            {feature.available ? (
              <CheckIcon />
            ) : (
              <CircleX className='h-5 w-5 text-semantic-danger' />
            )}
            <span className='text-shark-sm text-text-80 '>{feature.name}</span>
          </li>
        ))}
      </ul>
    </div>

    <div className='mt-4 flex flex-col items-start'>
      <Button
        onClick={onConnect}
        className={`w-fit  rounded-lg text-sm font-bold ${
          isConnected
            ? 'border  border-text-40 bg-primary bg-white text-[#3E50F7] hover:bg-white '
            : 'bg-[#3E50F7] text-white hover:bg-[#3E50F7] hover:text-white'
        }`}
      >
        {isConnected ? 'View' : 'Connect'}
      </Button>
    </div>
  </div>
)

const CustomerPersonaBanner = () => {
  return (
    <div
      className='rounded-lg border border-[#A1BAF1] px-10 py-5'
      style={{
        background:
          'linear-gradient(95.75deg, #E4F8FF -9.27%, #FFFFFF 51.72%, #E1E1F8 112.7%)'
      }}
    >
      <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
        <div className='flex flex-col items-stretch justify-between gap-7'>
          <h2 className='text-primary-100 text-shark-lg font-bold  text-[#454284]'>
            Add customer persona to improve opportunities by 7x
          </h2>
          <p className=' max-w-xs text-shark-sm text-[#524E8C]'>
            Identify the right opportunity, partners and enhance relationships
            by checking customer segment overlaps.
          </p>
        </div>
        <div className='hidden md:block'>
          <Image
            src='/customer-persona-banner.png'
            alt='Customer Persona'
            width={143}
            height={143}
          />
        </div>
      </div>
    </div>
  )
}

export default PersonaIntegrationCards
