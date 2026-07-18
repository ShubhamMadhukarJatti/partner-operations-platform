import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

import VideoModal from '../../partner-space/_components/VideoModal'
import NewReferralProgram from './new-referral-program-modal'

type Props = {}

const PartnerProgramPlaceholder: React.FC<{ hasCampaign: boolean }> = ({
  hasCampaign
}) => {
  const router = useRouter()

  return (
    <div
      className='flex  justify-between rounded-xl border border-[#A1BAF1] px-10 py-8'
      style={{
        background:
          'linear-gradient(95.75deg, #E4F8FF -9.27%, #FFFFFF 51.72%, #E1E1F8 112.7%)'
      }}
    >
      <div className='max-w-md space-y-7'>
        <div>
          <h3 className='text-shark-lg font-bold text-[#454284]'>
            Create Referral Program with your active Partners to 4x your
            outcomes
          </h3>
          <p className='mt-4 text-shark-sm text-[#524E8C]'>
            Track and maintain the transactions from your partner channels
          </p>
        </div>

        <div>
          {hasCampaign ? (
            <Button
              onClick={() => router.push('/partner-programs/home')}
              variant='primary'
            >
              Open Programs
            </Button>
          ) : (
            <NewReferralProgram />
          )}
        </div>
      </div>

      <VideoModal
        title=''
        videoUrl='https://storage.googleapis.com/sharkdom_resources/dashboard_play/sharkdom-referral-program.mp4'
        thumbnailUrl='/video-placeholder.png'
      />
    </div>
  )
}

export default PartnerProgramPlaceholder
