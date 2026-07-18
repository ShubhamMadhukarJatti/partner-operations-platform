import Image from 'next/image'
import { useRouter } from 'next/navigation'

import AppIcon from '@/components/ui/app-icon'
import { Button } from '@/components/ui/button'
import { showCustomToast } from '@/components/custom-toast'

import type { AppType } from './types'

interface ConnectAppsBannerProps {
  onAppSelect: (app: AppType) => void
  partnerId?: number
  inDummyFlow?: boolean
}

const ConnectAppsBanner: React.FC<ConnectAppsBannerProps> = ({
  onAppSelect,
  partnerId,
  inDummyFlow = false
}) => {
  const router = useRouter()

  const handleTrelloConnect = () => {
    if (inDummyFlow) {
      showCustomToast(
        'Info',
        'Trello integration not available in demo mode',
        'info',
        5000
      )
      return
    }

    if (partnerId) {
      // Redirect to Trello OAuth with partnership context
      router.push(`/api/trello?source=partnership&partnerId=${partnerId}`)
    } else {
      // Fallback to normal app selection
      onAppSelect('trello')
    }
  }

  const handleNotionConnect = () => {
    if (inDummyFlow) {
      showCustomToast(
        'Info',
        'Notion integration not available in demo mode',
        'info',
        5000
      )
      return
    }
    onAppSelect('notion')
  }

  const handlePlusConnect = () => {
    if (inDummyFlow) {
      showCustomToast(
        'Info',
        'Additional app integrations not available in demo mode',
        'info',
        5000
      )
      return
    }
    onAppSelect('plus')
  }

  return (
    <div className='relative min-h-32 overflow-hidden rounded-2xl border border-[#DFE3E8] p-4'>
      <Image
        src='/ai-partner-pulse.jpg'
        alt='AI Partner Pulse'
        fill
        className='object-cover object-center'
        priority
      />
      <div className='relative z-10 rounded-xl p-4 backdrop-blur-sm'>
        <h3 className='mb-2 text-base font-semibold text-text-100'>
          Connect your apps
        </h3>
        <p className='mb-4 text-sm text-text-60'>
          Once connected, you can import the tasks directly into this system.
        </p>
        <div className='flex gap-2'>
          <Button
            variant='primary'
            size='icon'
            className='h-9 w-9 rounded border border-[#DEE2E6] bg-white p-0'
            onClick={handleTrelloConnect}
          >
            <AppIcon app='trello' size={20} />
          </Button>
          <Button
            variant='primary'
            size='icon'
            className='h-9 w-9 rounded border border-[#DEE2E6] bg-white p-0'
            onClick={handleNotionConnect}
          >
            <AppIcon app='notion' size={20} />
          </Button>
          <Button
            variant='primary'
            size='icon'
            className='h-9 w-9 rounded border border-[#DEE2E6] bg-white p-0'
            onClick={handlePlusConnect}
          >
            <AppIcon app='plus' size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConnectAppsBanner
